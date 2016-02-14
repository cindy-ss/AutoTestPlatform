/**
 * Created by Edel on 16/1/27.
 */
var Imap = require('imap'),
    inspect = require('util').inspect;

var imap = new Imap({
    user: '526135164@qq.com',
    password: 'Fucky0uassh0le',
    host: 'imap.qq.com',
    port: 993,
    tls: true
});

var res = [];
var cbEnd;

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
    openInbox(function(err, box) {
        if (err) throw err;
        var f = imap.seq.fetch('1:3', {
            bodies: 'HEADER',
            //bodies: 'TEXT',
            size : true,
            struct: true
        });
        f.on('message', function(msg, seqno) {
            console.log('Message #%d', seqno);
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function(stream, info) {
                var buffer = '';
                stream.on('data', function(chunk) {
                    buffer += chunk.toString('utf8');
                });
                stream.once('end', function() {
                    console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                    res.push(inspect(Imap.parseHeader(buffer)));
                });
            });
            //msg.once('attributes', function(attrs) {
            //    console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            //});
            msg.once('end', function() {
                console.log(prefix + 'Finished');
            });
        });
        f.once('error', function(err) {
            console.log('Fetch error: ' + err);
            cbEnd(err);
        });
        f.once('end', function() {
            console.log('Done fetching all messages!');
            imap.end();
            cbEnd(res);
        });
    });
});

imap.once('error', function(err) {
    console.log(err);
});

imap.once('end', function() {
    console.log('Connection ended');
});

var getMail = function(cb){
    cbEnd = cb;
    imap.connect();
};

exports.getMail = getMail;