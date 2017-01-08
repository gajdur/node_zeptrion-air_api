var mdns = require('mdns'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    airAPI = require("./");

/**
 * Returns a new AirLocator that is looking up for ZeptreonAir Devices (Airs) with help of mDNS on the Network and start scanning
 * The AirLocator sents the following events:
 * @event start if the Scanner starts scanning
 * @event serviceUp if a new Air has registered on the mDNS Service
 * @event serviceDown if the Air has deregistered on the mDNS Service
 * @event stop if the Scanner stops scanning
 * @return returns a AirLocator
 */
var startAirLocator = function() {
    return new AirLocator();
}
module.exports.startAirLocator = startAirLocator;

/**
 * Returns a new AirLocator that is looking up for ZeptreonAir Devices (Airs) with help of mDNS on the Network and start scanning
 * The AirLocator sents the following events:
 * @event start if the Scanner starts scanning
 * @event serviceUp if a new Air has registered on the mDNS Service and sent the Air promise with the event
 * @event serviceDown if the Air has deregistered on the mDNS Service and sent the Air promise with the event
 * @event stop if the Scanner stops scanning
 * @event error if the Scanner stops scanning and sent the error with the event
 * The AirLocator has the following Methods:
 * @method startScanning() starts scanning
 * @method getAllFoundAirs() return all already found airs during scanning
 * @method stopScanning() stops scanning
 */
var AirLocator = function() {
    this.airs = {};
    this.browser = mdns.createBrowser(mdns.tcp('zapp'));
    this.startScanning();
    var self = this;
    EventEmitter.call(this);
}

util.inherits(AirLocator, EventEmitter);

/**
 * starts scanning
 */
AirLocator.prototype.startScanning = function() {
    this.emit('start');
    this.browser.on('serviceUp', function(service) {
        var air_promise = airAPI(service.addresses[0]);
        this.emit('serviceUp', air_promise);
        this.airs[service.name] = air_promise;
    }.bind(this));
    this.browser.on("serviceDown", function(service) {
        if(service.name in this.airs){
            air_promise = this.airs[service.name];
            this.emit('serviceDown', air_promise);
            delete this.airs[service.name];
        }
    }.bind(this));
    this.browser.start();
}

/**
 * return all already found airs (promise) in an Array  during scanning
 */
AirLocator.prototype.getAllFoundAirs = function(){
    return Object.getValues(this.airs);
}

/**
 * stops scanning
 */
AirLocator.prototype.stopScanning = function() {
    this.browser.stop();
    this.emit('stop');
}
