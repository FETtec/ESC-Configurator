'use strict';

chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create('src/main.html', {
        id: 'fettec-esc-config',
        frame: 'chrome',
        innerBounds: {
            minWidth: 900,
            minHeight: 650
        }
    },
        function (createdWindow) {
            if (getChromeVersion() >= 54) {
                createdWindow.icon = 'src/images/icon_128.png';
            }
        }
    );
});

function getChromeVersion() {
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

    return raw ? parseInt(raw[2], 10) : false;
}