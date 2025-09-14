import asyncHandler from "../utils/asyncHandler.js";
import {User} from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";    
import {Location} from "../models/location.models.js";
import ApiResponce from "../utils/ApiResponce.js";




const generateAccessAndRefreshToken = async ( userId )=>{
    try {
        
        const user = await User.findById(userId);
        // console.log(user);
        
        const accessToken =  user.createAccessToken();
        // console.log(accessToken);
        
        const refreshToken =  user.createRefreshToken();
        // console.log(refreshToken);
        
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false});
        return { accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};


const registerUser = asyncHandler( async ( req, res )=>{

    const{ firstName, middleName, lastName, email, password,  phoneNumber, gender, province, district, city  }= req.body;

    if([firstName, lastName, email, password, phoneNumber, gender, province, district, city].some( fields => fields.trim() === "")){
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

    const createUser =await User.findById(user._id).select("-password");
    console.log(createUser)

    if(!createUser){
        throw new ApiError(500, "user is not registered")
    }
    // console.log(createUser);

    return res.status(201).json(new ApiResponce(201, createUser, "User registered successfully"));

});

const loginUser = asyncHandler( async (req, res) =>{
   // get the data from req.body
   // validate the data
   // check if user exists with the given email
   // if not, throw an error
   // compare the password
   // if not match, throw an error
   // if match, generate a JWT token
   // send the token in the response



   const { email, password } = req.body;

   if( !email && !password){
       throw new ApiError(400, "All fields are required");
   }
   const user = await User.findOne({email});

   if(!user){
        throw new ApiError(404, "User not found with this email");
   };

    const isPasswordMatched = await user.isPasswordMatched(password);

    if(!isPasswordMatched){
        throw new ApiError(401, "Email or password incorrect");
    };

    const tokens = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly : true,
        secure : true
    }
    return res
        .status(200)
        .cookie("accessToken", tokens.accessToken, options)
        .cookie("refreshToken", tokens.refreshToken, options)
        .json(new ApiResponce(200, { user : loggedInUser, tokens}, "User logged in successfully"));

});


const logoutUser = asyncHandler( async (req, res) =>{
    await User.findByIdAndUpdate(req.user._id,  {$set:{refreshToken: null}} , { new : true});
    return res
        .status(200)
        .cookie("accessToken", null, { httpOnly : true, secure : true})
        .cookie("refreshToken", null, { httpOnly : true, secure : true})
        .json(new ApiResponce(200, null, "User logged out successfully"));
});


const changePassword = asyncHandler( async (req, res) =>{
    const { oldPassword, newPassword } = req.body;

    if( !oldPassword && !newPassword){
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(req.user._id);

    if(!user){
        throw new ApiError(404, "User not found");
    }

});


const currentUser = asyncHandler( async (req, res) =>{
    return res.status(200).json(new ApiResponce(200, req.user, "Current user fetched successfully"));
});


export { registerUser, loginUser, logoutUser, currentUser };
