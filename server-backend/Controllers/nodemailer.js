const express=require("express");
const router = express.Router();
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

router.post('/send-email', async (req,res) => {
    const { to, text } = req.body
console.log('req',req.body)
    const subject = "Let's Band Together!!"
    try {
        console.log('cheese')
        await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            text,
        });
        console.log('email sent successfuly')
        res.json({ success: true, message: 'email sent' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Message Failed to send'})
    }
})

router.get('/test',(req,res) => {
    res.json({ message: 'testing the test route '})
})

module.exports = router

