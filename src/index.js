import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db/connectDB.js";


dotenv.config({path: "./.env"});



connectDB()
    .then(()=>{
        app.on("error", (error) => {
            console.log("Error in running the server ", error);
            process.exit(1);
        })
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port 7980`);
        })
    })




