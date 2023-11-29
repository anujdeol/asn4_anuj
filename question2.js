/******************************************************************************
***
* ITE5315 – Assignment 4
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Anuj Deol Student ID: N01550000 Date: 27TH NOVEMBER 2023
*
*
******************************************************************************
**/
const express = require("express");
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;

// Connecting to the MongoDB database
const database = require("./question2/config/database");
mongoose.connect(database.url);

// Import the Invoice model
const Invoice = require("./question2/models/invoice");

// Body-parser middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up Handlebars as the view engine
const hbs = exphbs.create({
  extname: ".hbs",
  defaultLayout: "main",
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  },
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
  const buttons = [
    { label: 'Get all sales data', url: '/api/invoices' },
    { label: 'Add new sales data', url: '/api/insert' },
  ];

  res.render('index', { button: buttons, title: 'root' });
});

// Get all invoices data from the database
app.get("/api/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.render("loaddata", { title: "All Invoices", invoices: invoices });
  } catch (err) {
    res.status(500).send(err.message || "Internal Server Error");
  }
});



// Render the form for creating a new invoice
app.get("/api/insert", (req, res) => {
  res.render("createDatabase", { title: "Create Invoice" });
});


// Handle the form submission
app.post("/api/insert", async (req, res) => {
  try {
    const invoice = await Invoice.create({
      invoiceID: req.body.invoiceID,
      branch: req.body.branch,
      city: req.body.city,
      customerType: req.body.customerType,
      productLine: req.body.productLine,
      name: req.body.name,
      image: req.body.image,
      unitPrice: req.body.unitPrice,
      quantity: req.body.quantity,
      tax5Percent: req.body.tax5Percent,
      total: req.body.total,
      date: req.body.date,
      time: req.body.time,
      payment: req.body.payment,
      cogs: req.body.cogs,
      grossIncome: req.body.grossIncome,
      rating: req.body.rating,
    });

    // Optionally, you can render a response or redirect to another page after successful creation
    res.render("invoiceCreated", { title: "Invoice Created", invoice: invoice });
  } catch (err) {
    res.status(500).send(err.message || "Internal Server Error");
  }
});





// Start the server
app.listen(port, () => {
  console.log("App listening on port: " + port);
});
