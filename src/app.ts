// const express = require("express");
import express from "express";
import webRoutes from "src/routes/web";
import 'dotenv/config';
import initDatabase from "config/seed";
import * as z from "zod"; 
import passport from "passport";
import configPassportLocal from "src/middleware/passport.local";
const  app = express();
const PORT = process.env.PORT || 8080;

// configure view engine
app.set("view engine","ejs");
app.set("views",__dirname + "/views");

//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config static files
app.use(express.static("public"));
// config passport local strategy
app.use(passport.initialize());
configPassportLocal();

webRoutes(app);

// seeding data
initDatabase();

const mySchema = z.string();

mySchema.parse("Hello Zod");
// mySchema.parse(12);

app.listen(PORT,() => {
    console.log(`My app is running on port: ${PORT}`);    
})