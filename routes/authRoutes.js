const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const AuthCtrl = require('../controllers/auth');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const config = require('../config/secret');


router.post('/register', AuthCtrl.CreateUser);
router.post('/resetpassword', AuthCtrl.ResetPassword);
router.post('/newpassword', AuthCtrl.NewPassword);
router.post('/valid-password-token', AuthCtrl.ValidPasswordToken);

router.post('/authendicate',(req,res,next)=>{
    const userName = req.body.userName;
    const password = req.body.password;
   
    User.findByName(userName,(err,user)=>{
        if(err) throw err;

        if(!user) {
            return res.status(401).json({
                message: "user not found"
              });
        }
        User.comparepassword(password,user.password,(err,isMath)=>{
            if(err) throw err;

            if(isMath){
                const token = jwt.sign(user.toJSON(),config.secret,{
                    expiresIn:604800
                });
                res.json({
                    success:true,
                    token: 'jwt' +token,
                    details:{
                        id:user.id,
                        userName:user.userName,
                        branchId:user.branchId,
                        branchName:user.branchName,
                        password:user.password,
                        role:user.role,
                        email:user.email
                    }
                 })
            }
            else{
                return res.status(404).json({
                    message: "Wrong Password"
                  });
            }
        })
    })
});



module.exports = router;
