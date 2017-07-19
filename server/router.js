/**
 * Created by edel.ma on 7/19/17.
 */

const express = require('express');
const router = express.Router();

const trans = require('./trans');
const wechat = require('./wechat');

router.route('/init')
    .post((req, res) => {
        console.log(req.body.odUser);
        console.log(req.body.odPass);

        if(req.body.odUser && req.body.odPass){
            req.session.od = {
                odUser : req.body.odUser,
                odPass : req.body.odPass
            }
        }
        res.json(req.session.od);
    })
    .get((req, res) => {
        if(!req.session.od){
            req.session.od = {};
        }
        res.json(req.session.od);
    });

router.route('/trans')
    .post((req, res) => {
        trans.runTask(req.body.urls.split('\n'), data => {
            res.json(data);
        });
    });

router.route('/wechat')
    .post((req, res) => {
        wechat.runTask(req.body.urls.split('\n'), data => {
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
            res.end(exPath);
        });
    });
router.route('/wechat2xls')
    .post((req, res) => {
        let obj = {
            xls: JSON.parse(req.body.xls),
            type: req.body.type
        };
        wechat.export2Xls(obj, (err, exPath) => {
            res.end(exPath);
        });
    });

exports.router = router;