/**
 * Created by Edel on 16/1/27.
 */
var edel = angular.module("edel", ['api', 'ngRoute']);

edel.config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/', {templateUrl : "views/main.html", controller: "mailCtrl"}).
    when('/file', {templateUrl: "views/file.html", controller: "fileCtrl"}).
    when('/image', {templateUrl: "views/image.html", controller: "imageCtrl"}).
    when('/todo', {templateUrl: "views/todo.html", controller: "todoCtrl"}).
    when('/lobby', {templateUrl: "views/lobby.html", controller: "lobbyCtrl"}).
    when('/cockroach', {templateUrl: "views/cockroach.html", controller: "cockroachCtrl"});
    //when('/cockroach', {templateUrl: "views/cockroach.html", controller: "cockroachCtrl"}).
    //otherwise({redirectTo : "/"});
}]);

edel.controller("masterCtrl", util.getParam(function($scope, $rootScope, user, socket){
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
}));

edel.controller("navCtrl", util.getParam(function($scope, $rootScope){
    $scope.active = 0;
    $scope.setActive = function(num){
        $scope.active = num;
    };
}));

edel.controller("mailCtrl", util.getParam(function($scope){
    $scope.mailList = [];
}));

edel.controller("fileCtrl", util.getParam(function($scope, file){
    $scope.currentStat = false;
    $scope.fileList = [];
    $scope.currentFileExt = "";
    $scope.pathList = ["/", "Users/", "Edel/"];
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
        console.log($rootScope.loginStat);
        if($scope.user.name === undefined){
            $rootScope.loginStat = true;
            console.log($rootScope.loginStat);
        }
        else {
            $scope.currentStat = true;
        }
    };

    $scope.createRoom = function(){
        if($scope.newRoomName){
            socket.emit("createRoom", $scope.newRoomName);
            $scope.currentStat = false;
            $scope.newRoomName = "";
        }
    };

    $scope.joinRoom = function(str){
        socket.emit("joinRoom", str);
    };

//=================

    socket.on("roomList", function(roomList){
        $scope.roomList = roomList;
    });

    socket.on("createRoomCB", function(str){
        if(str){
            $location.url("cockroach?room=" + str);
        }
    });
}));

edel.controller('cockroachCtrl', util.getParam(function($scope, $location, socket){
    $scope.currentStat = false;
    var roomName = $location.search()["room"];
    socket.emit("getRoomInfo", roomName);
}));