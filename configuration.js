const nconf = require('nconf');
const path = require('path');
const os = require("os");
const fs = require('fs');
// const { config } = require('dotenv/types');

/**
 * The config object the system will work with
 */
let config;

//
// the path of the configuration to store
//
const configPath = path.join(__dirname, `configuration/config${process.env.NODE_ENV ? "." + process.env.NODE_ENV : ""}.json`);


function initiate() {
    /**
     * Dynamical Configuration
     * Handle the configuration that can be changed per instance. Using nconf for this feature.
     */
    nconf.use('memory');

    //
    // load configurations from arguments
    //
    nconf.argv();

    //
    // load configurations from environment variables
    //
    nconf.env({
        separator: '__',
        lowerCase: true,
    });

    //
    // load configuration from file based on node_env
    //
    console.log("Try to load configuration ", configPath);
    if (fs.existsSync(configPath)) {
        nconf.file(configPath);
        console.log("Configuration ", configPath, "found and loaded");
    }

    //
    //  setting defaults
    //
    nconf.defaults({
        service: {
            hostname: os.hostname(),
            port: 6100,
        }
    }).required(['service:herp_uri']);

    config = nconf.get("service");
}

function set(key, value) {
    nconf.set("service:" + key, value);
    config = nconf.get("service");
}

function save() {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
}

function get() {
    return config;
}

module.exports = {
    save,
    get,
    initiate,
    set,
}