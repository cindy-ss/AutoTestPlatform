var request = require("superagent");
var async = require("async");
var url = "http://183.203.38.6:8680/irms/services/OntChangeWsService";
var cityArr = [];
var countyArr = [];
var zoneArr = [];

var deWrapper = function (str) {
    var temp = str.substring(str.indexOf("<ns1:out>") + 9, str.indexOf("</ns1:out>"));
    var res;
    try{
        res = JSON.parse(temp);
    }
    catch(e) {
        res = temp;
    }
    return res;
};

//get cityList
var search = function(){
    var temp = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.hbo.sxresource.resource.inspur.com"> <soapenv:Header/> <soapenv:Body> <ws:queryCity> <ws:in0>{"type":"city","zh_label":"","cityId":""}</ws:in0> </ws:queryCity> </soapenv:Body> </soapenv:Envelope>';
    request.post(url)
        .send(temp)
        .end(function (err, response) {
            var obj = deWrapper(response.text);
            if(obj && obj.data){
                cityArr = obj.data;
                async.reduce(cityArr, [], function (memo, item, callback) {
                    getCounty(memo, item, callback);
                }, function(err, result){

                    //console.log(result);

                    async.reduce(result, [], function (memo, item, callback) {
                        getZone(memo, item, callback);
                    }, function(err2, result2){
                        if(!err2){
                            console.log("=================================");
                        }
                        getAccount(result2);
                    });
                });
            }
        });
};

var getCounty = function (arr, city, cb) {
    var temp = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.hbo.sxresource.resource.inspur.com"> <soapenv:Header/> <soapenv:Body> <ws:queryCity> <ws:in0>{"type":"county","zh_label":"","cityId":"' + city.id + '"}</ws:in0> </ws:queryCity> </soapenv:Body> </soapenv:Envelope>';
    request.post(url)
        .send(temp)
        .end(function (err, response) {
            var obj = deWrapper(response.text);
            if(obj && obj.data){
                obj.data.forEach(function(item, index){
                    var temp = item;
                    temp.cityId =city.id;
                    arr.push(temp);
                });
            }
            cb(null, arr);
        });
};

search();

var getZone = function (arr, item, cb) {
    var temp = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.hbo.sxresource.resource.inspur.com"> <soapenv:Header/> <soapenv:Body> <ws:queryZone> <ws:in0>{"cityId": "' + item.cityId + '","countyId": "' + item.id + '","zh_label":"","longitude":"","latitude":""}</ws:in0> </ws:queryZone> </soapenv:Body> </soapenv:Envelope>';
    request.post(url)
        .send(temp)
        .end(function (err, response) {
            var obj = deWrapper(response.text);
            if(obj && obj.data){
                obj.data.forEach(function(item){
                    var temp = item;
                    temp.cityId =item.cityId;
                    temp.countyId = item.id;
                    arr.push(temp);
                });
            }
            cb(null, arr);
        });
};

var getAccount = function(arr){
    async.reduce(arr, 0, function (memo, item, callback) {
        temp = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.hbo.sxresource.resource.inspur.com"> <soapenv:Header/> <soapenv:Body> <ws:queryAccount> <ws:in0>Object {zoneId: "' + item.id + '", zh_label: ""}</ws:in0> </ws:queryAccount> </soapenv:Body> </soapenv:Envelope>';
        request.post(url)
            .send(temp)
            .end(function (err, response) {
                if(!err){
                    if(response.text != '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soap:Body><ns1:queryAccountResponse xmlns:ns1="http://ws.hbo.sxresource.resource.inspur.com"><ns1:out>{"data":[</ns1:out></ns1:queryAccountResponse></soap:Body></soap:Envelope>'){
                        console.log(item, response.text);
                        callback(item)
                    }
                    else{
                        console.log(item.id + "failed");
                        callback(null, memo + item)
                    }
                }
                else{
                    console.log(err);
                    callback(err)
                }
            })
    }, function (err) {
        if(!err){
            console.log("Done");
        }
        else{
            console.log(err);
        }
    });

};