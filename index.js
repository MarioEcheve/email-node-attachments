'use strict';
const nodemailer = require('nodemailer');
// generic imports
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = express.Router();
// app - express
const app = express();

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.post('/email', function(request, response){
    console.log(request.body);
    main(request.body);
    return response.send(JSON.stringify("ok", null, 4));
});

// async..await is not allowed in global scope, must use a wrapper
async function main(email) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        pool: false,
        host: 'mail.lodigital.cl',
        port: 465,
        auth: {
            user: "aviso@lodigital.cl", // generated ethereal user
            pass: "Epsilon2020" // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'aviso@lodigital.cl', // sender address
        to: email.to, // list of receivers
        subject: email.subject, // Subject line
        text: email.content, // plain text body
        //html: '<b>Hello world?</b>' // html body,
        attachments : email.attachments
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

//main().catch(console.error);

// port 
const port = process.env.PORT || 8090;

// listen port
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});