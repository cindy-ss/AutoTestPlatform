/**
 * Created by Edel on 16/3/22.
 */

var config = (function () {
    return {
        types: [{
                name : "首页",
                url : "/"
            },{
                name : "文件",
                url : "/file"
            },{
                name : "图册",
                url : "/image"
            }, {
                name : "待办",
                url : "/todo"
            },{
                name : "大厅",
                url : "/lobby"
            },{
                name : "曲线",
                url : "/emotion"
            },{
                name : "手气不错",
                url : "/decision"
            }
        ],
        pages: [
            {
                type: "首页",
                url: "/",
                template: "views/main.html",
                ctrl: "mailCtrl"
            },
            {
                type: "文件",
                url: "/file",
                template: "views/file.html",
                ctrl: "fileCtrl"
            },
            {
                type: "图册",
                url: "/image",
                template: "views/image.html",
                ctrl: "imageCtrl"
            },
            {
                type: "待办",
                url: "/todo",
                template: "views/todo.html",
                ctrl: "todoCtrl"
            },
            {
                type: "大厅",
                url: "/lobby",
                template: "views/lobby.html",
                ctrl: "lobbyCtrl"
            },
            {
                type: "大厅",
                url: "/cockroach",
                template: "views/cockroach.html",
                ctrl: "cockroachCtrl"
            },
            {
                type: "曲线",
                url: "/emotion",
                template: "views/emotion.html",
                ctrl: "emotionCtrl"
            },
            {
                type: "手气不错",
                url: "/decision",
                template: "views/decision.html",
                ctrl: "decisionCtrl"
            }
        ]
    }
}());