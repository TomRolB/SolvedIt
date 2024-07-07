const nodemailer = require('nodemailer');
const {mail} = require("./mail");
const {Users} = require('../models')
const Strategies = require("./html_strategies/Strategies");

exports.sendEmail = async (description, userId) => {
    let emailAddress = (await Users.findOne({
        where: {
            id: userId
        },
        attributes: ['email']
    })).email

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: mail.user,
            pass: mail.password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let message = {
        from: mail.user,
        to: emailAddress,
        subject: description.title,
        text: description.description,
        html: (await Strategies.getHtml(description)) || `<p>${description.description}</p>`
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error when sending message:' + err.message);
        }
        console.log('Message sent: %s', info.messageId);
    });
}
