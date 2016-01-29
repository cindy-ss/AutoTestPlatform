/**
 * Created by Edel on 16/1/27.
 */
var edel = angular.module("edel", []);

edel.controller("indexCtrl", util.getParam(function($scope){
    $scope.msg = "fuck";
}));