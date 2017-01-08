"use strict";
// Error-errno 1400
// 1400 = User Input Error

var Q = require("Q"),
    axios = require("axios"),
    errors = require("./errors");

/**
 * Makes an air_config and returns the promise to it
 * @param Object = {host_ip:"", port:"", timeout:""}
 * --> host_ip (mandatory)(ip of the ZeptrionAir Device)
 * --> port (mandatory) (port of the ZeptrionAir Device --> or 80 if not set)
 * --> timeout (mandatory) (timeout in millisecond for the call to the ZeptrionAir Device to get all information --> or 1000 if not set)
 * --> defaults with all the default configurations
 * @return return the air_config Promise or rejection if error
 */
function getAirConfigPromise(inputs) {
    var deferred = Q.defer();
    if (!inputs || !inputs.host_ip || inputs.timeout || !inputs.port) {
        deferred.reject(errors.createApiError({errno:1401}));
    }
    var path_keys = Object.keys(inputs.defaults.default_path),
        call_functions = [],
        base_path = "http://" + inputs.host_ip + ":" + inputs.port,
        getResult = function(path) {
            return axios.get(base_path + path,{timeout:inputs.timeout});
        };
    for (var i = 0; i < path_keys.length; i++) {
        call_functions.push(getResult(inputs.defaults.default_path[path_keys[i]]));
    }
    var config_promise = axios.all(call_functions);
    return config_promise;
}
module.exports.getAirConfigPromise = getAirConfigPromise;
