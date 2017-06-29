const express = require("express"),
    app = express(),
    http = require('http').Server(app),
    body_parser = require('body-parser');

const trans = require('./server/trans');

app.use(body_parser.urlencoded({ extended: false }))

const router = express.Router();

app.use('/', express.static('./static'));
app.use('/node_modules', express.static('./node_modules'));

router.route('/trans')
    .get((req, res) => {
        console.lod(req.query.url);
        res.json({});
    })
    .post((req, res) => {
        console.log(req.body.urls.split('\n'));
        res.json(req.body.urls);
    });

app.use('/api', router);

app.set('port', (process.env.PORT || 2333));
http.listen(app.get('port'));