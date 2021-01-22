"user strict";
// Begin const and local var

// Begin functions

function PrepareHex2Pages(hexObj) {
    //prepare block that need to be flashed
    var page_counter = 0;
    var page_Byte_counter = 0;

    // resize to full pages
    var fitting_pages = Math.ceil(hexObj.length / 128);
    var left_Bytes = (fitting_pages * 128) - (hexObj.length);
    if (DEBUG) console.log('loaded: ' + hexObj.length + ' bytes');
    for (var i = 0; i < left_Bytes; i++) {
        hexObj.push(255);
    }
    FW_update.pagesCount = hexObj.length / 128;
    if (DEBUG) console.log('page conform: ' + hexObj.length + 'bytes, ' + hexObj.length / 128 + ' pages');
    TopPage = hexObj.length / 128;

    for (var i = 0; i < hexObj.length; i++) {
        if (page_Byte_counter == 0) FW_update.preparedPages[page_counter] = [];
        FW_update.preparedPages[page_counter].push(hexObj[i]);
        page_Byte_counter++;
        if (page_Byte_counter == 128) {
            page_Byte_counter = 0;
            page_counter++;
        }
    }
}

function parseHexFile(hexData) {
    var tempHexString = hexData.replace(/(?:\r\n|\r|\n)/g, '').split(':');
    var hexStartFound = 0;
    var lineArr = [];
    FW_update.hexString = [];
    FW_update.binaryString = [];
    FW_update.preparedPages = [];
    FW_update.pagesCount = 0;
    FW_update.hexSize = 0;
    for (var i = 0; i < tempHexString.length; i++) {
        lineArr = tempHexString[i].split("");
        var hex_Line_Address = parseInt('0x' + lineArr[2] + '' + lineArr[3] + '' + lineArr[4] + '' + lineArr[5]);
        if ((i == 2 && hexStartFound == 0) || (i == 1 && parseInt(lineArr[1]) != 2)) {
            hexStartFound = 1;
            addressCounter = parseInt(hex_Line_Address);
            FW_update.startAddr = parseInt(hex_Line_Address)
            if (DEBUG) console.log('hex start at: ' + (addressCounter));
        }
        if (i == 3) {
            if (((parseInt(lineArr[2]) == 1 && parseInt(lineArr[3])) == 0) || ((parseInt(lineArr[2]) == 1 && parseInt(lineArr[3])) == 8) || ((parseInt(lineArr[2]) == 3 && parseInt(lineArr[3])) == 8) || parseInt(lineArr[2]) == 4) {
                if (DEBUG) console.log('loaded hex file is a valid FW file');
            } else {
                if (DEBUG) console.log('loaded hex file is a invalid FW file');
                $(".ui-notification-container").notification("create", {
                    title: "Invalid Firmware",
                    content: "This is an invalid firmware file.",
                });
                FW_update.preparedPages = [];
                return;
            }
        }
        if (parseInt('0x' + lineArr[6] + lineArr[7]) == 0) {
            if (hex_Line_Address < addressCounter) hex_Line_Address = addressCounter;
            while (addressCounter < hex_Line_Address) {
                FW_update.binaryString.push(255);
                addressCounter++;
            }
            for (var y = 8; y < lineArr.length - 2; y += 2) {
                addressCounter++;
                FW_update.binaryString.push(parseInt('0x' + lineArr[y] + lineArr[y + 1]));
            }
        }
    }
    FW_update.hexSize = FW_update.binaryString.length;
}