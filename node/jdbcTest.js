var JDBC = require('jdbc');
var jinst = require('jdbc/lib/jinst');

if (!jinst.isJvmCreated()) {
    jinst.addOption("-Xrs");
    //jinst.setupClasspath(['./drivers/hsqldb.jar',
    //    './drivers/derby.jar',
    //    './drivers/derbyclient.jar',
    //    './drivers/derbytools.jar']);
    jinst.setupClasspath(['../lib/ojdbc6.jar']);
}

var config = {
    // Required
    url: 'jdbc:oracle:thin:@10.110.2.41:1521:zsyw',

    //// Optional
    drivername: 'oracle.jdbc.driver.OracleDriver',
    //minpoolsize: 10,
    //maxpoolsize: 100,

    // Note that if you sepecify the user and password as below, they get
    // converted to properties and submitted to getConnection that way.  That
    // means that if your driver doesn't support the 'user' and 'password'
    // properties this will not work.  You will have to supply the appropriate
    // values in the properties object instead.
    user: 'blackbox_ys',
    password: 'blackbox_ys',
    properties: {}
};

var db = new JDBC(config);

db.reserve(function(err, conn){
    console.log(err);
    console.log(conn);
    if(conn){
        db.release(conn, function(err) {
            if (err) {
                console.log(err.message);
            }
        });
    }
});