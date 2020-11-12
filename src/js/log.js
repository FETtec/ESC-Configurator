

function eventMessage(message, severity = 1) {
    // -2 = serial debug
    // -1 = debug only
    //  0 = warning
    //  1 = info


    var tmpMessage = '[' + new Date().toUTCString() + '] ' + message;

    switch (severity) {
        case 0:
            console.warn(tmpMessage, 'color: gray;');
        case -1:
            if (DEBUG)
                console.log(tmpMessage);
            break;
        case -2:
            if (SERIALDEBUG)
                console.log(tmpMessage, 'color: red;');
            break;
        default:
            console.log(tmpMessage);
            break;
    }

}