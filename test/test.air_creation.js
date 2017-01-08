"use strict";

var expect = require("chai").expect,
    zeptrion = require("../"),
    testValues = require("./support/testValues.js");


describe("--- Air creation tests ---", function() {

    describe("#create airs with ip_host and port", function() {
        this.timeout(5000);

        it("should return the Zeptrion Air on the net and get config.net.ip as sample", function(finish) {
            var air_promise = zeptrion.air(testValues.host_ip);
            air_promise.then(function(air) {
                air.getAirConfig(function(err, air_config) {
                    if (err)
                        finish(err);
                    else {
                        try {
                            expect(air_config.id).to.have.property("sys").to.equal("ZEPTRION");
                            finish();
                        } catch (e) {
                            finish(e);
                        }
                    }
                });
            }, function(error) {
                finish(error)
            }).done();
        });

        it("(no inputs to the zeptrion.air function) ==> should return error number 1202", function(finish) {
            var air_promise = zeptrion.air();
            air_promise.fail(function(error) {
                expect(error.errno).to.equal(1202);
                finish();
            }).done();
        });

        it("(IP is not a zeptrion Air - 404 Error) ==> should return error number 1221", function(finish) {
            var air_promise = zeptrion.air(testValues.wrong_host_ip);
            air_promise.then(function(air) {
                air.getAirConfig(function(err, air_config) {
                    expect(err.errno).to.equal(1221);
                    finish();
                });
            }, function(error) {
                finish(error)
            }).done();
        });

        it("(hostname is not set in the input for the zeptrion.air function) ==> should return error number 1201", function(finish) {
            var air_promise = zeptrion.air({});
            air_promise.fail(function(error) {
                expect(error.errno).to.equal(1201);
                finish();
            }).done();
        });

        it("(wrong default_path to call a request that gives a json insteed xml, to get a parser error) ==> should return error number 1224", function(finish) {
            var air_promise = zeptrion.air(testValues.wrong_default_path);
            air_promise.then(function(air) {
                air.getAirConfig(function(err, air_config) {
                    expect(err.errno).to.equal(1224);
                    finish();
                });
            }, function(error) {
                finish(error)
            }).done();
        });

        it("(timeout error) ==> should return error number 1222", function(finish) {
            var air_promise = zeptrion.air(testValues.wrong_timeout);
            air_promise.then(function(air) {
                air.getAirConfig(function(err, air_config) {
                    expect(err.errno).to.equal(1222);
                    finish();
                });
            }, function(error) {
                finish(error)
            }).done();
        });

        it("(port falsch) ==> should return error number 1223", function(finish) {
            var air_promise = zeptrion.air(testValues.wrong_port);
            air_promise.then(function(air) {
                air.getAirConfig(function(err, air_config) {
                    expect(err.errno).to.equal(1223);
                    finish();
                });
            }, function(error) {
                finish(error)
            }).done();
        });
    });
});
