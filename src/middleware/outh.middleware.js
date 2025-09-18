import ApiError from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';
import ApiResponce from '../utils/ApiResponce.js';

export const outhMiddleware = async (req, res, next) => {


    try {
        const token = req.cookies?.accessToken || req.headers['authorization'].replace('Bearer ', '');
        // console.log("token from cookie or header", token);
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new ApiError(401, "Invalid access token");

            };
        }

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        // console.log(decodedToken);


        if (!user) {
            throw new ApiError(404, "User not found");
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in varifing JWT token", error);

    }
};