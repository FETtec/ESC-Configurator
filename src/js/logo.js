"user strict";
// Begin const and local var

// logo consts
const pilotLogoWidth = 130;
const pilotLogoHeight = 66;

// Begin functions

function showLogoEditor() {
    $("#logoeditor").css("visibility", "visible");

    var LogoCanvas = $('<canvas/>', {
        'class': 'logocanvas',
        id: 'canvasHex'
    }).prop({
        width: pilotLogoWidth,
        height: pilotLogoHeight
    });
    $('#logoeditor').append(LogoCanvas);

    initializeCanvas("canvasHex")
    drawLogo("canvasHex", FW_update.WhiteLogoArr, FW_update.BlackLogoArr)

    $("#logoeditor").append($('<div/>').text("The Logo needs to be 130 x 66px and the only recognized colors are black and white."))

    // BEGIN load file
    $("#logoeditor").append(
        $('<div/>').attr({ id: 'localPilotImage', class: 'fileContainer' }).button().click(function () {
            if (DEBUG) console.log("LOCAL Logo File Selected");
            $("#pilot_logo_upload").val(null);
        }
        ));
    $("#localPilotImage").append().html("<span>Load Image</span>");

    toolbar = document.getElementById("localPilotImage");
    document.getElementById('toolbar').style.display = "block";
    var fileUploadInput = document.createElement('input');
    fileUploadInput.type = "file";
    fileUploadInput.id = "pilot_logo_upload";
    fileUploadInput.addEventListener('change', function (evt) {
        var fileLoaded = this.value.split('\\');
        var loadedFileName = fileLoaded[fileLoaded.length - 1].replace(/^.*[\\\/]/, '');
        if (DEBUG) console.log('reading Image : ' + loadedFileName);
        var file = evt.target.files[0]
        var reader = new FileReader();
        reader.onloadend = function () {
            img_data = reader.result;
            loadCanvas("canvasHex");
        };
        reader.readAsDataURL(file);

    }, false);
    toolbar.appendChild(fileUploadInput);
    // end load file

    $("#logoeditor").append(
        $('<button/>')
            .attr({ id: 'updatePilotLogo' })
            .button()
            .click(function () {

                convertImgCanvas("canvasHex");
                Array.prototype.splice.apply(
                    FW_update.binaryString,
                    [FW_update.BlackLogoPos, FW_update.BlackLogoArr.length].concat(FW_update.BlackLogoArr)
                );
                Array.prototype.splice.apply(
                    FW_update.binaryString,
                    [FW_update.WhiteLogoPos, FW_update.WhiteLogoArr.length].concat(FW_update.WhiteLogoArr)
                );

                $("#logoeditor").css("visibility", "hidden");
                $("#logoeditor").empty()
            }))
        ;
    $("#updatePilotLogo").append().html("Update");

    $("#logoeditor").append(
        $('<button/>')
            .attr({ id: 'cancelPilotLogo' })
            .button()
            .click(function () {
                $("#logoeditor").css("visibility", "hidden");
                $("#logoeditor").empty()
            }))
        ;
    $("#cancelPilotLogo").append().html("Cancel");
}


function searchPilotLogo(ByteArr) {
    FW_update.WhiteLogoPos = null;
    FW_update.BlackLogoPos = null;

    for (i = 0; i < ByteArr.length; i++) {
        // Logo Black
        if (getA2sign(ByteArr[i]) == "P") {
            if (
                getA2sign(ByteArr[i + 1]) == "I" &&
                getA2sign(ByteArr[i + 2]) == "L" &&
                getA2sign(ByteArr[i + 3]) == "O" &&
                getA2sign(ByteArr[i + 4]) == "T" &&
                getA2sign(ByteArr[i + 5]) == "_" &&
                getA2sign(ByteArr[i + 6]) == "L" &&
                getA2sign(ByteArr[i + 7]) == "O" &&
                getA2sign(ByteArr[i + 8]) == "G" &&
                getA2sign(ByteArr[i + 9]) == "O" &&
                getA2sign(ByteArr[i + 10]) == "_" &&
                getA2sign(ByteArr[i + 11]) == "B" &&
                getA2sign(ByteArr[i + 12]) == "L" &&
                getA2sign(ByteArr[i + 13]) == "A" &&
                getA2sign(ByteArr[i + 14]) == "C" &&
                getA2sign(ByteArr[i + 15]) == "K" &&
                getA2sign(ByteArr[i + 16]) == ">"
            ) {
                FW_update.BlackLogoPos = i;
                for (i2 = 0; i2 < (Math.ceil(pilotLogoWidth / 8) * pilotLogoHeight); i2++) {
                    FW_update.BlackLogoArr.push(ByteArr[i + i2 + 17]);
                }
                if (DEBUG) console.log("Black Pilot Logo found at position " + FW_update.BlackLogoPos);
            }
        }
        // Logo White
        if (getA2sign(ByteArr[i]) == "P") {
            if (
                getA2sign(ByteArr[i + 1]) == "I" &&
                getA2sign(ByteArr[i + 2]) == "L" &&
                getA2sign(ByteArr[i + 3]) == "O" &&
                getA2sign(ByteArr[i + 4]) == "T" &&
                getA2sign(ByteArr[i + 5]) == "_" &&
                getA2sign(ByteArr[i + 6]) == "L" &&
                getA2sign(ByteArr[i + 7]) == "O" &&
                getA2sign(ByteArr[i + 8]) == "G" &&
                getA2sign(ByteArr[i + 9]) == "O" &&
                getA2sign(ByteArr[i + 10]) == "_" &&
                getA2sign(ByteArr[i + 11]) == "W" &&
                getA2sign(ByteArr[i + 12]) == "H" &&
                getA2sign(ByteArr[i + 13]) == "I" &&
                getA2sign(ByteArr[i + 14]) == "T" &&
                getA2sign(ByteArr[i + 15]) == "E" &&
                getA2sign(ByteArr[i + 16]) == ">"
            ) {
                FW_update.WhiteLogoPos = i;
                for (i2 = 0; i2 < (Math.ceil(pilotLogoWidth / 8) * pilotLogoHeight); i2++) {
                    FW_update.WhiteLogoArr.push(ByteArr[i + i2 + 17]);
                }
                if (DEBUG) console.log("White Pilot Logo found at position " + FW_update.WhiteLogoPos);
            }
        }
    }
    if ((FW_update.BlackLogoPos != null) && (FW_update.WhiteLogoPos != null)) {
        return 1
    } else {
        return 0
    }
}


