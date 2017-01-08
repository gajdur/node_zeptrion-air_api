"use strict";
// Error-errno 1200
// 1202 = User Input Error
// 1201 = User Input Error
// 1221 = EHOSTUNREACH (404 Error)
// 1222 = EHOSTUNREACH (Timeout Error)
// 1223 = EHOSTUNREACH (Not reachable Error)
// 1224 = xml2js_PARSER_ERROR
// 1299 = undefined error

var Q = require("Q"),
    errors = require("./errors"),
    xml2js = require('xml2js'),
    air_creater = require("./air_creater");


function Air(config_promise, host_ip, port) {
    this.config_promise = config_promise;
    this.config = {};
    this.port = port;
    this.url = "http://" + host_ip + ":" + port;
}

/**
 * Makes an ZeptrionAir Devices API (Air) and returns the promise to it
 * @param Object = {host_ip:"", port:"", timeout:""}  or only the host_ip
 * --> host_ip (mandatory)(ip of the ZeptrionAir Device)
 * --> port (optional) (port of the ZeptrionAir Device --> or 80 if not set)
 * --> timeout (optional) (timeout in millisecond for the call to the ZeptrionAir Device to get all information --> or 1000 if not set)
 * --> test (!!! only for tests, you need to know what you are doing !!!) {}
 * @return return the Air Promise or rejection if error
 */
module.exports = function(inputs) {
    var air,
        deferred = Q.defer(),
        defaults = require("./default_config").defaults,
        has_error = false;
    if (!inputs || (inputs === undefined)) {
        deferred.reject(errors.createApiError({errno:1202}));
        has_error = true;
    } else {
        if (typeof inputs == "string") {
            var host_ip = inputs;
            inputs = {
                host_ip: host_ip,
                port: inputs.default_port,
                timeout: inputs.default_timeout
            };
        }
        if ("test" in inputs) {
            if ("defaults" in inputs.test) {
                defaults = inputs.test.defaults;
            }
        }
        inputs.defaults = defaults;

        if (!inputs.host_ip) {
            deferred.reject(errors.createApiError({errno:1201}));
            has_error = true;
        } else {
            if (!inputs.timeout) {
                inputs.timeout = inputs.defaults.default_timeout;
            }
            if (!inputs.port) {
                inputs.port = inputs.defaults.default_port;
            }
            var config_promise = air_creater.getAirConfigPromise(inputs);
            deferred.resolve(new Air(config_promise, inputs.host_ip, inputs.port));
        }
    }
    return deferred.promise;
};

/**
 * returns all the air_configs
 * @callback
 * @
 */
Air.prototype.getAirConfig = function(callback) {
    if ("ntp" in this.config) {
        callback(null, this.config);
    } else {
        this.config_promise.then(function(results) {
            var new_error, configCounter = 0;
            for (var i = 0; i < results.length; i++) {
                var parserE = new xml2js.Parser({
                    explicitArray: false
                });
                try {
                    parserE.parseString(results[i].data, function(err, result) {
                        if (!new_error && err) {
                            new_error = err;
                        } else {
                            var temp_key = Object.keys(result);
                            this.config[temp_key[0]] = result[temp_key[0]];
                            configCounter += 1;
                        }
                    }.bind(this));
                } catch (err) {
                    new_error = err;
                }
            }
            var intervalObject = setInterval(function() {
                if (new_error) {
                    var new_err;
                    var error = new_error;
                    var new_err = errors.createApiError({file:"zeptrion-api/index.js",org_error:error});
                    callback(new_err, null);
                    clearInterval(intervalObject);
                } else if (configCounter == results.length) {
                    if (new_error)
                        callback(new_error);
                    else
                        callback(null, this.config);
                    clearInterval(intervalObject);
                }
            }.bind(this), 0);
        }.bind(this), function(error) {
            var new_err;
            var new_err = errors.createApiError({file:"zeptrion-api/index.js",org_error:error});
            callback(new_err);
        });
    }
}
