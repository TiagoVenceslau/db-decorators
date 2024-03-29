/**
 * @summary Set of constants to define db CRUD operations and their equivalent 'on' and 'after' phases
 * @const OperationKeys
 *
 * @memberOf module:db-decorators.Operations
 */
export const OperationKeys = {
    REFLECT: 'operations.db.',
    CREATE: 'create',
    READ: "read",
    UPDATE: 'update',
    DELETE: 'delete',
    ON: 'on.',
    AFTER: 'after.'
}
/**
 * @summary Maps out groups of CRUD operations for easier mapping of decorators
 *
 * @const DBOperations
 *
 * @memberOf module:db-decorators.Operations
 */
export const DBOperations = {
    CREATE: [OperationKeys.CREATE],
    READ: [OperationKeys.READ],
    UPDATE: [OperationKeys.UPDATE],
    DELETE: [OperationKeys.DELETE],
    CREATE_UPDATE: [OperationKeys.CREATE, OperationKeys.UPDATE],
    READ_CREATE: [OperationKeys.READ, OperationKeys.CREATE],
    ALL: [OperationKeys.CREATE, OperationKeys.READ, OperationKeys.UPDATE, OperationKeys.DELETE]
}