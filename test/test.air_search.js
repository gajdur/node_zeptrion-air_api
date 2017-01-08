"use strict";

var expect = require("chai").expect,
    zeptrion = require("../"),
    testValues = require("./support/testValues.js");


describe("--- Air search tests mDNS ---", function() {

    describe("#search airs with running mDNS services", function() {
        this.timeout(7500);
        it("registered Air needs to have config.id.sys = Zeptrion", function(finish) {
            var locator = zeptrion.airRunningLocator();
            locator.on("serviceUp", function(air_promise) {
                //console.log(":::::: UP ::::::::");
                air_promise.then(function(air) {
                    air.getAirConfig(function(err, air_config) {
                        if (err)
                            finish(err);
                        else {
                            try {
                                expect(air_config.id).to.have.property("sys").to.equal("ZEPTRION");
                            } catch (e) {
                                finish(e);
                            }
                        }
                    });
                }, function(error) {
                    finish(error)
                }).done();
            });
            locator.on("serviceDown", function(air_promise) {
                //console.log(":::::: Down ::::::::");
                air_promise.then(function(air) {
                    air.getAirConfig(function(err, air_config) {
                        if (err)
                            finish(err);
                        else {
                            try {
                                expect(air_config.id).to.have.property("sys").to.equal("ZEPTRION");
                            } catch (e) {
                                finish(e);
                            }
                        }
                    });
                }, function(error) {
                    finish(error)
                }).done();
            });
            setTimeout(function() {
                locator.stopScanning();
                finish();
            }, 5000);
        });
    });
});
