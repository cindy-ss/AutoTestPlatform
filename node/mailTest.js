var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://526135164@qq.com:Fucky0uassh0le@smtp.qq.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '<526135164@qq.com>', // sender address
    to: 'li.shsh@inspur.com, maqun@inspur.com', // list of receivers
    subject: 'Hello ', // Subject line
    text : "hello World",
    html: '<b>Hello world !</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});