const Stripe = require("stripe");
const express = require("express");
const app1 = express();
const bodyParser = require("body-parser");
app1.use(bodyParser.raw({ type: "application/json" }));

const createPool = require("../../config/database");
const pool = createPool();

// var http = require('http');
// const { notifiProxy } = require("../../utils/proxyServer");

let sessionID;

// const notiCall = () => {
//   var data = {
//     details: "hello this is noti from node js"
//   };

//   var postData = JSON.stringify(data);

//   var options = {
//     host: 'localhost',
//     port: 8082,
//     path: '/notification',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json', 
//       'Content-Length': Buffer.byteLength(postData)
//     }
//   };

//   var httpreq = http.request(options, function (response) {
//     response.setEncoding('utf8');
//     let responseData = '';
//     response.on('data', function (chunk) {
//       responseData += chunk;
//     });
//     response.on('end', function () {
//     });
//   });

//   // Error handling for the request
//   httpreq.on('error', function (error) {
//     console.error('Error making request to notification server:', error);
//     res.status(500).send("Internal Server Error");
//   });

//   httpreq.write(postData);
//   // httpreq.end();
// }


exports.userPayment = async (req, res) => {
  console.log("✅ Payment endpoint hit");

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "rich dad and poor dad",
            },
            unit_amount: 10 * 100,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment-failure",
    });

    console.log("SESSION URL 👉", session.url);

    return res.status(200).json({
      url: session.url,
    });

  } catch (error) {
    console.error("❌ Stripe error:", error);
    return res.status(500).json({ error: error.message });
  }
};


// Webhook endpoint for handling events
exports.webhooks = async (req, res) => {
  let event;
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      "whsec_l5SN9IhXxJLpvRGIqk8H8UJoEzYjtyGt"
    );

  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const paymentIntentId = session.payment_intent;
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId
        );
    
        if(paymentIntentId){
          const updateText =
          "UPDATE payment SET status = $1, payment_id = $2 WHERE session_id = $3 RETURNING *";
        const updateValues = [paymentIntent.status, paymentIntentId, "sessionID"];

        pool.query(updateText, updateValues, (updateError, updateResults) => {
          if (updateError) {
            throw updateError;
          }
        })
        } 
      } catch (error) {
        console.error("Error retrieving PaymentIntent:", error);
      }
      break;

    default:
      return res.status(400).end();
  }

  res.status(200).end();
};


exports.homeFunc = async (req, res) => {
  console.log("this is here")
 res.json({ "desc": "this is confirm that api is running" });
};