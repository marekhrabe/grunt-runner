(function () {

    var project = angular.module('project', []);

    project.controller('Project', function ($scope) {
        window.grunt = null;

        $scope.executeTask = function (task) {
            grunt.tasks(task.name);
        };

        $scope.$on('selected', function (e, folder) {
            var fs = require('fs');
            var path = require('path');
            var findup = require('findup-sync');
            var resolve = require('resolve').sync;

            var gruntpath;
            try {
                gruntpath = resolve('grunt', {
                    basedir: folder
                });
            } catch (ex) {
                gruntpath = findup('lib/grunt.js', {
                    cwd: folder,
                });
            }

            if (gruntpath) {
                grunt = require(gruntpath);
                process.chdir(folder);
                require(folder + '/Gruntfile')(grunt);

                // monkey patch grunt to not exit
                grunt.util.exit = function () {};

                var tasks = [];
                Object.keys(grunt.task._tasks).forEach(function(name) {
                    tasks.push(grunt.task._tasks[name]);
                });

                $scope.project = path.basename(folder);
                $scope.folder = folder;
                $scope.tasks = tasks;
            } else {
                $scope.project = 'error';
                $scope.folder = '';
                $scope.tasks = [];
            }
        });
    });

})();
