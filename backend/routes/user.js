const {Router}= require("express");
const User = require("../models/user");
const UserRouter = Router();
const {createAccessToken, createRefreshToken} = require("../services/authentication");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendOnboardingMail = require("../services/mail").sendOnboardingMail;
const redisClient = require("../services/client");
const sendEmailVerificationMail = require("../services/mail").sendEmailVerificationMail;

require('dotenv').config();

UserRouter.post("/signup", async (req,res)=>{
    try {
        const {fullName, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({error: 'No need to Signup as user with this email already exists. Please login instead.'});
        }
        if(!fullName || !email || !password){
            return res.status(400).json({error: 'Please Provide all the required Fields'});
        }
        const user = await User.create({fullName, email, password});
        const accesstoken = createAccessToken(user);
        res.setHeader('Authorization', `Bearer ${accesstoken}`); // Set the token in the response header
        
        //creating refresh token and saving it in the database
        const refreshToken = createRefreshToken();
        const hashedRefreshToken = crypto.createHmac('sha256', process.env.refresh_token_pepper).update(refreshToken).digest('hex');
        user.refreshToken = hashedRefreshToken;
        await user.save();

        //in production set secure: true and sameSite: 'none' to allow cross-site cookies, in development you can set secure: false and sameSite: 'lax'
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set the cookie to expire in 7 days from now
        });
        await sendOnboardingMail(email, fullName, "Welcome to CineQueue !");
        return res.status(201).json({message: 'Signup successful'})
        
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

UserRouter.post("/login", async (req,res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({error: 'All fields required'});
        }
    
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(404).json({error: 'User not found'});
        }
        const isPasswordMatch = await bcrypt.compare(password+process.env.password_pepper, existingUser.password);
        if(!isPasswordMatch){
            return res.status(401).json({error: 'Invalid credentials, Give correct email and password to login'});
        }
        const accesstoken = createAccessToken(existingUser);
        res.setHeader('Authorization', `Bearer ${accesstoken}`); // Set the token in the response header
        
        const refreshToken = createRefreshToken();
        const hashedRefreshToken = crypto.createHmac('sha256', process.env.refresh_token_pepper).update(refreshToken).digest('hex');
        existingUser.refreshToken = hashedRefreshToken;
        await existingUser.save();

        //in production set secure: true and sameSite: 'none' to allow cross-site cookies, in development you can set secure: false and sameSite: 'lax'
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set the cookie to expire in 7 days from now
            path: '/' //path '/' means the cookie will be sent in all requests to the server, you can adjust it based on your needs
        }); // Set the refresh token in an HTTP-only cookie
        
        return res.status(200).json({message: 'Login successful'});

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
})



UserRouter.post("/sendResetOtp", async(req,res)=>{
    try {
        const {email} = req.body;
        if(!email){
            return res.status(400).json({error:'Email is required'});
        }
        const existingUser = await User.findOne({email});
        if(!existingUser){
            // Don't reveal whether the email exists — same message either way
            return res.status(200).json({message:'If an account exists for this email, a reset code has been sent.'});
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await redisClient.set(`reset-otp:${email}`, otp, "EX", 120); // expires in 2 minutes
        await sendEmailVerificationMail(email, otp);
        return res.status(200).json({message:'If an account exists for this email, a reset code has been sent.'});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
})

UserRouter.post("/forgetPassword", async(req,res)=>{
    try {
        const {email, otp, newPassword} = req.body;
        if(!email || !otp || !newPassword){
            return res.status(400).json({error:'Email, OTP, and new password are all required'});
        }
        const storedOtp = await redisClient.get(`reset-otp:${email}`);
        if(!storedOtp){
            return res.status(400).json({error:'Reset code expired or not found. Please request a new one.'});
        }
        if(storedOtp !== otp){
            return res.status(400).json({error:'Invalid reset code. Please try again.'});
        }
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(404).json({error:'No account found for this email.'});
        }
        existingUser.password = newPassword; // pre-save hook hashes + validates strength
        await existingUser.save();
        await redisClient.del(`reset-otp:${email}`);
        return res.status(200).json({message:'Password reset successful! You can now log in with your new password.'});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
})

UserRouter.post("/logout", async (req,res)=>{
    try {
        const refreshToken = req.cookies?.refreshToken;
        if(!refreshToken){
            res.clearCookie('refreshToken', { path: '/' });
            return res.status(400).json({error: 'REFRESH_EXPIRED'});
        }
        const hashedRefreshToken = crypto.createHmac('sha256', process.env.refresh_token_pepper).update(refreshToken).digest('hex');

        if (hashedRefreshToken ) {
            await User.updateOne({ refreshToken: hashedRefreshToken }, { $unset: { refreshToken: "" } });
        }

        res.removeHeader('authorization'); // Clear the token from the response header
        res.clearCookie('refreshToken', { path: '/' }); // Clear the refresh token cookie
        return res.status(200).json({message: 'Logout successful'});
    }catch(error){
        res.status(500).json({error: error.message});
    }

})

module.exports=UserRouter;