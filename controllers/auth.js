const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/users');
const passwordResetToken = require('../models/resettoken');
var smtpTransport = require("nodemailer-smtp-transport");
// var sgTransport = require('nodemailer-sendgrid-transport');

// var options = {
//   auth: {
//       api_user: 'alexstani', // Sendgrid username
//       api_key: '8870023970A' // Sendgrid password
//   }

// };
// var client = nodemailer.createTransport(sgTransport(options));

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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')


module.exports = {
  async CreateUser(req, res) {
   
    const userEmail = await User.findOne({
      email: req.body.email
    });
    if (userEmail) {
      return res
        .status(409)
        .json({ message: 'Email already exist' });
    }
    
    const userName = await User.findOne({
      userName: req.body.userName
    });
    if (userName) {
      return res
        .status(409)
        .json({ message: 'Username already exist' });
    }

    return bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res
          .status(400)
          .json({ message: 'Error hashing password' });
      }
      const body = {
        userName: req.body.userName,
        email: req.body.email,
        role: req.body.role,
        password: hash
      };
      User.create(body)
        .then(user => {
          res
          res.status(201) .json({ message: 'User created successfully', user });
        })
        .catch(() => {
          res
            .status(500)
            .json({ message: 'Error occured' });
        });
    });
  },

  async ResetPassword(req, res) {
    if (!req.body.email) {
    return res
    .status(500)
    .json({ message: 'Email is required' });
    }
    const user = await User.findOne({
    email:req.body.email
    });
    if (!user) {
    return res
    .status(409)
    .json({ message: 'Email does not exist' });
    }
    var resettoken = new passwordResetToken({ _userId: user._id, resettoken: crypto.randomBytes(16).toString('hex') });
    resettoken.save(function (err) {
    if (err) { return res.status(500).send({ msg: err.message }); }else{
    passwordResetToken.find({ _userId: user._id, resettoken: { $ne: resettoken.resettoken } }).remove().exec();
    res.status(200).json({ message: 'Reset Password successfully.' });
    var email = {
      // from: 'alex@technonix.co.in',
      from : 'tix.firebase2@gmail.com',
    to: user.email,
    subject: 'Node.js Password Reset',
    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
    'http://localhost:4200/auth/reset/' + resettoken.resettoken + '\n\n' +
    'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    };
    
     sgMail.send(email, function(error, info){
      // client.sendMail(email, function(error, info){
        if (error ){
          console.log(error);
        }
        else {
          console.log('Message sent: ' + info);
        }
    });
  }
    })
    
    },

// async ResetPassword(req, res) {
//   let testAccount = await nodemailer.createTestAccount();
//     if (!req.body.email) {
//     return res
//     .status(500)
//     .json({ message: 'Email is required' });
//     }
//     const user = await User.findOne({
//     email:req.body.email
//     });
//     if (!user) {
//     return res
//     .status(409)
//     .json({ message: 'Email does not exist' });
//     }
//     var resettoken = new passwordResetToken({ _userId: user._id, resettoken: crypto.randomBytes(16).toString('hex') });
//     resettoken.save(function (err) {
//     if (err) { return res.status(500).send({ msg: err.message }); }
    
//     else{
//       // Create e-mail object to send to user
//       var email = {
//           from: 'MEAN Stack Staff, staff@localhost.com',
//           to: user.email,
//           subject: 'Reset Password Request',
//           text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//           'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//           'http://localhost:4200/response-reset-password/' + resettoken.resettoken + '\n\n' +
//           'If you did not request this, please ignore this email and your password will remain unchanged.\n'
//       };
//       // Function to send e-mail to the user
//       client.sendMail(email, function(err, info) {
//           if (err) 
//               console.log(err); // If error with sending e-mail, log to console/terminal
//       });
//       res.json({ success: true, message: 'Please check your e-mail for password reset link' }); // Return success message
//   }
   
//     })
//     },

    async ValidPasswordToken(req, res) {
        if (!req.body.resettoken) {
        return res
        .status(500)
        .json({ message: 'Token is required' });
        }
        const user = await passwordResetToken.findOne({
        resettoken: req.body.resettoken
        });
        if (!user) {
        return res
        .status(409)
        .json({ message: 'Invalid URL' });
        }
        User.findOneAndUpdate({ _id: user._userId }).then(() => {
        res.status(200).json({ message: 'Token verified successfully.' });
        }).catch((err) => {
        return res.status(500).send({ msg: err.message });
        });
    },
        async NewPassword(req, res) {
            passwordResetToken.findOne({ resettoken: req.body.resettoken }, function (err, userToken, next) {
              if (!userToken) {
                return res
                  .status(409)
                  .json({ message: 'Token has expired' });
              }
        
              User.findOne({
                _id: userToken._userId
              }, function (err, userEmail, next) {
                if (!userEmail) {
                  return res
                    .status(409)
                    .json({ message: 'User does not exist' });
                }
                return bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                  if (err) {
                    return res
                      .status(400)
                      .json({ message: 'Error hashing password' });
                  }
                  userEmail.password = hash;
                  userEmail.save(function (err) {
                    if (err) {
                      return res
                        .status(400)
                        .json({ message: 'Password can not reset.' });
                    } else {
                      userToken.remove();
                      return res
                        .status(201)
                        .json({ message: 'Password reset successfully' });
                    }
                  });
                });
              });
            })
        }, 
  }