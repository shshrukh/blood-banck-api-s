import ApiError from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';

export const outhMiddleware = async (req, res, next) => {
    // get token from headers
    // verify token
    // if valid, call next()    
    // if not valid, return 401 Unauthorized
    

    const token = req.cookies?.accessToken || req.headers('Authorization').replace('Bearer ', '');  

    try {
        if (!token) {
            throw new ApiError(401, 'Unauthorized reaquest');
        }
        
        const decodeToken = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET );
    
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken");
    
        if (!user) {
            throw new ApiError(401, 'Unauthorized request, user not found');
        }
    
        req.user = user;
    
        next();
    } catch (error) {
        console.log("error in varifying jwt middleware", error);
    }
};