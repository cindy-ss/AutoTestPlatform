/**
 * Created by Edel on 16/4/7.
 */

var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/test';
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var con = mongoose.createConnection(url);

//var decision = con.model("decision");

exports.getType = function(req, response){

};

exports.getTypes = function(req, response){

};

exports.getTypeList = function(req, response){

};

exports.addType = function(req, res){};

exports.remove = function(req, res){};