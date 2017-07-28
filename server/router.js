/**
 * Created by edel.ma on 7/19/17.
 */

const express = require('express');
const router = express.Router();

const trans = require('./trans'),
    ic = require('./image_checker'),
    font = require('./font');

router.route('/init')
    .post((req, res) => {
        console.log(req.body.odUser);
        console.log(req.body.odPass);

        if (req.body.odUser && req.body.odPass) {
            req.session.od = {
                odUser: req.body.odUser,
                odPass: req.body.odPass
            }
        }
        res.json(req.session.od);
    })
    .get((req, res) => {
        if (!req.session.od) {
            req.session.od = {};
        }
        res.json(req.session.od);
    });

router.route('/trans')
    .post((req, res) => {
        trans.runTask(req.body.urls.split('\n'), req.session.od, data => {
            res.json(data);
        });
    });

router.route('/trans2xls')
    .post((req, res) => {
        let obj = {
            xls: JSON.parse(req.body.xls),
            type: req.body.type
        };
        trans.export2Xls(obj, (err, exPath) => {
            // if(req.body.type === 'html'){
            res.end(exPath.toString());
            // }else{
            //     res.end(exPath);
            // }

        });
    })
    .get((req, res) => {
        const path = `./static/data/report-${req.query.id}.html`;
        res.download(path, (err) => {
            console.log(err);
        });
    });

router.route('/font/url')
    .post((req, res) => {
        const urls = req.body.urls.split('`');
        const options = req.body.option;
        if (urls) {
            font.checkByUrl(urls, req.session.od, options, (err, data) => {
                if (!err) {
                    res.json({
                        result: true,
                        data: data
                    })
                } else {
                    res.json({
                        result: false,
                        message: 'Err'
                    })
                }
            })
        }else{
            res.json({
                result : false,
                message : 'No URLs Provided'
            })
        }
    });

router.route('/font/text')
    .post((req, res) => {
    });

router.route('/font/options')
    .get((req, res) => {
    });

router.route('/image')
    .post((req, res) => {
        const url = req.body.url;
        if (url) {
            ic.check(url, req.session.od, (err, data) => {
                if (!err) {
                    res.json({
                        result: true,
                        data: data
                    })
                } else {
                    res.json({
                        result: false,
                        message: 'Err'
                    })
                }
            })
        } else {
            res.json({
                result: false,
                message: 'No URL Provided'
            })
        }
    });

exports.router = router;