import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";




const app = express();

app.use( cors(
    {
        origin: process.env.CROSS_ORIGIN,
        cridentials: true
    }
));

app.use(express.json({limit: "30mb"}));

app.use(express.urlencoded({limit: "30mb", extended: true}));;

app.use(express.static("public"));

app.use(cookieParser());




export default app;