function initializeCanvas(obj) {
    var canvas = document.getElementById(obj);
    canvas.width = pilotLogoWidth;
    canvas.height = pilotLogoHeight;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function loadCanvas(obj) {
    var canvas = document.getElementById(obj);
    canvas.width = pilotLogoWidth;
    canvas.height = pilotLogoHeight;
    var ctx = canvas.getContext("2d");
    var image = new Image();
    image.onload = function () {
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0); //TODO
    };
    image.src = img_data;
}

function convertImgCanvas(obj) {
    // clear some variables
    FW_update.BlackLogoArr.length = 0;
    FW_update.WhiteLogoArr.length = 0;

    // init canvas
    var canvas = document.getElementById(obj);
    var ctx = canvas.getContext("2d");

    for (y = 0; y < canvas.height; y++) {
        var x_count = 0;
        var tmp_value_blk = 0;
        var tmp_value_white = 0;
        for (x = 0; x < canvas.width; x++) {
            // read Pixel
            var p = ctx.getImageData(x, y, 1, 1).data;
            if (p[0] == 0 && p[1] == 0 && p[2] == 0) {
                // is black
                tmp_value_blk += 1 << x_count;
            } else if (p[0] == 255 && p[1] == 255 && p[2] == 255) {
                // is white
                tmp_value_white += 1 << x_count;
            } else {
                // all other colors
            }

            if (x_count >= 7 || x == canvas.width - 1) {
                x_count = 0;
                FW_update.BlackLogoArr.push(tmp_value_blk);
                FW_update.WhiteLogoArr.push(tmp_value_white);
                tmp_value_blk = 0;
                tmp_value_white = 0;
            } else {
                x_count++;
            }
        }
    }
    if (DEBUG) console.log("Canvas Whitelogo size: " + FW_update.WhiteLogoArr.length);
    if (DEBUG) console.log("Canvas Blacklogo size: " + FW_update.BlackLogoArr.length);
}


function drawLogo(canvasId, whitelogo, blacklogo) {
    var canvas = document.getElementById(canvasId);
    canvas.width = pilotLogoWidth;
    canvas.height = pilotLogoHeight;

    var ctx = canvas.getContext("2d");
    // set background to green
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // reset pos
    var pos_x = 0;
    var pos_y = 0;
    ctx.fillStyle = "#ffffff"; // white
    for (var i = 0; i < whitelogo.length; i++) {
        var tmpbyte = byte2Bit(whitelogo[i]);
        for (var i2 = 7; i2 > -1; i2--) {
            if (tmpbyte[i2] == 1) {
                ctx.fillRect(pos_x, pos_y, 1, 1);
            }
            pos_x++;
        }
        if (pos_x > pilotLogoWidth) {
            pos_x = 0;
            pos_y++;
        }
    }

    var pos_x = 0;
    var pos_y = 0;
    ctx.fillStyle = "#000000"; // black
    for (var i = 0; i < blacklogo.length; i++) {
        var tmpbyte = byte2Bit(blacklogo[i]);
        for (var i2 = 7; i2 > -1; i2--) {
            if (tmpbyte[i2] == 1) {
                ctx.fillRect(pos_x, pos_y, 1, 1);
            }
            pos_x++;
        }
        if (pos_x > pilotLogoWidth) {
            pos_x = 0;
            pos_y++;
        }
    }

    if (DEBUG) console.log("HEX Whitelogo size: " + whitelogo.length);
    if (DEBUG) console.log("HEX Blacklogo size: " + blacklogo.length);
}