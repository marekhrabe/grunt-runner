/*!
 * Grunt - v0.1.0
 * 
 * team@madebysource.com
 * 
 * Copyright 2013 Piffle LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited by law.
 * This file is proprietary and confidential
 * 
 * Author:
 * Marek Hrabe <marekhrabe@abdoc.net> (http://github.com/marekhrabe)
 * 
 * Contributors:
 * Petr Brzek <petrbrzek@abdoc.net> (http://github.com/petrbrzek)
 * 
 * Build v0.1.0 - 2013-11-17
 */
!function(){"undefined"==typeof require&&(require=function(){}),window.gui=require("nw.gui");var main=angular.module("main",["app","project"]);gui&&(window.nativeWindow=gui.Window.get(),nativeWindow.on("loaded",function(){nativeWindow.show(),nativeWindow.focus()}),Mousetrap.bind(["meta+alt+j"],function(){nativeWindow.showDevTools()}))}(),function(){var app=angular.module("app",[]);app.filter("orderObject",function(){return function(input,attribute){if(!input)return input;var array=[];for(var objectKey in input)array.push(input[objectKey]);return array.sort(function(a,b){return a=parseInt(a[attribute]),b=parseInt(b[attribute]),a-b}),array}}),app.directive("app",function($rootScope){return{restrict:"E",link:function(scope,element,attrs){var el=element[0],cancel=function(e){return e.preventDefault(),!1};el.addEventListener("dragover",cancel),el.addEventListener("dragenter",cancel),el.addEventListener("drop",function(e){e.preventDefault();var files=e.dataTransfer.files;files.length&&(window.nativeWindow.focus(),$rootScope.$apply(function(){$rootScope.$broadcast("selected",files[0].path)}))})}}})}(),function(){var project=angular.module("project",[]);project.controller("Project",function($scope){window.grunt=null,$scope.executeTask=function(task){grunt.tasks(task.name)},$scope.$on("selected",function(e,folder){var fs=require("fs"),path=require("path"),findup=require("findup-sync"),resolve=require("resolve").sync,gruntpath;try{gruntpath=resolve("grunt",{basedir:folder})}catch(ex){gruntpath=findup("lib/grunt.js",{cwd:folder})}if(gruntpath){grunt=require(gruntpath),process.chdir(folder),require(folder+"/Gruntfile")(grunt),grunt.util.exit=function(){};var tasks=[];Object.keys(grunt.task._tasks).forEach(function(name){tasks.push(grunt.task._tasks[name])}),$scope.project=path.basename(folder),$scope.folder=folder,$scope.tasks=tasks}else $scope.project="error",$scope.folder="",$scope.tasks=[]})})}();