const express = require("express"),
    app = express(),
    http = require('http').Server(app),
    body_parser = require('body-parser'),
    session = require('express-session');

app.use(body_parser.urlencoded({extended: false}));

app.use(session({
    secret : 'imyourfather',
    cookie : {
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}));

const router = require('./server/router').router;

app.use('/', express.static('./static'));
app.use('/node_modules', express.static('./node_modules'));

app.use('/api', router);

app.set('port', (process.env.PORT || 2333));
http.listen(app.get('port'), () => {
    console.log(`QA Test Platform starts on ${app.get('port')}!`)
});