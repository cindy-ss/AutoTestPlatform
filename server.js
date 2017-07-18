const express = require("express"),
    app = express(),
    http = require('http').Server(app),
    body_parser = require('body-parser');

// const basic = require

const trans = require('./server/trans');

app.use(body_parser.urlencoded({extended: false}));

const router = express.Router();

app.use('/', express.static('./static'));
app.use('/node_modules', express.static('./node_modules'));

router.route('/trans')
    .post((req, res) => {
        trans.runTask(req.body.urls.split('\n'), data => {
            res.json(data);
        });
    });

router.route('/trans2xls')
    .post((req, res) => {
    let obj = {
        xls : JSON.parse(req.body.xls),
        type : req.body.type
    };
        trans.export2Xls(obj, (err, exPath) => {
            res.end(exPath);
        });
    });

app.use('/api', router);

app.set('port', (process.env.PORT || 2333));
http.listen(app.get('port'), () => {
    console.log(`QA Test Platform starts on ${app.get('port')}!`)
});