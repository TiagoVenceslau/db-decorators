/**
 * @enum LOGGER_LEVELS
 *
 * @category Constants
 */
export const LOGGER_LEVELS = {
    ALL: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    CRITICAL: 5
}

/**
 * Default messages
 *
 * constant LOGGING_MSG
 *
 * @memberOf db-decorators.logging
 */
export const LOGGING_MSG = {
    LEVEL_CHANGED: "Logger Level changed from {0} to {1}",
    LOGGER_CHANGED: "Logger changed"
}