/**
 * Created by edel.ma on 7/19/17.
 */

const express = require('express');
const router = express.Router();

const trans = require('./trans'),
    fs = require('fs'),
    ic = require('./image_checker'),
    font = require('./font'),
    video = require('./video'),
    down = require('../service/downloader'),
    link = require('./link'),
    patLink = require('./pat_link'),
    vPath = require('./vpath'),
    viewport = require('./viewport'),
    footnote = require('./footnote'),
    report = require('./report'),
    copy = require('./copy'),
    workflow = require('./workflow'),
   copyhken = require('./copyhken');

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

router.route('/viewport')
    .post((req, res) => {
        viewport.runTask(req.body.urls, req.session.od, data => {
            res.json(data);
        });
    });

router.route('/copy')
    .post((req, res) => {
        copy.runTask(req.body.urls, req.session.od, data => {
            res.json(data);
        });
    });

router.route('/copy')
    .post((req, res) => {
        copy.runTask(req.body.urls, req.session.od, data => {
            res.json(data);
        });
    });
router.route('/copyhken')
    .post((req, res) => {
        copyhken.runTask(req.body.urls, req.session.od, data => {
            res.json(data);
        });
    });

router.route('/viewport/export')
    .post((req, res) => {
        viewport.exporter(req.body.data, (err, exPath) => {
            res.end(exPath.toString());
        });
    });

router.route('/footnote')
    .post((req, res) => {
        footnote.runTask(req.body.urls, req.session.od, data => {
            res.json(data);
        });
    });

router.route('/footnote/export')
    .post((req, res) => {
        res.end(footnote.exporter(req.body.data).toString());
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
        const urls = req.body.urls;
        const options = JSON.parse(req.body.option || {}) || {};
        if (urls) {
            font.checkByUrl(urls, req.session.od, options, (err, data) => {
                if (!err) {
                    res.json({
                        result: true,
                        data: data
                    })
                } else {
                    console.log(`[ X ] : query from ${req.session.od.odUser} error, msg ; ${err}`);
                    res.json({
                        result: false,
                        message: err.message
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

router.route('/image/download')
    .post((req, res) => {
        let obj = JSON.parse(req.body.data);
        if (obj && obj.list) {
            down.downZip(obj && obj.list, req.session.od, (err, filePath) => {
                if (!err) {
                    res.end(filePath.toString());
                } else {
                    res.json({
                        result: false,
                        message: err
                    })
                }
            });
        } else {
            res.json({
                result: false,
                message: 'No URL Provided'
            })
        }
    });

router.route('/video')
    .post((req, res) => {
        const url = req.body.url;
        if (url) {
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
        } else {
            res.json({
                result: false,
                message: 'No URL Provided'
            })
        }
    });

router.route('/link')
    .post((req, res) => {
        const url = req.body.url;
        if (url) {
            link.getLinks(req.body.url, req.session.od, (err, data) => {
                if (!err) {
                    res.json({
                        result: true,
                        data: data
                    })
                } else {
                    res.json({
                        result: false,
                        message: 'Something went wrong'
                    })
                }
            });
        } else {
            res.json({
                result: false,
                message: 'No URL Provided'
            })
        }
    });
router.route('/workflow')
    .post((req, res) => {
    const options = {
        url: req.body.url,
        auth: req.session.od,
        option: req.body.option
    };
    console.log(options);
    if(options.url){
        workflow.run(options).then(
            data => {
                res.json({
                    result:true,
                    data: data
                })

        });


    }else {
        res.json({
            result: false,
            message: 'No URL Provided'
        })
    }

    });
router.route('/pat_link')
    .post((req, res) => {
        const url = req.body.urls;
        if (url) {
            patLink.getLinks(req.body.urls, req.session.od).then(data => {
                res.json({
                    result: true,
                    data: data
                })
            }, err => {
                res.json({
                    result: false,
                    message: 'Something went wrong'
                })
            });
        } else {
            res.json({
                result: false,
                message: 'No URL Provided'
            })
        }
    });

router.route('/vpath/url')
    .post((req, res) => {
        const urls = req.body.urls;
        if (urls) {
            vPath.runMultiTasks(urls, req.session.od, (err, data) => {
                if (!err) {
                    res.json({
                        result: true,
                        data: data
                    })
                } else {
                    console.log(`[ X ] : query from ${req.session.od.odUser} error, msg ; ${err}`);
                    res.json({
                        result: false,
                        message: err.message
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
router.route('/export/')
    .post((req, res) => {
        let obj = {
            content: JSON.parse(req.body.data),
            title: req.body.title || `report - ${new Date().getTime()}`,
            file: req.body.file
        };
        res.end(report.create(obj));
    });

router.route('/files/:fileName')
    .get((req, res) => {
        const path = `./static/data/${req.params.fileName}`;
        res.download(path, (err) => {
            fs.unlinkSync(path);
        });
    });

router.route('/files/tmp/:fileName')
    .get((req, res) => {
        const path = `./tmp/${req.params.fileName}`;
        res.download(path, (err) => {
            fs.unlinkSync(path);
        });
    });

exports.router = router;