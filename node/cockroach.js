/**
 * Created by Edel on 16/2/22.
 */
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


var total = [],
    playerNum = 0,
    current,
    isOver = false,
    players = [],
    turns = 0;

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

var start = function(){
    rl.question("How many players are there?", function(num){
        playerNum = num;
        total = sortCards();
        players = initPlayer(playerNum);
        current = 0;
        var target, isTrue, env;
        while(!isOver){
            target = getDiffNum(current, playerNum);
            env = players[current].getCard(target);
            isTrue = players[target].react(env);

            console.log("Turn " + turns + ":   " + current + " Send a " + env.inner + "/" + env.outer + " to " + target);
            console.log("=====" + isTrue);
            console.log(players[0].cardArr);
            console.log(players[1].cardArr);
            console.log(players[2].cardArr);

            if(isTrue){
                players[current].cardArr[env.inner] ++;
            }
            else {
                players[target].cardArr[env.inner] ++;
                current = target;
            }

            isOver = checkState();
            turns ++;
        }
        rl.close();
    });
};

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

start();