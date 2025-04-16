export const DEFAULT_TRACER = 'service-tracer';
export const TYPEORM_TRACER = 'typeorm-tracer';
export const CONTROLLER_TRACER = 'controller-tracer';
export const EXTERNAL_RQ_TRACER = 'external-request-tracer';
export const GRPC_TRACER = 'grpc-tracer';

export enum TRACERS {
    DEFAULT = DEFAULT_TRACER,
    TYPEORM = TYPEORM_TRACER,
    GRPC = GRPC_TRACER,
    CONTROLLER = CONTROLLER_TRACER,
    EXTERNAL_RQ = EXTERNAL_RQ_TRACER,
}

export enum EVENTS {
    CONTROLLER_RESULT = 'controller_result',
    GRPC_INCOMING_REQUEST = 'grpc_incoming_request',
    GRPC_INCOMING_RESPONSE = 'grpc_incoming_response',
    GRPC_OUTGOING_RESPONSE = 'grpc_outgoing_response',
    GRPC_OUTGOING_REQUEST = 'grpc_outgoing_request',
    GRPC_INTERNAL_SERVER_ERROR = 'grpc_internal_error',
    GRPC_UNAUTHORIZED_ERROR = 'grpc_unauthorized_error',
    GRPC_BAD_REQUEST_ERROR = 'grpc_bad_request_error',
    GRPC_NOT_FOUND_ERROR = 'grpc_not_found_error',
    GRPC_UNPROCESSABLE_ENTITY_ERROR = 'grpc_unprocessable_entity_error',
    GRPC_FORBIDDEN_ERROR = 'grpc_forbidden_error',
    GRPC_CONFLICT_ERROR = 'grpc_conflict_error',
    DATABASE_ERROR = 'database_error',
    POSTGRESQL_QUERY = 'postgresql_query',
    POSTGRESQL_QUERY_RESULT = 'postgresql_query_result',
}
