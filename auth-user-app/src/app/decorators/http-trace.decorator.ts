import { TRACERS } from '~src/telemetry/trace/const/const';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

export const HTTPTrace = (name: string) =>
    Trace(`HTTP ${name}`, { logInput: true, logOutput: true }, TRACERS.HTTP, {
        root: true,
    });
