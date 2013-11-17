(function () {

    // everything should work in browser where no require is available
    if (typeof require === 'undefined') {
        require = function () {};
    }

    window.gui = require('nw.gui');

    var main = angular.module('main', ['app', 'project']);

    if (gui) {
        window.nativeWindow = gui.Window.get();

        nativeWindow.on('loaded', function () {
            nativeWindow.show();
            nativeWindow.focus();
        });

        Mousetrap.bind(['meta+alt+j'], function () {
            nativeWindow.showDevTools();
        });
    }

})();
