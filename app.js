const express = require('express');
const app = express();
const cors=require("cors");
const bodyParser = require('body-parser');

app.use(bodyParser.raw({ type: 'application/json' }));

// app.use(express.json());
// const corsOptions ={
//     origin:'*', 
//     credentials:true,
//     optionSuccessStatus:200,
//  }

app.use(cors({
  origin: "http://localhost:5173",  // allow frontend
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

const payment = require('./routes/payment')

//proxy request in nodejs start
  // var proxy = require("http-proxy").createProxyServer({
  //     host: "http://localhost:8082",
  //   });

  //   app.use("/notification", function (req, res, next) {
  //     proxy.web(
  //       req,
  //       res,
  //       {
  //         target: "http://localhost:8082/notification",
  //       },
  //       next
  //     );
  //   });
    
  //   proxy.on("proxyReq", function (proxyReq, req, res, options) {
  //     console.log("request : url=", req.url, req.body ? "body=" + req.body : "");
  //     console.log("response: status=", res.statusCode);
  //   });
//proxy request in nodejs start

app.use('/payment', payment)

app.use(cors());

module.exports = app;