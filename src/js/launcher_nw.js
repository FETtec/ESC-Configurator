'use strict';

nw.Window.open('src/main.html', {
    'id': 'fettec-esc-config',
    'title': 'FETtec ESC configurator v' + chrome.runtime.getManifest().version,
    "min_width": 900,
    "min_height": 650,
    'position': 'center',
    'resizable': true
});
