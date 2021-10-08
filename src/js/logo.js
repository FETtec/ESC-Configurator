"user strict";
// Begin const and local var
var logeditorActive = 0;
var img_x = 0;
var img_y = 0;
var inverted = 0;

// logo consts
const pilotLogoWidth = 130;
const pilotLogoHeight = 66;

const startLogoWidth = 400;
const startLogoHeight = 280;

// Begin functions

function showLogoEditor(width, height, WhiteLogoArr, BlackLogoArr, WhiteLogoPos, BlackLogoPos) {
    if (logeditorActive == 1) return;

    logeditorActive = 1;
    img_x = 0;
    img_y = 0;
    $("#logoeditor").css("visibility", "visible");

    var LogoCanvas = $('<canvas/>', {
        'class': 'logocanvas',
        id: 'canvasLogo'
    }).prop({
        width: width,
        height: height
    });
    $('#logoeditor').append(LogoCanvas);

    initializeCanvas("canvasLogo", width, height)
    drawLogo("canvasLogo", WhiteLogoArr, BlackLogoArr, width, height)
    canvas2imgdata("canvasLogo", width, height);

    //    convertImgCanvas("canvasLogo", WhiteLogoArr, BlackLogoArr);

    $("#logoeditor").append($('<div/>').text("The Logo needs to be " + width + " x " + height + "px and the only recognized colors are black and white."))

    // BEGIN load file
    $("#logoeditor").append(
        $('<div/>').attr({ id: 'localImage', class: 'fileContainer' }).button().click(function () {
            if (DEBUG) console.log("LOCAL Logo File Selected");
            $("#logo_upload").val(null);
        }
        ));
    $("#localImage").append().html("<span>Load Image</span>");

    toolbar = document.getElementById("localImage");
    document.getElementById('toolbar').style.display = "block";
    var fileUploadInput = document.createElement('input');
    fileUploadInput.type = "file";
    fileUploadInput.id = "logo_upload";
    fileUploadInput.addEventListener('change', function (evt) {
        var fileLoaded = this.value.split('\\');
        var loadedFileName = fileLoaded[fileLoaded.length - 1].replace(/^.*[\\\/]/, '');
        if (DEBUG) console.log('reading Image : ' + loadedFileName);
        var file = evt.target.files[0]
        var reader = new FileReader();
        reader.onloadend = function () {
            img_data = reader.result;
            loadCanvas("canvasLogo", width, height, inverted);
        };
        reader.readAsDataURL(file);

    }, false);
    toolbar.appendChild(fileUploadInput);
    // end load file

    if (DEBUG) {
        $("#logoeditor").append(
            $('<div/>').attr({ id: 'imgMovr' }));

        $("#imgMovr").append(
            $('<button/>')
                .attr({ id: 'imgUp' })
                .button()
                .click(function () {
                    img_y--;
                    loadCanvas("canvasLogo", width, height, inverted);
                }))
            ;
        $("#imgUp").append().html("Up");

        $("#imgMovr").append(
            $('<button/>')
                .attr({ id: 'imgDn' })
                .button()
                .click(function () {
                    img_y++;
                    loadCanvas("canvasLogo", width, height, inverted);
                }));
        $("#imgDn").append().html("Down");

        $("#imgMovr").append(
            $('<button/>')
                .attr({ id: 'imgLf' })
                .button()
                .click(function () {
                    img_x--;
                    loadCanvas("canvasLogo", width, height, inverted);

                }));
        $("#imgLf").append().html("&#8249;"); // left

        $("#imgMovr").append(
            $('<button/>')
                .attr({ id: 'imgRt' })
                .button()
                .click(function () {
                    img_x++;
                    loadCanvas("canvasLogo", width, height, inverted);
                }));
        $("#imgRt").append().html("&#8250;"); // right
        /*
                $("#imgMovr").append(
                    $('<button/>')
                        .attr({ id: 'imgCntr' })
                        .button()
                        .click(function () {
                            img_x = 0;
                            img_y = 0;
                            loadCanvas("canvasLogo", width, height, inverted);
        
                        }));
                $("#imgCntr").append().html("Reset Pos");
        
                $("#imgMovr").append(
                    $('<button/>')
                        .attr({ id: 'imgInvert' })
                        .button()
                        .click(function () {
                            if (inverted == 0)
                                inverted = 1;
                            else
                                inverted = 0;
                            loadCanvas("canvasLogo", width, height, inverted);
                        }))
                    ;
                $("#imgInvert").append().html("Invert");
        */
    }


    $("#logoeditor").append(
        $('<button/>')
            .attr({ id: 'updateLogo' })
            .button()
            .click(function () {

                convertImgCanvas("canvasLogo", WhiteLogoArr, BlackLogoArr);
                Array.prototype.splice.apply(
                    FW_update.binaryString,
                    [BlackLogoPos, BlackLogoArr.length].concat(BlackLogoArr)
                );
                Array.prototype.splice.apply(
                    FW_update.binaryString,
                    [WhiteLogoPos, WhiteLogoArr.length].concat(WhiteLogoArr)
                );


                $("#logoeditor").css("visibility", "hidden");
                $("#logoeditor").empty();
                logeditorActive = 0;
            }))
        ;
    $("#updateLogo").append().html("Update");

    $("#logoeditor").append(
        $('<button/>')
            .attr({ id: 'cancelLogo' })
            .button()
            .click(function () {
                $("#logoeditor").css("visibility", "hidden");
                $("#logoeditor").empty();
                logeditorActive = 0;
            }))
        ;
    $("#cancelLogo").append().html("Cancel");
}


