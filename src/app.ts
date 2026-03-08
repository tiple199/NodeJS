/// <reference path="./types/index.d.ts" />
import express from "express";
import webRoutes from "src/routes/web";
import 'dotenv/config';
import initDatabase from "config/seed";
import * as z from "zod"; 
import passport from "passport";
import configPassportLocal from "src/middleware/passport.local";
import session from "express-session";
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import  { PrismaClient } from '@prisma/client';

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
// config session
app.use(session({
  cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: 'a santa at nasa',
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 1 * 24 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
}))
// config passport local strategy
app.use(passport.initialize());
app.use(passport.authenticate('session'));

configPassportLocal();

// config global variables
app.use((req,res,next) => {
    res.locals.user = req.user || null;
    next();
})

webRoutes(app);

// seeding data
initDatabase();

// handle 404 not found
app.use((req,res) => {
    res.status(404).render("status/404.ejs");
})

app.listen(PORT,() => {
    console.log(`My app is running on port: ${PORT}`);    
})