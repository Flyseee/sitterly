import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export class AuthUtils {
    static async  hashPassword(password: string): Promise<string> {
        const salt = randomBytes(16).toString('hex');
        const derived = (await scrypt(password, salt, 64)) as Buffer;
        return `${salt}:${derived.toString('hex')}`;
    }

    static async verifyPassword(
        stored: string,
        supplied: string,
    ): Promise<boolean> {
        const [salt, key] = stored.split(':');
        const derived = (await scrypt(supplied, salt, 64)) as Buffer;
        return derived.toString('hex') === key;
    }
}