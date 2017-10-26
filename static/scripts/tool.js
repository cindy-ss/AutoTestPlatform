let Tools = angular.module("Tools", []);

Tools.controller('mainCtrl', util.getParam(function($scope){
    $scope.msg = 'lll';
}));