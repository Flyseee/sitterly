import { Entity } from 'typeorm';
import { PartialType } from '@nestjs/mapped-types';
import { CreateRatingDto } from '~src/data-modules/rating/dto/createRating.dto';

@Entity()
export class UpdateRatingDto extends PartialType(CreateRatingDto) {}
