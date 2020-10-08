const axios = require('axios').default;
const express = require('express');
const bodyParser = require('body-parser');
const Config = require('./configuration');


/**
 * Configurations
 * This configurations are hard coded and should not be changed on runtime! Please change it to your needs.
 */

 //
// machine readable name of your service. 
// This equals the unique identifier. 
// Thats why you should use your website for this.
//
const serviceName = "skeleton.herp.app"; 

//
// Human readable title of your Service
//
const serviceTitle = "JS Skeleton Service";

//
// Service description
//
const serviceDescription = "A skeleton service with all necessary functionality to talk with herp but without any logic. Feel free to integrate your ideas!";

//
//  actual version of the instance
//
const serviceVersion = "1.0.0";

Config.initiate();


/**
 * Register function to knock at herps door.
 */
const register = async () => {
    console.log("Register service to herp on " + Config.get().herp_uri);
    try {
        result = await axios.post(Config.get().herp_uri + "/services/register", {
            name: serviceName,
            host: Config.get().hostname + ":" + Config.get().port,
            title: serviceTitle,
            version: serviceVersion,
            description: serviceDescription,
        });

        // save id to config
        Config.set("id", result.data._id);
        Config.save();
        console.log("Registered service sucessfull");
    } catch (e) {
        console.error(e.message);
    }
}



/**
 * Starting the webserver
 */
var app = express();
app.use(bodyParser.json());


/**
 * This endpoint is default and called whenever a node instance of this service gets triggerd inside a workflow
 */
app.post('/do', function (req, res) {
    const outputField = req.body.inputField1 + " " + req.body.inputField2;
    res.send({outputField});
});


/**
 * This endpoint is called by herp if a user requests installation info.
 */
app.get('/install', function (req, res) {
  res.send({
    nodeDefinitions: [
        // #1 a node definition with one input and one output
        {
            name: "combineString",
            label: "Combine two strints to one single string",
            inputs: [
                {
                    fieldType: "string",
                    name: "inputField1",
                    label: "String Input 1"
                },
                {
                    fieldType: "string",
                    name: "inputField2",
                    label: "String Input 2"
                },
            ],
            outputs: [
                {
                    fieldType: "string",
                    name: "outputField",
                    label: "Combined strings"
                },
            ]
        },
        // add fruther nodeDefinitions for workflows here
    ],
    // // enable this to send custom configurations to installation
    //   configurations: [],
    // // enable this to set permissions for the workflow user
    //   permissions: [
    //       "content:system.users:all", // can read write and update users
    //   ],
  });
});


/**
 * The install post method will call by herb after a successfull installation.
 * This can be used to populate database with data
 */
app.post('/install', function (req, res) {
    const data = req.body;
    console.log("service is installed");

    // store credentials of created service user in config file
    nconf.set("service:user", data.user);
    nconf.set("service:password", data.password);
    

    res.send({});
  });



app.listen(6100, async function () {
    console.log(`Service listening on ${Config.get().hostname}:${Config.get().port}!`);
    // register service to herp
    await register();
});



const getToken = async () => {
    try {
        result = await axios.post(Config.get().herp_uri + "/user/login", {
            email,
            password,
        });

        token = result.data.token;

        console.log("Logged in");
    } catch (e) {
        console.error(e.message);
    }
}
