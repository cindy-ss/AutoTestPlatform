/**
 * Created by edel.ma on 7/19/17.
 */

const express = require('express');
const router = express.Router();

const trans = require('./trans'),
    ic = require('./image_checker'),
    font = require('./font'),
    video = require('./video');

const validUrl = (req, res, next) => {
    const url = req.body.url;
    if (url) {
        next();
    } else {
        res.json({
            result: false,
            message: 'No URL Provided'
        })
    }
};

router.use((req, res, next) => {
    if ((req.session.od && req.session.od !== {}) || req.path === '/init') {
        console.log(`[ * ] : ${req.session.od ? (req.session.od.odUser || 'Anonymous') : 'Anonymous'} is querying for ${req.path}`);

        next();
    } else {
        console.log(`[ * ] : ${req.session.od ? (req.session.od.odUser || 'Anonymous') : 'Anonymous'} is rejected for querying ${req.path}`);
        res.sendStatus(403);
    }
});

router.route('/init')
    .post((req, res) => {
        if (req.body.odUser && req.body.odPass) {
            req.session.od = {
                odUser: req.body.odUser,
                odPass: req.body.odPass
            };
            res.json(req.session.od);
        } else {
            res.json({
                result: false,
                message: 'Username & Password should provided in pair.'
            })
        }

    })
    .get((req, res) => {
        if (!req.session.od) {
            req.session.od = {};
        }
        res.json(req.session.od);
    });

router.route('/trans')
    .post((req, res) => {
        trans.runTask(req.body.urls, req.session.od, data => {
            res.json(data);
        });
    });

router.route('/trans/export/:type')
    .post((req, res) => {
        let obj = {
            xls: JSON.parse(req.body.xls),
            type: req.params.type
        };
        trans.export2Xls(obj, (err, exPath) => {
            res.end(exPath.toString());
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
        } else {
            res.json({
                result: false,
                message: 'No URLs Provided'
            })
        }
    });

router.route('/font/text')
    .post((req, res) => {
        const text = req.body.text;
        const options = req.body.option;
        if (text) {
            res.json({
                result: true,
                data: font.check(text, options)
            });
        } else {
            res.json({
                result: false,
                message: 'No Text Provided'
            })
        }
    });

router.route('/font/options')
    .get((req, res) => {
    });

router.route('/image/getUSImage')
    .post((req, res) => {
        const url = req.body.url;
        if (url) {
            ic.getUSImages(url, req.session.od, (err, data) => {
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

router.route('/image/compare/:geo')
    .post((req, res) => {
        const url = req.body.url;
        if (url) {
            ic.compareImageByURL(url, req.params.geo, req.session.od, (err, data) => {
                if (!err) {
                    console.log("1111");
                    console.log(data);
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

router.route('/image/export/:type')
    .post((req, res) => {
        let obj = {
            data: JSON.parse(req.body.data),
            type: req.params.type
        };
        ic.exportHTML(obj, (err, exPath) => {
            res.end(exPath.toString());
        });
    });

router.route('/video')
    // .use(validUrl)
    .post((req, res) => {
        video.getVideo(req.body.url, req.session.od, (err, data) => {
            if (!err) {
                console.log(data);
                res.json({
                    result: true,
                    data: data
                })
            } else {
                res.json({
                    result: false,
                    message: err
                })
            }
        });
    });

router.route('/files/:fileName')
    .get((req, res) => {
        const path = `./static/data/${req.params.fileName}`;
        res.download(path, (err) => {
            console.log(err);
        });
    });

exports.router = router;