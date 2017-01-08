module.exports = {
    host_ip: "192.168.30.225",
    locateTimeout: 3000,
    port: 80,
    wrong_host_ip: "192.168.30.1",
    wrong_port: {
        host_ip: "192.168.30.225",
        port: "81"
    },
    wrong_timeout: {
        host_ip: "192.168.30.225",
        timeout: 100
    },
    wrong_default_path: {
        host_ip: "192.168.30.225",
        test: {
            defaults: {
                default_port: 80,
                default_timeout: 1500,
                default_path: {
                    default_air_net_path: "/zapi/smartfront/id",
                    default_air_rssi_signal_strenght_path: "/zrap/rssi",
                    default_air_device_info: "/zrap/id",
                    default_air_device_name: "/zrap/loc",
                    default_air_device_date: "/zrap/date",
                    default_air_device_ntp: "/zrap/ntp"
                }
            }
        }
    }
};
