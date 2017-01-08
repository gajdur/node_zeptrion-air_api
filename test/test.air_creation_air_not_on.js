"use strict";

var expect = require("chai").expect,
    zeptrion = require("../"),
    testValues = require("./support/testValues.js"),
    errors = require("../zeptrion-api/errors");


describe.skip("--- Air creation tests if zeptrion air is not on ---", function() {
//describe.only("--- Zeptrion air is not on the Net (No power on Zeptrion AIR ) ---", function() {

    describe("#create airs with ip_host and port", function() {
        this.timeout(5000);

        it("should return a timeout ERROR 1222", function(finish) {
            var air_promise = zeptrion.air(testValues.host_ip);
            air_promise.then(function(air) {
                air.getAirConfig(function(err, air_config) {
                    expect(err.errno).to.equal(1222);
                    finish();
                });
            }, function(error) {
                finish(error)
            }).done();
        });
    });
});
