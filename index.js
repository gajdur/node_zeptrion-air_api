"use strict";

//
// This wrapper is to provide some continuity in the modifications of the APIs over time
//

var searchAirs = require("./zeptrion-api/air_search");
var Zeptrion = require("./zeptrion-api");
//var lightState = require("./zeptrion-api/lightstate");
//var scheduledEvent = require("./zeptrion-api/scheduledEvent");
//var scene = require("./zeptrion-api/scene");
//var timer = require("./zeptrion-api/timer");
var ApiError = require("./zeptrion-api/errors").ApiError;


module.exports = {
    ZeptrionApi: Zeptrion,
    AirAPI: Zeptrion,
    air: Zeptrion,
    api: Zeptrion,

    //lightState: lightState,
    //scheduledEvent: scheduledEvent,
    //scene: scene,
    //timer: timer,

    /**
     * Returns a new AirLocator that is looking up for ZeptreonAir Devices (Airs) with help of mDNS on the Network and start scanning
     * The AirLocator sents the following events:
     * @event start if the Scanner starts scanning
     * @event serviceUp if a new Air has registered on the mDNS Service and sent the Air with the event
     * @event serviceDown if the Air has deregistered on the mDNS Service and sent the Air with the event
     * @event stop if the Scanner stops scanning
     * @event error if the Scanner stops scanning and sent the error with the event
     * The AirLocator has the following Methods:
     * @method startScanning() starts scanning
     * @method getAllFoundAirs() return all already found airs during scanning
     * @method stopScanning() stops scanning
     */
    airRunningLocator: searchAirs.startAirLocator,

    ApiError: ApiError
};
