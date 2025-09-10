import mongoose from "mongoose";




const locationSchema = new mongoose.Schema({
    province : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
    },  
    district : {
        type : String,
        required : true,                
        trim : true,
        lowercase : true,
    },
    city : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
    },
},{timestamps : true});

export const Location = mongoose.model("Location", locationSchema);