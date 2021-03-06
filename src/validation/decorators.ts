import {UpdateValidationKeys} from "./constants";
import {DBKeys, DEFAULT_ERROR_MESSAGES, DEFAULT_TIMESTAMP_FORMAT} from "../model";
import {DBOperations, on, OperationKeys} from "../operations";
import {ReadOnlyValidator, TimestampValidator, UpdateValidator} from "./validation";
import {date, getValidatorRegistry, required} from "@tvenceslau/decorator-validation/lib";
import {Callback, Repository} from "../repository";
import DBModel from "../model/DBModel";

const getDBUpdateKey = (str: string) => UpdateValidationKeys.REFLECT + str;

/**
 * Marks the property as readonly.
 *
 * @param {string} [message] the error message. Defaults to {@link DEFAULT_ERROR_MESSAGES.READONLY.INVALID}
 * @param {{new: UpdateValidator}} [validator] defaults to {@link ReadOnlyValidator}
 *
 * @decorator readonly
 *
 * @category Decorators
 */
export function readonly(message: string = DEFAULT_ERROR_MESSAGES.READONLY.INVALID, validator: {new(): UpdateValidator} = ReadOnlyValidator) {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(
            getDBUpdateKey(DBKeys.READONLY),
            {
                message: message
            },
            target,
            propertyKey
        );
        getValidatorRegistry().register({validator: validator, validationKey: UpdateValidationKeys.READONLY})
    }
}

/**
 * Marks the property as timestamp.
 * Makes it {@link required}
 * Makes it a {@link date}
 *
 * Date Format:
 *
 * <pre>
 *      Using similar formatting as Moment.js, Class DateTimeFormatter (Java), and Class SimpleDateFormat (Java),
 *      I implemented a comprehensive solution formatDate(date, patternStr) where the code is easy to read and modify.
 *      You can display date, time, AM/PM, etc.
 *
 *      Date and Time Patterns
 *      yy = 2-digit year; yyyy = full year
 *      M = digit month; MM = 2-digit month; MMM = short month name; MMMM = full month name
 *      EEEE = full weekday name; EEE = short weekday name
 *      d = digit day; dd = 2-digit day
 *      h = hours am/pm; hh = 2-digit hours am/pm; H = hours; HH = 2-digit hours
 *      m = minutes; mm = 2-digit minutes; aaa = AM/PM
 *      s = seconds; ss = 2-digit seconds
 *      S = miliseconds
 * </pre>
 *
 * @param {string[]} operation The {@link DBOperations} to act on. Defaults to {@link DBOperations.CREATE_UPDATE}
 * @param {string} [format] The TimeStamp format. defaults to {@link DEFAULT_TIMESTAMP_FORMAT}
 * @param {{new: UpdateValidator}} [validator] defaults to {@link TimestampValidator}
 *
 * @decorator timestamp
 *
 * @category Decorators
 */
export const timestamp = (operation: string[] = DBOperations.CREATE_UPDATE, format: string = DEFAULT_TIMESTAMP_FORMAT, validator: {new(): UpdateValidator} = TimestampValidator) => (target: any, propertyKey: string) => {
    date(format, DEFAULT_ERROR_MESSAGES.TIMESTAMP.DATE)(target, propertyKey);
    required(DEFAULT_ERROR_MESSAGES.TIMESTAMP.REQUIRED)(target, propertyKey);
    on(operation, function(this: Repository<DBModel>, model: DBModel, callback?: Callback){
        model[propertyKey] = new Date();
        if (callback)
            return callback(undefined, model);
    })(target,propertyKey);

    if (operation.indexOf(OperationKeys.UPDATE) !== -1){
        Reflect.defineMetadata(
            getDBUpdateKey(DBKeys.TIMESTAMP),
            {
                message: DEFAULT_ERROR_MESSAGES.TIMESTAMP.INVALID
            },
            target,
            propertyKey
        );

        getValidatorRegistry().register({validator: validator, validationKey: UpdateValidationKeys.TIMESTAMP})
    }
}