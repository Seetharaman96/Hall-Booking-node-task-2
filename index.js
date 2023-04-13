import * as dotenv from "dotenv";
dotenv.config();
// const express = require("express"); // "type": "commonjs"
import express from "express"; // "type": "module"
const app = express();
import { MongoClient } from "mongodb";

const PORT = 4000;

// const MONGO_URL = "mongodb://127.0.0.1";
const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL); // dial
await client.connect(); // call
console.log("Mongo is connected !!!  ");

app.use(express.json());

var home =
  "Hello, Welcome to the HallBooking API, For halldetails = /hallDetails, For rooms with booked data = /bookedHalls, For customers with booked data = /bookedCustomers, For number of times booked by a customer = /noOfTimes";
// -----------------------------------------------------------------------------------
// Home Page
app.get("/", function (request, response) {
  response.send(home);
});
// ------------------------------------------------------------------------------------
// Hall details
app.get("/hallDetails", async function (req, res) {
  const result = await client
    .db("b42wd2")
    .collection("hallData")
    .find({})
    .toArray();
  res.send(result);
});
// -------------------------------------------------------------------------------------
// Creating new hall
app.post("/createHall", async function (req, res) {
  const data = req.body;
  const result = await client
    .db("b42wd2")
    .collection("hallData")
    .insertMany(data);
  res.send(result);
});
// --------------------------------------------------------------------------------------
// Booking a room
app.put("/hallBooking/:id", async function (req, res) {
  const { id } = req.params;
  const data = req.body;
  const halls = await client
    .db("b42wd2")
    .collection("hallData")
    .find({})
    .toArray();
  const hall = halls.find((hall) => hall.id === id);
  console.log(hall);
  if (hall.ifBooked == "true") {
    res.send({ message: "Hall already booked" });
  } else {
    const result = await client
      .db("b42wd2")
      .collection("hallData")
      .updateOne({ id: id }, { $set: data });
    res.send(result);
  }
});
// ---------------------------------------------------------------------------------------
// List all rooms with booked data
app.get("/bookedHalls", async function (req, res) {
  const result = await client
    .db("b42wd2")
    .collection("hallData")
    .find({ ifBooked: "true" })
    .project({
      id: 1,
      roomId: 1,
      roomName: 1,
      customerName: 1,
      amenities: 1,
      noOfSeats: 1,
      price: 1,
      bookingStatus: 1,
    })
    .toArray();
  res.send(result);
});
// ---------------------------------------------------------------------------------------
// List all customers with booked data
app.get("/bookedCustomers", async function (req, res) {
  const result = await client
    .db("b42wd2")
    .collection("hallData")
    .find({ ifBooked: "true" })
    .project({
      id: 1,
      customerName: 1,
      roomName: 1,
      date: 1,
      startTime: 1,
      endTime: 1,
    })
    .toArray();
  res.send(result);
});
// ---------------------------------------------------------------------------------------
// List how many times a customer has booked the room
app.get("/noOfTimes", async function (req, res) {
  const result = await client
    .db("b42wd2")
    .collection("hallData")
    .aggregate([
      { $group: { _id: "$customerName", count: { $sum: 1 } } },
      { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
    ])
    .toArray();
  console.log(result);
  const finalResult = await client
    .db("b42wd2")
    .collection("hallData")
    .find({ customerName: result[0]._id })
    .project({
      id: 1,
      customerName: 1,
      roomName: 1,
      date: 1,
      startTime: 1,
      endTime: 1,
      bookingStatus: 1,
    })
    .toArray();
  res.send(finalResult);
});

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
