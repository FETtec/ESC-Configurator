"user strict";
// Begin const and local var

var ignoreOwnBytesIndex = 0;
var TX_busy = 0;
var oldPortPath;

// Begin functions


    // Serial listener
    chrome.serial.onReceive.addListener(function RX_data(DataIn) {
        if (DataIn) {
            if (DataIn.data.byteLength > 0) {
                var data = new Uint8Array(DataIn.data);
                if (DEBUG) console.log(data);
                for (var i = 0; i < data.length; i++) {
                    if (OneWire) {
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
                disconnect();
                break;
            case 'disconnected':
                break;
            default:
                console.log(info.error)
                break;

        }
    });

function sendBytes(bytes, do_not_Ignore_Last_Byte = 0) {
    LastSentData = [];
    if (OneWire) ignoreOwnBytesIndex = bytes.length - do_not_Ignore_Last_Byte;
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
    if (ConnectionType == VCP) {
        if (reconnectState == 0) { // wait for data to be sent
            if (DEBUG) console.log("reconnect, wait for data to be sent");
            reconnectOnTxDone = 1;
        } else if (reconnectState == 2) { // close com port
            if (DEBUG) console.log("reconnect, closing old port");
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
    PT_status = 0;
}

function ReconnectToOldPort(ports) {
    if (DEBUG) console.log("reconnect, search new port");
    //var foundPort;
    if (DEBUG) console.log("reconnect, oldPortPath = " + oldPortPath);
    for (var i in ports) {
        if (ports[i].path == oldPortPath) {
            if (DEBUG) console.log("reconnect, connect to new port");
            if (DEBUG) console.log("reconnect, foundPortPath = " + ports[i].path);
            chrome.serial.connect(ports[i].path, { bitrate: use_bit_rate, bufferSize: 200000, persistent: true }, onPortOpen);
            UpdateSerialSection("connect");
            return;
        }
    }
    if (DEBUG) console.log("reconnect, port not found");
    ReconnectOnSend(3);
}

function TX_done() {
    if (SerialConnection.TX_tail != SerialConnection.TX_head) TX();
    else {
        TX_busy = 0;
        if (reconnectOnTxDone == 1) {
            reconnectOnTxDone = 2;
            if (DEBUG) console.log("reconnect, data sent...");
            setTimeout(function () { ReconnectOnSend(reconnectOnTxDone); }, 500);
        }
    }
}

function checkPorts(ports, force) {
    // check if not connected and if serial port count change
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

