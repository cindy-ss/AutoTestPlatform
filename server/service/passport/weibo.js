var passport = require("passport");
var ws = require('passport-weibo').Strategy;

passport.use(new ws({
        clientID: "2567173338@qq.com",
        clientSecret: "1stBl00d",
        callbackURL: "http://127.0.0.1:2333/#/"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(accessToken, refreshToken, profile, done);
        User.findOrCreate({ weiboId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));