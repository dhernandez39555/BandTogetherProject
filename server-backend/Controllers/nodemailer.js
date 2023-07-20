const express=require("express");
const router = express.Router();
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'myemail@gmail.com',
        PASS: process.env.PASS,
    },
});

router.post('/send-email', async (req,res) => {
    const { to, text } = req.body

    const subject = "Let's Band Together!!"
    try {
        await transporter.sendMail({
            from: 'myemail@gmail.com',
            to,
            subject,
            text,
        });
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


