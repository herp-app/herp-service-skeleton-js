require('dotenv').config()
const axios = require('axios').default;
var express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());


/**
 * This endpoint is default and called whenever a node instance of this service gets triggerd inside a workflow
 */
app.post('/do', function (req, res) {
    console.log("The do function is called via a workflow");
    console.log("Body is", req.body);
    res.send({data: "Hello " + req.body.data.data.customer.name});
});


/**
 * This endpoint is called by herp if a user requests installation info.
 */
app.get('/install', function (req, res) {
  res.send({
    nodeDefinitions: [
        {
            name: "helloWorld",
            label: "Hello World Node",
        }
    ],
  });
});


/**
 * The install post method will call by herb after a successfull installation.
 * This can be used to populate database with data
 */
app.post('/install', function (req, res) {
    const data = req.body;
    console.log("service is installed");
    console.log("user: ", data.user);
    console.log("password: ", data.password);
    res.send({});
  });



app.listen(6100, async function () {
    console.log('Example app listening on port 6100!');
    // register service to herp
    await register();
});

const register = async () => {
    console.log("Registered service to herp on " + process.env.HERP_HOST);
    try {
        result = await axios.post("http://" + process.env.HERP_HOST + "/services/register", {
            name: "helloworld",
            host: "localhost:6100",
            title: "Hello World Service",
            version: "1.0.0",
            description: "Hello World example for a workflow"
        });

        console.log("Result", result.data);
    } catch (e) {
        console.error(e.message);
    }
}


