/**
 * Created by Edel on 16/1/30.
 */
var api = angular.module('api', []);

api.factory('socket', function($rootScope) {
    var socket = io();
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if(callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

api.service('mail', util.getParam(function ($http) {
    this.init = function (cb) {
        $http.get("./getmail").success(function (data) {
            cb(data);
        });
    };
}));

api.service('file', util.getParam(function ($http) {
    this.getFileList = function (dir, action, cb) {
        var option = {
            "dir": dir,
            "action": action
        };
        $http.post("./getFileList", option)
            .success(function (data) {
                cb(data);
            });
    };
}));

api.service('os', util.getParam(function ($http, $timeout) {
    var t;
    var getInfo = function (cb) {
        $http.get("./getOsInfo").success(function (data) {
            cb(data);
            //t = $timeout(getInfo(cb), 100000);
        });
    };

    this.refreshInfo = function (cb) {
        //t = $timeout(getInfo(cb), 100000);
        getInfo(cb);
    };
}));

api.service('http', util.getParam(function ($http) {
    this.imageSearch = function (url, cb) {
        $http.post("./imageSearch", url).success(function (data) {
            cb(data);
        });
    }
}));

api.service("todo", util.getParam(function ($http) {
    this.getAllCards = function (cb) {
        $http.get("./cards")
            .success(function (data) {
                cb(data);
            });
    };

    this.addCardByList = function (listId, cardContent, cb) {
        var obj = {
            "listId" : listId,
            "content" : cardContent
        };
        $http.post("./cards/" + listId, obj)
            .success(function(data){
                console.log(data);
                cb(data);
            });
    };
    this.updateCardName = function(){};
    this.deleteCard = function(listId, cardIndex, cb){
        $http.delete("./cards/" + listId + "/" + cardIndex)
            .success(function(res){
                console.log(res);
                cb(res);
            });
    };

    this.addList = function (con, cb) {
        var obj = {
            name : con,
            cards : []
        };
        $http.post("./cards", obj)
            .success(function(data){
                console.log(data);
                cb(data);
            })
    };
    this.updateListName = function(){};
    this.deleteList = function(listId, cb){
        $http.delete("./cards/" + listId)
            .success(function(data){
                console.log(data);
                cb(data);
            });
    };
}));

api.service("cockroach", util.getParam(function($http){
    var total = [],
        playerNum = 0,
        current,
        isOver = false,
        players = [],
        turns = 0;

    this.getState = function(){
        return {
            total : total,
            playerNum : playerNum,
            current : current,
            players : players,
            turns : turns
        }
    };

    var createPlayer = function(){
        var obj = {
            deck : [],
            cardArr : {},
            seat : 0
        };

        for(var i = 1; i <= 8; i ++){
            obj.cardArr[i.toString()] = 0;
        }

        //todo outer should have meanings.
        obj.getCard = function(seatNo){
            var res = {
                inner : 0,
                outer : 0
            };
            var pos = Math.floor(obj.deck.length * Math.random());
            res.inner = obj.deck[pos];
            obj.deck.splice(pos, 1);
            res.outer = res.inner;
            return res;
        };

        //todo react should have meanings.
        obj.react = function(obj){
            var inner = obj.inner,
                outer = obj.outer,
                res, believe;
            believe = Math.random() > 0.5;
            res = believe === (inner == outer);
            return res;
        };

        return obj;
    };

    this.init = function(num){
        playerNum = num;
        total = sortCards();
        players = initPlayer(playerNum);
        current = 0;
        //var target, isTrue, env;
        //while(!isOver){
        //    target = getDiffNum(current, playerNum);
        //    env = players[current].getCard(target);
        //    isTrue = players[target].react(env);
        //
        //    console.log("Turn " + turns + ":   " + current + " Send a " + env.inner + "/" + env.outer + " to " + target);
        //    console.log("=====" + isTrue);
        //    console.log(players[0].cardArr);
        //    console.log(players[1].cardArr);
        //    console.log(players[2].cardArr);
        //
        //    if(isTrue){
        //        players[current].cardArr[env.inner] ++;
        //    }
        //    else {
        //        players[target].cardArr[env.inner] ++;
        //        current = target;
        //    }
        //
        //    isOver = checkState();
        //    turns ++;
        //}
    };

    this.getCards = function(){};

    var checkState = function(){
        var res = false;
        for(var i = 0; i < playerNum; i ++){
            res = res || players[i].deck.length <= 0;
            var j = 1;
            while(!res && j <= 8){
                res = res || players[i].cardArr[j.toString()] >= 4;
                j ++;
            }
        }
        return res;
    };

    var getDiffNum = function(num, size){
        var res;
        while(res === undefined || res == num){
            res = Math.floor(Math.random() * size);
        }
        return res;
    };

    var sortCards = function(){
        var temp = {};
        var tempNum;
        var flag = true;
        var res = [];
        for(var i = 0; i < 64; i ++){
            while(flag){
                tempNum = Math.ceil(Math.random() * 8);
                temp[tempNum] = temp[tempNum] ? temp[tempNum] : 0;
                flag = temp[tempNum] >= 8;
            }
            flag = true;
            temp[tempNum] ++;
            res.push(tempNum);
        }
        return res;
    };

    var initPlayer = function(num){
        var temp;
        var av = Math.floor(total.length / num);
        var res = [];
        for(var i = 0; i < num; i ++){
            temp = createPlayer();
            temp.seat = i + 1;
            temp.deck = total.slice(i * av, (i + 1) * av -1).sort();
            res.push(temp);
        }
        return res;
    };

    this.setPlayerNum = function(num){};
}));

api.service("user", util.getParam(function($http){
    var user = {};
    this.login = function(name, pwd, cb){
        user.name = name;
        user.pwd = pwd;
        user.rooms = [];
        cb(true);
    };

    this.getStat = function(){
        return user;
    };
}));