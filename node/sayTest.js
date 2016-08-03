var say = require('say');

//// Use default system voice and speed
//say.speak('Hello!');
//
//// Stop the text currently being spoken
//say.stop();

// More complex example (with an OS X voice) and slow speed
//say.speak('竜が私が敌を喰らう!');
//
//// Fire a callback once the text has completed being spoken
//say.speak('whats up, dog?', 'Good News', 1.0, function(err) {
//    if (err) {
//        return console.error(err);
//    }
//
//    console.log('Text has been spoken.');
//});

//var fs = require('fs');
var Speaker = require('speaker');
var OpenJTalk = require('node-openjtalk').OpenJTalk;

// pre-included HTS voice file
var fn_voice = OpenJTalk.voices.mei_happy;
// instantiate OpenJTalk with an HTS voice
var open_jtalk = new OpenJTalk({voice: fn_voice});

//// synthesize a voice buffer from a text
//open_jtalk.synthesize("すもももももももものうち", function(error, buffer) {
//    if (!error) {
//        // save as audio file
//        var fd = fs.openSync(__dirname + '/test.wav', 'w');
//        fs.write(fd, buffer, 0, buffer.length, null, function(err, written, buffer) {
//            fs.closeSync(fd);
//        });
//    }
//});

// synthesize a voice synchronously
var buffer = open_jtalk.synthesizeSync("竜が私が敌を喰らう");

// flush to node-speaker
var speaker = new Speaker({
    channels: 1,
    bitDepth: 16,
    sampleRate: 48000
});
speaker.end(buffer);