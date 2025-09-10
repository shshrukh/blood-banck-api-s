import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";    
import Location from "../models/location.models.js";



const registerUser = asyncHandler( async ( req, res )=>{

    const{ firstName, middleName, lastName, email, password,  phoneNumber, gender, province, district, city  }= req.body;

    if([firstName, middleName, lastName, email, password, phoneNumber, gender, province, district, city].some( fields => fields.trim() === "")){
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({$or :[{email}, {phoneNumber}]});
    if(existingUser){
        throw new ApiError(409, "User already exists with this email or phone number");
    }

    const location = await Location.create({province, district, city});

    const user = await User.create({
        firstName,
        middleName,
        lastName,
        email,
        phoneNumber,    
        password,
        gender,
        location : location._id,

    })


    
})