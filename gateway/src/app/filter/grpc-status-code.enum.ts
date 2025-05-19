export enum GrpcStatusCode {
    /**
     * OK: Операция выполнена успешно.
     */
    OK = 0,

    /**
     * CANCELLED: Операция была отменена, как правило, вызывающим кодом.
     */
    CANCELLED = 1,

    /**
     * UNKNOWN: Неизвестная ошибка.
     */
    UNKNOWN = 2,

    /**
     * INVALID_ARGUMENT: Передан неверный аргумент.
     */
    INVALID_ARGUMENT = 3,

    /**
     * DEADLINE_EXCEEDED: Истекло время ожидания выполнения операции.
     */
    DEADLINE_EXCEEDED = 4,

    /**
     * NOT_FOUND: Запрашиваемая сущность не найдена.
     */
    NOT_FOUND = 5,

    /**
     * ALREADY_EXISTS: Сущность, которую пытались создать, уже существует.
     */
    ALREADY_EXISTS = 6,

    /**
     * PERMISSION_DENIED: У вызывающего нет прав для выполнения операции.
     */
    PERMISSION_DENIED = 7,

    /**
     * RESOURCE_EXHAUSTED: Истощены доступные ресурсы (например, превышена квота).
     */
    RESOURCE_EXHAUSTED = 8,

    /**
     * FAILED_PRECONDITION: Операция отклонена, так как система не находится в необходимом состоянии.
     */
    FAILED_PRECONDITION = 9,

    /**
     * ABORTED: Операция прервана, обычно из-за конфликтов или ошибок конкурентного доступа.
     */
    ABORTED = 10,

    /**
     * OUT_OF_RANGE: Попытка обращения за пределы допустимого диапазона.
     */
    OUT_OF_RANGE = 11,

    /**
     * UNIMPLEMENTED: Операция не поддерживается или не реализована.
     */
    UNIMPLEMENTED = 12,

    /**
     * INTERNAL: Внутренняя ошибка сервера.
     */
    INTERNAL = 13,

    /**
     * UNAVAILABLE: Сервис в данный момент недоступен.
     */
    UNAVAILABLE = 14,

    /**
     * DATA_LOSS: Произошла необратимая потеря или повреждение данных.
     */
    DATA_LOSS = 15,

    /**
     * UNAUTHENTICATED: Нет допустимых учетных данных для выполнения запроса.
     */
    UNAUTHENTICATED = 16,
}
