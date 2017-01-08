var defaults = {
    default_port: 80,
    default_timeout: 1500,
    default_path: {
        default_air_net_path: "/zrap/net",
        default_air_rssi_signal_strenght_path: "/zrap/rssi",
        default_air_device_info: "/zrap/id",
        default_air_device_name: "/zrap/loc",
        default_air_device_date: "/zrap/date",
        default_air_device_ntp: "/zrap/ntp"
    }
}

module.exports.defaults = defaults;
