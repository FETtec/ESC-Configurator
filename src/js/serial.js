"user strict";
// Begin const and local var

var ignoreOwnBytesIndex = 0;
var TX_busy = 0;
var oldPortPath;
var oldPortsPaths = [];

// Begin functions


// Serial listener
chrome.serial.onReceive.addListener(function RX_data(DataIn) {
    if (DataIn) {
        if (DataIn.data.byteLength > 0) {
            var data = new Uint8Array(DataIn.data);
            for (var i = 0; i < data.length; i++) {
                if (onewire) {
                    if (ignoreOwnBytesIndex > 0) {
                        ignoreOwnBytesIndex--;
                        continue;
                    }
                }
                SerialConnection.RXBuffer[SerialConnection.RX_head++] = data[i];
            }
        }
    }
});

chrome.serial.onReceiveError.addListener(function check_receive_error(info) {
    switch (info.error) {
        case 'device_lost':
	    // führt in chrome zum abbruch des flashens nach switch zum BL oder anderstrum mit VCP
            //disconnect(); 
            break;
        case 'disconnected':
            break;
        default:
            eventMessage(info.error, 0)
            break;

    }
});

function sendBytes(bytes, do_not_Ignore_Last_Byte = 0) {
    LastSentData = [];
    if (onewire) ignoreOwnBytesIndex = bytes.length - do_not_Ignore_Last_Byte;
    for (var i = 0; i < bytes.length; i++) {
        LastSentData[i] = bytes[i];
        SerialConnection.TXBuffer[SerialConnection.TX_head++] = bytes[i];
    }
    if (!TX_busy) TX();
}

function SerialAvailable() {
    var B_length = (SerialConnection.RX_head - SerialConnection.RX_tail);
    if (B_length < 0) B_length = B_length * -1;
    return B_length;
}

function readByte() {
    var returnByte = 0;
    if (SerialConnection.RX_tail != SerialConnection.RX_head) {
        returnByte = SerialConnection.RXBuffer[SerialConnection.RX_tail++];
    }
    return returnByte;
}

function readBytes(count) {
    var returnArr = [];
    while (SerialConnection.RX_tail != SerialConnection.RX_head && count > 0) {
        returnArr.push(SerialConnection.RXBuffer[SerialConnection.RX_tail++]);
    }
    return returnArr;
}


function TX() {
    if (SerialConnection.TX_tail != SerialConnection.TX_head) {
        TX_busy = 1;
    } else {
        TX_busy = 0;
        return;
    }
    var sendBuf = [];
    var tmpHead = SerialConnection.TX_head;
    while (SerialConnection.TX_tail != tmpHead) {
        sendBuf.push(SerialConnection.TXBuffer[SerialConnection.TX_tail++]);
    }

    chrome.serial.send(SerialConnection.connection.connectionId, str2ab(sendBuf), TX_done);
}


function ReconnectOnSend(reconnectState) {
    eventMessage("ReconnectOnSend - " + reconnectState, -1)
    if (connectionType == VCP) {
        if (reconnectState == 0) { // wait for data to be sent
            oldPortsPaths = [];
            for (var i in SerialConnection.FoundPorts) {
                oldPortsPaths.push(SerialConnection.FoundPorts[i].path);
            }
            eventMessage("reconnect, wait for data to be sent", -1);
            reconnectOnTxDone = 1;
        } else if (reconnectState == 2) { // close com port
            eventMessage("reconnect, closing old port", -1);
            oldPortPath = SerialConnection.Port;
            if (typeof SerialConnection.connection.connectionId !== 'undefined')
                chrome.serial.disconnect(SerialConnection.connection.connectionId, function () { ReconnectOnSend(3); });
            reconnectOnTxDone = 3;
        } else if (reconnectState == 3) { // port Closed, reconnect
            chrome.serial.getDevices(function (ports) {
                ReconnectToOldPort(ports);
            });
        }
    }
    ptStatus = 0;
}

function ReconnectToOldPort(ports) {
    reconnectTry++;
    eventMessage("reconnect, search new port", -1);
    eventMessage("reconnect, oldPortPath = " + oldPortPath, -1);
    for (var i in ports) {
        if (ports[i].path == oldPortPath) {
            eventMessage("reconnect, connect to new port foundPortPath = " + ports[i].path, -1);
            chrome.serial.connect(ports[i].path, { bitrate: use_bit_rate, bufferSize: 200000, persistent: true }, onPortOpen);
            UpdateSerialSection("connect");
	    waitLoops = 40;
            return;
        }
    }
    for (var i in ports) {
        if (!oldPortsPaths.includes(ports[i].path)) {
            eventMessage("reconnect, connect to new port foundPortPath = " + ports[i].path, -1);
            chrome.serial.connect(ports[i].path, { bitrate: use_bit_rate, bufferSize: 200000, persistent: true }, onPortOpen);
            UpdateSerialSection("connect");
	    waitLoops = 40;
            return;
        }
    }
    eventMessage("reconnect, port not found - try " + reconnectTry, -1);
    if (reconnectTry > 4000) {
        disconnect();
        return;
    }
    ReconnectOnSend(3);
}

function TX_done() {
    if (SerialConnection.TX_tail != SerialConnection.TX_head) TX();
    else {
        TX_busy = 0;
        if (reconnectOnTxDone == 1) {
            reconnectOnTxDone = 2;
            eventMessage("reconnect, data sent...", -1);
            setTimeout(function () { ReconnectOnSend(reconnectOnTxDone); }, 500);
        }
    }
}

function checkPorts(ports, force) {
    if ((SerialConnection.connected == 0 && ports.length != SerialConnection.FoundPorts.length) || typeof (force) !== 'undefined') {
        SerialConnection.FoundPorts = ports;
        GenSerialDropdown(SerialConnection.FoundPorts);
    }
}

var str2ab = function (arr) {
    var buf = new ArrayBuffer(arr.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0; i < arr.length; i++) {
        bufView[i] = arr[i];
    }
    return buf;
};

