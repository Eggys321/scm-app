const USER = require('../models/userModel');
const jwt = require('jsonwebtoken');


// registration

const registration = async (req,res)=>{
    try {
        const {userName,email,password,verifyPassword} = req.body

        if(!userName || !email || !password || !verifyPassword){
            res.status(400).json({success:false, message:"username,email,password are required to register!"});
            return;
        };

        if(password !== verifyPassword){
            res.status(400).json({success:false,message:"password and verify password must be same!"});
            return;
        };

        const user = await USER.create({...req.body});
        res.status(201).json({success:true, message:"registration successfull",user})
    } catch (error) {
        if(error.code === 11000){
            res.status(403).json({success:false, message:"Email already in use"});
            return;
        }
        res.status(500).send(error);
        console.log(error.message);
        
    }
}

// login

const login = async (req,res)=>{
    try {
        
        const {email,password} = req.body;
        if(!email || !password){
            res.status(400).json({success:false,message:"all fields are required to login"});
            return;
        }
        // finding a registered email address and password 

        const user = await USER.findOne({email});
        if(!user){
            res.status(404).json({success:false,message:"wrong credentials"});
            return;
        }
        // comparing password and validating password
        const auth = await user.comparePassword(password);

        if(!auth){
            res.status(404).json({success:false,message:"wrong credentials"});
            return;
        }

        // token
        const token = await user.generateToken();
        if(token){
            res.status(201).json({success:true,
            message:"logged in",
            user:{
                userName:user.userName,
                email:user.email,
                token
            },
        });
        return;
        }
    } catch (error) {
        res.status(500).send(error);
    }
}


module.exports = {
    registration,
    login
}