function searchPilotLogo(ByteArr) {
    FW_update.WhitePilotLogoPos = null;
    FW_update.BlackPilotLogoPos = null;

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
                FW_update.BlackPilotLogoPos = i + 17;
                for (i2 = 0; i2 < (Math.ceil(pilotLogoWidth / 8) * pilotLogoHeight); i2++) {
                    FW_update.BlackPilotLogoArr.push(ByteArr[i + i2 + 17]);
                }
                if (DEBUG) console.log("Black Pilot Logo found at position " + FW_update.BlackPilotLogoPos);
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
                FW_update.WhitePilotLogoPos = i + 17;
                for (i2 = 0; i2 < (Math.ceil(pilotLogoWidth / 8) * pilotLogoHeight); i2++) {
                    FW_update.WhitePilotLogoArr.push(ByteArr[i + i2 + 17]);
                }
                if (DEBUG) console.log("White Pilot Logo found at position " + FW_update.WhitePilotLogoPos);
            }
        }
    }
    if ((FW_update.BlackPilotLogoPos != null) && (FW_update.WhitePilotLogoPos != null)) {
        return 1
    } else {
        return 0
    }
}

function searchStartLogo(ByteArr) {
    FW_update.WhiteStartLogoPos = null;
    FW_update.BlackStartLogoPos = null;

    for (i = 0; i < ByteArr.length; i++) {
        // Logo Black - START_LOGO_BLACK>
        if (getA2sign(ByteArr[i]) == "S") {
            if (
                getA2sign(ByteArr[i + 1]) == "T" &&
                getA2sign(ByteArr[i + 2]) == "A" &&
                getA2sign(ByteArr[i + 3]) == "R" &&
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
                getA2sign(ByteArr[i + 24]) == ">"
            ) {
                FW_update.BlackStartLogoPos = i + 25;
                for (i2 = 0; i2 < (Math.ceil(startLogoWidth / 8) * startLogoHeight); i2++) {
                    FW_update.BlackStartLogoArr.push(ByteArr[i + i2 + 25]);
                }
                if (DEBUG) console.log("Black Start Logo found at position " + FW_update.BlackStartLogoPos);
            }
        }
        // Logo White - START_LOGO_WHITE>
        if (getA2sign(ByteArr[i]) == "S") {
            if (
                getA2sign(ByteArr[i + 1]) == "T" &&
                getA2sign(ByteArr[i + 2]) == "A" &&
                getA2sign(ByteArr[i + 3]) == "R" &&
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
                getA2sign(ByteArr[i + 24]) == ">"
            ) {
                FW_update.WhiteStartLogoPos = i + 25;
                for (i2 = 0; i2 < (Math.ceil(startLogoWidth / 8) * startLogoHeight); i2++) {
                    FW_update.WhiteStartLogoArr.push(ByteArr[i + i2 + 25]);
                }
                if (DEBUG) console.log("White Start Logo found at position " + FW_update.WhiteStartLogoPos);
            }
        }
    }
    if ((FW_update.BlackStartLogoPos != null) && (FW_update.WhiteStartLogoPos != null)) {
        return 1
    } else {
        return 0
    }
}



function initializeCanvas(obj, width, height) {
    var canvas = document.getElementById(obj);
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function canvas2imgdata(obj, width, height) {
    var canvas = document.getElementById(obj);
    var ctx = canvas.getContext("2d");
    var img_data = ctx.getImageData(0, 0, width, height);
}

function loadCanvas(obj, width, height, invert) {
    var canvas = document.getElementById(obj);
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    if (invert == 1)
        ctx.globalCompositeOperation = "difference";

    var image = new Image();
    image.onload = function () {
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, img_x, img_y);
    };
    image.src = img_data;
}

function convertImgCanvas(obj, WhiteArr, BlackArr) {
    // clear some variables
    BlackArr.length = 0;
    WhiteArr.length = 0;

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
                BlackArr.push(tmp_value_blk);
                WhiteArr.push(tmp_value_white);
                tmp_value_blk = 0;
                tmp_value_white = 0;
            } else {
                x_count++;
            }
        }
    }
    if (DEBUG) console.log("Canvas Whitelogo size: " + WhiteArr.length);
    if (DEBUG) console.log("Canvas Blacklogo size: " + BlackArr.length);
}


function drawLogo(canvasId, whitelogo, blacklogo, width, height) {
    var canvas = document.getElementById(canvasId);
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");
    // set background to green
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(0, 0, width, height);

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
        if (pos_x >= width) {
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
        if (pos_x >= width) {
            pos_x = 0;
            pos_y++;
        }
    }

    if (DEBUG) console.log("HEX Whitelogo size: " + whitelogo.length);
    if (DEBUG) console.log("HEX Blacklogo size: " + blacklogo.length);
}