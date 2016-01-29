var request = require("request");

var options = {
    url:'http://10.225.8.187:9081/mp/rest/rout/invokeWebServiceWithXml',
    form: {
        //key:'value'
        "openid" : "dongxin",
        "area" : "",
        "openkey" : "3e7e31a3-82b7-45fd-9799-a74f5dcb709c",
        "serviceName" : "QueryApplyList",
        "param" : '{"APPLYSTATUS":"040","ROLEID":"2A1","EndTime":"","PAGEINDEX":5,"StartTime":"","PAGECOUNT":15,"CertNo":"","CUSTOMERNAME":"","USERID":"00101"}',
        "timeout" : "6000"
    }
};

request.post(options, function(err,httpResponse,body){
    console.log(body);
});