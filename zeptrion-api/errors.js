/**
 * @fileOverview Error Helper.
 * @author <a href="mailto:swissglider@mailschweiz.com">Swissglider</a>
 * @version 0.0.1
 */

/**
 * @example
 * var str = "abc";
 * console.log(repeat(str, 3)); // abcabcabc
 */

"use strict";

var util = require('util');
var errors = require("./errors.json");

/**
 * An Abstract base class for custom errors.
 * @constructor
 * @extends Error
 * @param msg The error message
 * @param constr The constructor to call.
 */
var AbstractError = function(msg, constr) {
    // If defined, pass the constr property to V8's captureStackTrace to clean up the output
    Error.captureStackTrace(this, constr || this);

    // If defined, store a custom error message
    this.message = msg || "Error";
};
util.inherits(AbstractError, Error);
AbstractError.prototype.name = "Abstract Error";

/**
 * An Error Type for API related errors when calling the Zeptrion Airs.
 * @constructor ApiError
 * @extends AbstractError
 * @param  {[type]} error The error object returned from the request.
 */
var ApiError = function(error) {
    var errorMessage,
        code,
        errno,
        syscall,
        org_error;

    errorMessage = "ZEPTRION_AIR_API_ERROR: " + errno + " ==> " + errorMessage;

    ApiError.super_.call(this, errorMessage, this.constructor);
    this.type = error.code;
    this.code = error.code;
    this.errno = error.errno;
    this.syscall = error.syscall;
    this.org_error = error.org_error;

    if (error.address) {
        this.address = error.address;
    }
};
util.inherits(ApiError, AbstractError);
ApiError.prototype.name = "Api Error";


/**
 * [createApiError description]
 * @method createApiError
 * @param  {[type]}       error_conf [description]
 * @return {ApiError}                  [description]
 */
function createApiError(error_conf) {
    if ("errno" in error_conf) {
        return _getCorrectError(error_conf);
    }

    var error_descs = errors.APIError,
        error_desc_keys = Object.keys(error_descs);
    error_conf.errno = 9999;
    for (var i = 0; i < error_desc_keys.length; i++) {
        var error_desc = error_descs[error_desc_keys[i]];
        if (!(typeof error_desc == "string") && ("file" in error_desc) && ("file" in error_conf) && (error_desc.file == error_conf.file)) {
            if (("search_string" in error_desc) && (error_conf.org_error.toString().indexOf(error_desc.search_string) !== -1)) {
                error_conf.errno = parseInt(error_desc_keys[i]);
            }
        }
    }
    return _getCorrectError(error_conf);
}
module.exports.createApiError = createApiError;

/**
 * [_getCorrectError description]
 * @method _getCorrectError
 * @param  {[type]}         error_conf [description]
 * @return {[type]}                    [description]
 * @private
 */
function _getCorrectError(error_conf) {
    var error_desc = errors.APIError[error_conf.errno];

    return new ApiError({
        code: error_desc.code || error_conf.org_error.code,
        description: error_desc.description || error_conf.org_error.toString(),
        errno: error_conf.errno,
        syscall: error_desc.syscall || error_conf.org_error.syscall,
        org_error: error_conf.org_error
    });
}
