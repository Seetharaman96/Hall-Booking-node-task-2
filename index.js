import * as dotenv from "dotenv";
dotenv.config();
// const express = require("express"); // "type": "commonjs"
import express from "express"; // "type": "module"
const app = express();
import { MongoClient } from "mongodb";

const PORT = 4000;

const MONGO_URL = "mongodb://127.0.0.1";
// const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL); // dial
await client.connect(); // call
console.log("Mongo is connected !!!  ");

app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

const hallData = [
  {
    id: "1",
    noOfSeats: "100",
    amenities: ["Ac", "Chairs"],
    price: "1000rs/hr",
    customerName: "Seetharaman",
    ifBooked: "true",
    date: "10.04.2023",
    startTime: "12.00PM",
    endTime: "12.00PM",
    roomId: "100",
    roomName: "duplex",
  },
  {
    id: "2",
    noOfSeats: "500",
    amenities: ["Ac", "Chairs", "Decoration", "Lightings"],
    price: "3000rs/hr",
    customerName: "Aadhira",
    ifBooked: "true",
    date: "15.04.2023",
    startTime: "11.00AM",
    endTime: "12.00PM",
    roomId: "101",
    roomName: "super duplex",
  },
  {
    id: "3",
    noOfSeats: "200",
    amenities: ["Ac", "Chairs"],
    price: "1500rs/hr",
    customerName: "",
    ifBooked: "false",
    date: "",
    startTime: "",
    endTime: "",
    roomId: "102",
    roomName: "duplex",
  },
  {
    id: "4",
    noOfSeats: "1000",
    amenities: ["Ac", "Chairs", "Decoration", "Kitchen appliances"],
    price: "5000rs/hr",
    customerName: "",
    ifBooked: "false",
    date: "",
    startTime: "",
    endTime: "",
    roomId: "103",
    roomName: "super duplex",
  },
  {
    id: "5",
    noOfSeats: "100",
    amenities: ["Ac", "Chairs", "Kitchen appliances"],
    price: "2500rs/hr",
    customerName: "",
    ifBooked: "false",
    date: "",
    startTime: "",
    endTime: "",
    roomId: "104",
    roomName: "duplex",
  },
]
// ------------------------------------------------------------------------------------
app.get("/hallDetails", async function(req,res){
  const result = await client.db("b42wd2").collection("hallData").find({}).toArray();
  res.send(result);
})
// -------------------------------------------------------------------------------------
app.post("/hallDetails", express.json(), async function(req,res){
  const data = req.body;
  const result = await client.db("b42wd2").collection("hallData").insertMany(data);
  res.send(result);
});
// --------------------------------------------------------------------------------------
// // Booking a room
app.put("/hallBooking/:id", express.json(), async function(req,res){
  const { id } = req.params;
  const data = req.body;
  if(hallData[id].ifBooked === "false"){
    const result = await client.db("b42wd2").collection("hallData").updateOne({id: id}, {$set: data});
    res.send(result);
  } else{
    res.send({message: "Hall already booked"});
  }
});
// ---------------------------------------------------------------------------------------
// List all rooms with booked data
app.get("/bookedHalls", async function(req,res){
  const result = await client.db("b42wd2").collection("hallData").find({ifBooked: "true"}).toArray();
  res.send(result);
})
// ---------------------------------------------------------------------------------------
// List all customers with booked data
app.get("/bookedCustomers", async function(req,res){
  const result = await client.db("b42wd2").collection("hallData").find({ifBooked: "true"}).toArray();
  res.send(result);
})

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));