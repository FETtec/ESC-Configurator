var gui = require('nw.gui');
var win = gui.Window.get();
win.on('new-win-policy', function (frame, url, policy) {
    gui.Shell.openExternal(url);
    policy.ignore();
});