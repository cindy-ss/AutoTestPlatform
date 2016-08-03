/**
 * Created by Edel on 16/1/27.
 */
var edel = angular.module("edel", ['api', 'ngRoute'], function($compileProvider) {
    // configure new 'compile' directive by passing a directive
    // factory function. The factory function injects the '$compile'
    $compileProvider.directive('compile', function($compile) {
        // directive factory creates a link function
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        };
    });
});

edel.config(['$routeProvider', function($routeProvider){
    $routeProvider.
    //when('/', {templateUrl : "views/main.html", controller: "mailCtrl"}).
    //when('/file', {templateUrl: "views/file.html", controller: "fileCtrl"}).
    //when('/image', {templateUrl: "views/image.html", controller: "imageCtrl"}).
    //when('/todo', {templateUrl: "views/todo.html", controller: "todoCtrl"}).
    //when('/lobby', {templateUrl: "views/lobby.html", controller: "lobbyCtrl"}).
    //when('/cockroach', {templateUrl: "views/cockroach.html", controller: "cockroachCtrl"}).
    //when('/emotion', {templateUrl: "views/emotion.html", controller: "emotionCtrl"}).
    otherwise({redirectTo : "/"});

    angular.forEach(config.pages, function(value, key){
        $routeProvider.when(value.url, {
            templateUrl : value.template,
            controller : value.ctrl
        })
    });

}]);

edel.controller("masterCtrl", util.getParam(function($scope, $rootScope, user, $location){
    $scope.types = config.types;

    $scope.init = function(){};

    $scope.closeModel = function(){
        $rootScope.loginStat = false;
    };
    $scope.loginStart = function(){
        $rootScope.loginStat = true;
    };
    $scope.login = function(){
        var name = $scope.ex_name;
        var pwd = $scope.ex_pwd;
        user.login(name, pwd, function(res){
            if(res){
                $scope.name = $scope.ex_name;
                $scope.ex_name = "";
                $scope.closeModel();
            }
        })
    };

    console.log($location.path());
    var getCurrentPage = function(){
        var l = $location.path();
        var res = "首页";
        angular.forEach(config.pages, function(value, key){
            if(value.url == l) res = value.type;
        });
        return res;
    };
    $rootScope.currentPage = getCurrentPage();
    $scope.setActive = function(obj){
        $rootScope.currentPage = obj.name;
        $location.url(obj.url);
    };
}));

edel.controller("mailCtrl", util.getParam(function($scope){
    $scope.mailList = [];
}));

edel.controller("fileCtrl", util.getParam(function($scope, file){
    $scope.currentStat = false;
    $scope.fileList = [];
    $scope.currentFileExt = "";
    //$scope.pathList = ["/", "Users/", "Edel/"];
    $scope.pathList = ["/"];
    $scope.readDir = function(){
        var path = $scope.pathList.join("");
        file.getFileList(path, "list", function(data){
            $scope.fileList = data;
        });
    };
    $scope.readFile = function(path, ext){
        file.getFileList(path, "read", function(data){
            console.log(data);
            $scope.currentStat = true;
            switch(data.ext){
                case ".jpg" :
                case ".jpeg" :
                    $scope.currentFileExt = "image";
                    $scope.imageData = "data:image/jpg;base64," + data.data;
                    break;
                case ".png" :
                    $scope.currentFileExt = "image";
                    $scope.imageData = "data:image/png;base64," + data.data;
                    break;
                default:
                    $scope.currentFileExt = "file";
                    $scope.fileData = data.data;
                    break;
            }
        });
    };
    $scope.closeFile = function(){
        $scope.currentStat = false;
    };
    $scope.fileClass = function(file){
        var str = "";
        if(file.isFile) str += "glyphicon-file" + " text-primary";
        if(file.isDir) str += "glyphicon-folder-open" + " text-warning";
        return str;
    };
    $scope.open = function(file){
        if(file.isDir){
            $scope.pathList.push(file.name + "/");
            $scope.readDir();
        }
        if(file.isFile){
            var path = $scope.pathList.join("") + file.name;
            $scope.readFile(path, file.extName);
        }
    };
    $scope.goBack = function(){
        if($scope.pathList.length > 1) $scope.pathList.pop();
        $scope.readDir();
    };
    $scope.readDir();
}));

edel.controller("osCtrl", util.getParam(function($scope, os){
    $scope.os = {};
    os.refreshInfo(function(data){
        $scope.os = data;
        $scope.freemem = Math.round($scope.os.freemem / 1024 / 1024);
        $scope.totalmem = Math.round($scope.os.totalmem / 1024 / 1024);
        $scope.progessStle = "width:" + Math.round($scope.freemem / $scope.totalmem);
    })
}));

edel.controller("imageCtrl", util.getParam(function($scope, http){
    $scope.url = "http://www.baidu.com";
    $scope.imgList = [];
    $scope.loadUrl = function(){
        http.imageSearch($scope.url, function(data){
            console.log(data);
            $scope.imgList = data;
        });
    };
}));

