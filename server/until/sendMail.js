const nodemailer = require("nodemailer")
const smtpTransport = require('nodemailer-smtp-transport');
const asyncHandler = require('express-async-handler')
const sendMail = asyncHandler( async({email,html})=>{
    const transporter = nodemailer.createTransport(smtpTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.EMAIL_NAME,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      }));
      
    // async..await is not allowed in global scope, must use a wrapper
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: 'cuahangdientu" <no-reply@cuahangdientu.com>', // sender address
        to: email, // list of receivers
        subject: "forgot password ", // Subject line
        text: "Hello world?", // plain text body
        html: html, // html body
    });
    return info
})
module.exports = sendMail