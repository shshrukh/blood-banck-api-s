import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";






const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        match : [/^[a-zA-Z]+$/, "First name must contain only alphabets"]
    },
    middleName : {
        type : String,
        trim : true,
        lowercase : true,
        match : [/^[a-zA-Z]+$/, "Middle name must contain only alphabets"]
    }, 
    lastName : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        match : [/^[a-zA-Z]+$/, "Last name must contain only alphabets"]    
    },
    email : {
        type : String,  
        required : true,
        unique : true,
        trim : true,
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
    },
    phoneNumber : {
        type : String,
        required : true,
        unique : true,  
    },
    password : {
        type : String,
        required : true,
        minlength : [6, "Password must be at least 6 characters long"]
    },
    avatar : {
        type : String,
        default : null
    },
    dateOfBirth : {
        type : Date,
        default : null
    },
    bloodGroup : {
        type : String,
        enum : ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        default : null
    },
    location : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Location",

    },
    gender : {
        type : String,  
        required : true,
        enum : ["male", "femaile", "other"],
        lowercase : true,   
        trim : true,
    },
    role : {
        type : String,
        enum : ["user", "superAdmin"],
        default : "user",
        lowercase : true,
        trim : true,
    },
    refreshToken : {
        type : String,
        default : null,
    }

    
},
{
    timestamps : true
}
);

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 4);
    next();
});


userSchema.methods.isPasswordMatched = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password);
}

userSchema.methods.createAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            phoneNumber : this.phoneNumber,
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.createRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
        }, 
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


userSchema.method

export const User = mongoose.model("User", userSchema);