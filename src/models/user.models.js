import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";






const userSchema = new mongoose.Schema({

    firstName :{
        type : String,
        required : true,
        trim : true,
        minLength : 3,
        maxLength : 20, 
        lowercase : true

    }, 
    middleName : {
        type : String,
        trim : true,
        lowercase : true,
        default : null
    },
    lastName : {
        type : String,
        required : true,
        trim : true,        
        minLength : 3,
        maxLength : 20, 
        lowercase : true,

    },
    email : {
        type : String,
        required : true,
        unique : true,
        match: [/^.+@gmail\.com$/, "Email must end with @gmail.com"]
        
    },
    gender:{
        type : String,
        required : true,
        enum :["male", "female", "other"]
    },
    password : {
        type : String,
        required : true,
        minLength : 6,  
    },
    phoneNumber : {
        type : Number,
        required : true,
        unique : true,
    },
    bloodGroup : {
        type : String,
        required : true,
        enum : ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]   
    },
    age : {
        type : Number,
        required : true,
        min : 18,
        max : 65   
    },
    location : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Location"
    },
    isDonor : {
        type : Boolean
    },
    lastDonationDate : {
        type : Date,
        default : null
    },
    isavailable : {
        type : Boolean,
        default : true      
    },
    refreshToken : {
        type : String,
        default : null
    },
    avatar : {
        type : String,
        default : null
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