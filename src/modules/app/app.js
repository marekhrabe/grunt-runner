(function () {

    var app = angular.module('app', []);

    app.filter('orderObject', function () {
        return function (input, attribute) {
            if (!input) {
                return input;
            }
            var array = [];
            for (var objectKey in input) {
                array.push(input[objectKey]);
            }

            array.sort(function (a, b) {
                a = parseInt(a[attribute]);
                b = parseInt(b[attribute]);
                return a - b;
            });
            return array;
        };
    });

    app.directive('app', function ($rootScope) {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                var el = element[0];

                var cancel = function (e) {
                    e.preventDefault();
                    return false;
                };

                el.addEventListener('dragover', cancel);
                el.addEventListener('dragenter', cancel);
                el.addEventListener('drop', function (e) {
                    e.preventDefault();
                    var files = e.dataTransfer.files;
                    if (files.length) {
                        window.nativeWindow.focus();
                        $rootScope.$apply(function () {
                            $rootScope.$broadcast('selected', files[0].path);
                        });
                    }
                });
            },
        };
    });

})();
