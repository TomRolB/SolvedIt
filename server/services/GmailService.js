const nodemailer = require('nodemailer');
const {mail} = require("./mail");

exports.sendEmail = (description) => {
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
        to: 'jijajix166@calunia.com',
        subject: description.title,
        text: description.description,
        html: '<h2>Message sent from SolvedIt</h2>'
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error when sending message:' + err.message);
        }
        console.log('Message sent: %s', info.messageId);
    });
}
