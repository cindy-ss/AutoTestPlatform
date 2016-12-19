var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'jdbc:oracle:thin:@10.110.2.41:1521:zsyw',
	user     : 'blackbox_ys',
	password : 'blackbox_ys',
	database : 'my_db'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
	if (err) throw err;

	console.log('The solution is: ', rows[0].solution);
});

connection.end();