edel.controller('todoCtrl', util.getParam(function($scope, todo){
    $scope.cards = [];
    $scope.showList = [];
    $scope.listContent = "";
    $scope.newCardContent = [];
    $scope.createNewList = false;

    $scope.showCardAdding = function(num){
        $scope.showList = [];
        $scope.showList[num] = true;
    };
    $scope.showListAdding = function(){
        $scope.showList = [];
        $scope.showList[-1] = true;
    };

    $scope.getAllCards = function(){
        todo.getAllCards(function(data){
            $scope.cards = data;
        });
    };
    $scope.addList = function(){
        if($scope.listContent != ""){
            todo.addList($scope.listContent, function(res){
                $scope.listContent = "";
                $scope.getAllCards();
            });
        }
    };
    $scope.addCard = function(listId, num){
        if($scope.newCardContent[num] != ""){
            todo.addCardByList(listId, $scope.newCardContent[num], function(res){
                $scope.newCardContent[num] = "";
                $scope.getAllCards();
            });
        }
    };
    $scope.deleteCard = function(listId, cardIndex){
        todo.deleteCard(listId, cardIndex, function(res){
            console.log(res);
            $scope.getAllCards();
        });
    };
    $scope.deleteList = function(listId){
        todo.deleteList(listId, function(res){
            console.log(res);
            $scope.getAllCards();
        });
    };
    $scope.closeAll = function(){
        $scope.showList = [];
    };

    $scope.getAllCards();
}));

edel.controller('lobbyCtrl', util.getParam(function($scope, $location, socket, user, $rootScope){
    $scope.currentStat = false;
    $rootScope.loginStat = false;
    $scope.user = user.getStat();

    $scope.closeModel = function(){
        $scope.currentStat = false;
    };

    $scope.creatingRoom = function(){
        if($scope.user.name === undefined){
            $rootScope.loginStat = true;
            console.log($rootScope.loginStat);
        }
        else {
            $scope.currentStat = true;
            $scope.newRoomName = "";
        }
    };

    $scope.createRoom = function(){
        if($scope.newRoomName){
            socket.emit("createRoom", $scope.newRoomName);
            $scope.currentStat = false;
        }
    };

    $scope.joinRoom = function(_id){
        if($scope.user.name === undefined){
            $rootScope.loginStat = true;
            console.log($rootScope.loginStat);
        }
        else {
            socket.emit("joinRoom", _id);
        }
    };
//================

    var roomListHandler = function(roomList){
        $scope.roomList = roomList;
    };

//=================

    socket.on("roomList", roomListHandler);

    socket.on("joinRoomCB", function(str){
        if(str){
            $location.url("cockroach?room=" + str);
        }
    });

    socket.emit("getRoomList");
}));

edel.controller('cockroachCtrl', util.getParam(function($scope, $location, socket, user){
    $scope.currentStat = false;
    var roomName = $location.search()["room"];
    socket.emit("getRoomInfo", roomName);

    $scope.user = user.getStat();

    if(!$scope.user.name){
        $location.url("lobby");
    }

    socket.on("roomInfo", function(str){
        $scope.info = JSON.parse(str);
    });

    $scope.backToLobby = function(){
        socket.emit("leaveRoom", roomName);
    };

    socket.on("leaveRoomCB", function(res){
        if(res){
            $location.url("lobby");
        }
    })
}));

edel.controller('emotionCtrl', util.getParam(function($scope, $rootScope, user, emotion){
    $scope.average = 0;

    var getData = function(){
        emotion.getEmotion(function(arr){
            $scope.emotion = arr;
            var sum = 0;
            arr.map(function(v, i, arr){
                sum += v.score;
            });
            console.log(sum);
            $scope.average = Math.round(sum * 10 / arr.length) / 10;
            drawDayEmotion(arr, "#map");
        });
    };

    $scope.format = function(d){
        var temp = new Date(d);
        return temp.getHours() + ":" + temp.getMinutes();
    };

    $scope.addDot = function(){
        var obj = {};
        obj.score = $scope.score;
        obj.title = $scope.title;
        obj.description = $scope.des;
        emotion.addDot(obj, function(res){
            console.log(res);
            $scope.score = 0;
            $scope.title = "";
            $scope.des = "";
            getData();
        })
    };

    getData();
}));

edel.controller("decisionCtrl", util.getParam(function($scope){
    $scope.options = ["KFC", "饺子", "麻辣烫", "亚惠", "顶牛", "外院"];

    $scope.resList = ["", "饺子", ""];
    $scope.weekList = ["周一", "周二", "周三", "周四", "周五"];
    $scope.banList = $scope.resList.unique();

    $scope.d = new Date().getDay();

    var target = [];
    var getTarget = function(){
        target = $scope.options.filter(function(item){
            return $scope.banList.indexOf(item) == -1;
        });
    };
    getTarget();

    $scope.ban = function(str){
        var p = $scope.banList.indexOf(str);
        if(p == -1){
            $scope.banList.push(str);
        }
        else{
            $scope.banList.splice(p, 1);
        }
        console.log($scope.banList);
        getTarget();
    };

    $scope.getOption = function(){
        var i = Math.floor(Math.random() * target.length);
        //console.log(target[i]);
        $scope.resList[$scope.d - 1] = target[i];
    };

    $scope.addOption = function () {
        if($scope.newOption != "" && $scope.options.indexOf($scope.newOption) != -1) {
            alert("Fuck");
            return;
        }
        $scope.options.push($scope.newOption);
        getTarget();
        $scope.adding = false;
    };

    $scope.removeOption = function(i){
        $scope.options.splice(i, 1);
        getTarget();
    }
}));

edel.controller("assistantCtrl", util.getParam(function($scope, assistant, socket){
    $scope.thumb = "normal";
    socket.on("emotion", function(str){
        $scope.thumb = str;
    });
    socket.on("answer", function(str){
        $scope.words = str;
    });
    $scope.tap = function(){
        socket.emit("touch");
    };
}));

edel.controller("cliCtrl", util.getParam(function($scope, assistant, socket){
    $scope.say = function(){
        socket.emit("say", $scope.words);
    };
}));