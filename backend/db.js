"use strict";
/** Database setup for jobly. */
const { Client } = require("pg");

let db = new Client({
  host: "localhost",
  database: "jobly",
  password: "3Turtlz6!",
});

db.connect();

module.exports = db;
