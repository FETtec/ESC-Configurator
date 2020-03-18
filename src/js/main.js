"user strict";

const DEBUG = 0;

const MAX_TRY = 10;

var toolbar = 0;
var OneWire = 0;

const canvas_width = 600;
const canvas_height = 142;


//communication defines

const ALL_ID = 0x1F;


const OW_OK = 0;
const OW_BL_PAGE_CORRECT = 1; // BL only
const OW_NOT_OK = 2;
const OW_BL_START_FW = 3; // BL only
const OW_BL_PAGES_TO_FLASH = 4; // BL only
const OW_REQ_TYPE = 5;
const OW_REQ_SN = 6;
const OW_REQ_SW_VER = 7;
//

//OW_ESC
const OW_RESET_TO_BL = 10;
const OW_THROTTLE = 11;
const OW_REQ_TLM = 12;
const OW_BEEP = 13;
const OW_SET_FAST_COM_LENGTH = 26;


// all OW_GET_XXX are always readable.
// all OW_SET_XXX will only work ig the same OW_GET_XXX was requested again, just before SET. to make sure there will be no faulty change
// SET is always GET+1
const OW_GET_ROTATION_DIRECTION = 28;
const OW_SET_ROTATION_DIRECTION = 29;

const OW_GET_USE_SIN_START = 30;
const OW_SET_USE_SIN_START = 31;

const OW_GET_3D_MODE = 32;
const OW_SET_3D_MODE = 33;

const OW_GET_ID = 34;
const OW_SET_ID = 35;

const OW_GET_LINEAR_THRUST = 36;
const OW_SET_LINEAR_THRUST = 37;

const OW_GET_EEVER = 38;

const OW_GET_PWM_MIN = 39;
const OW_SET_PWM_MIN = 40;

const OW_GET_PWM_MAX = 41;
const OW_SET_PWM_MAX = 42;

const OW_GET_ESC_BEEP = 43;
const OW_SET_ESC_BEEP = 44;

const OW_GET_CURRENT_CALIB = 45;
const OW_SET_CURRENT_CALIB = 46;

const OW_GET_LOW_RAMP = 47;
const OW_SET_LOW_RAMP = 48;

const OW_GET_HIGH_RAMP = 49;
const OW_SET_HIGH_RAMP = 50;

const OW_SET_LED_TMP_COLOR = 51;

const OW_GET_LED_COLOR = 52;
const OW_SET_LED_COLOR = 53;

const OW_GET_SOFT_BRAKE = 54;
const OW_SET_SOFT_BRAKE = 55;

const OW_GET_ACTIVATION = 56;
const OW_SET_ACTIVATION = 57;
//

const ESC_types = [
    { id: 0, name: "none", filename: '' },
    { id: 1, name: "FETtec ESC 35A", filename: 'FETTEC_35A_ESC_G0_' },
    { id: 2, name: "FETtec ESC 50A", filename: 'FETTEC_50A_ESC_G0_' },
    { id: 3, name: "FETtec ESC 7A", filename: 'FETTEC_7A_ESC_G0_' },
    { id: 4, name: "G4_ESC", filename: '' },
    { id: 5, name: "ESCS32K", filename: '' },
    { id: 6, name: "FETtec ESC 45A", filename: 'FETTEC_45A_ESC_G0_' },
    { id: 7, name: "FETtec ESC 45A HV", filename: 'FETTEC_45A_HV_ESC_G0_' },
    { id: 8, name: "FETtec ESC 15A", filename: 'FETTEC_15A_ESC_G0_' },
    { id: 64, name: "ESC 15A", filename: 'ESC_DEF_GD_15A_ESC_G0_' },
    { id: 65, name: "ESC 15A", filename: 'ESC_ADV_GD_15A_ESC_G0_' },
    { id: 66, name: "ESC 15A", filename: '' },
    { id: 67, name: "ESC 15A", filename: '' },
    { id: 68, name: "ESC 25A", filename: 'ESC_DEF_GD_25A_ESC_G0_' },
    { id: 69, name: "ESC 25A", filename: 'ESC_ADV_GD_25A_ESC_G0_' },
    { id: 70, name: "ESC 25A", filename: '' },
    { id: 71, name: "ESC 25A", filename: '' },
    { id: 72, name: "ESC 35A", filename: 'ESC_DEF_GD_35A_ESC_G0_' },
    { id: 73, name: "ESC 35A", filename: 'ESC_ADV_GD_35A_ESC_G0_' },
    { id: 74, name: "ESC 35A", filename: 'ESC_DEF_GD_35A_ESC_G4_' },
    { id: 75, name: "ESC 35A", filename: 'ESC_ADV_GD_35A_ESC_G4_' },
    { id: 76, name: "ESC 35A", filename: '' },
    { id: 77, name: "ESC 35A", filename: '' },
    { id: 78, name: "ESC 45A", filename: 'ESC_DEF_GD_45A_ESC_G0_' },
    { id: 79, name: "ESC 45A", filename: 'ESC_DEF_GD_45A_ESC_G0_' },
    { id: 80, name: "ESC 45A", filename: 'ESC_DEF_GD_45A_ESC_G4_' },
    { id: 81, name: "ESC 45A", filename: 'ESC_DEF_GD_45A_ESC_G4_' },
    { id: 82, name: "ESC 45A", filename: 'ESC_DEF_GD_45A_ESC_S32K_' },
    { id: 83, name: "ESC 45A", filename: 'ESC_DEF_GD_45A_ESC_S32K_' },
    { id: 84, name: "ESC 45A", filename: '' },
    { id: 85, name: "ESC 45A", filename: '' },
    { id: 86, name: "ESC 55A", filename: 'ESC_DEF_GD_55A_ESC_G0_' },
    { id: 87, name: "ESC 55A", filename: 'ESC_DEF_GD_55A_ESC_G0_' },
    { id: 88, name: "ESC 55A", filename: 'ESC_DEF_GD_55A_ESC_G4_' },
    { id: 89, name: "ESC 55A", filename: 'ESC_DEF_GD_55A_ESC_G4_' },
    { id: 90, name: "ESC 55A", filename: 'ESC_DEF_GD_55A_ESC_S32K_' },
    { id: 91, name: "ESC 55A", filename: 'ESC_DEF_GD_55A_ESC_S32K_' },
    { id: 92, name: "ESC 55A", filename: '' },
    { id: 93, name: "ESC 55A", filename: '' },
    { id: 94, name: "ESC 65A", filename: 'ESC_DEF_GD_65A_ESC_G0_' },
    { id: 95, name: "ESC 65A", filename: 'ESC_DEF_GD_65A_ESC_G0_' },
    { id: 96, name: "ESC 65A", filename: 'ESC_DEF_GD_65A_ESC_G4_' },
    { id: 96, name: "ESC 65A", filename: 'ESC_DEF_GD_65A_ESC_G4_' },
    { id: 98, name: "ESC 65A", filename: 'ESC_DEF_GD_65A_ESC_S32K_' },
    { id: 99, name: "ESC 65A", filename: 'ESC_DEF_GD_65A_ESC_S32K_' },
    { id: 100, name: "ESC 65A", filename: '' },
    { id: 101, name: "ESC 65A", filename: '' },
    { id: 102, name: "ESC 80A", filename: 'ESC_DEF_GD_80A_ESC_G4_' },
    { id: 103, name: "ESC 80A", filename: 'ESC_DEF_GD_80A_ESC_G4_' },
    { id: 104, name: "ESC 80A", filename: 'ESC_DEF_GD_80A_ESC_S32K_' },
    { id: 105, name: "ESC 80A", filename: 'ESC_DEF_GD_80A_ESC_S32K_' },
    { id: 106, name: "ESC 80A", filename: '' },
    { id: 107, name: "ESC 80A", filename: '' },
    { id: 102, name: "ESC 100A", filename: 'ESC_DEF_GD_100A_ESC_G4_' },
    { id: 103, name: "ESC 100A", filename: 'ESC_DEF_GD_100A_ESC_G4_' },
    { id: 104, name: "ESC 100A", filename: 'ESC_DEF_GD_100A_ESC_S32K_' },
    { id: 105, name: "ESC 100A", filename: 'ESC_DEF_GD_100A_ESC_S32K_' },
    { id: 106, name: "ESC 100A", filename: '' },
    { id: 107, name: "ESC 100A", filename: '' },
    { id: 128, name: "G4 USB Bootloader", filename: '' },
    { id: 129, name: "OSD", filename: '' }
];

// helper to prevent single arrays in all settings
var onAllESCs = [];
for (var i in ESC_types) onAllESCs.push(ESC_types[i].id);

function ESC() {
    this.id = 0;
    this.asBL = false;
    this.type = 0;
    this.SN = [];
    this.version = 0;
    this.subversion = 0;
    this.activated = 0;
    this.ESC_select_Input = 0;
    this.selected = true;
    this.loadingBar = 0;
    this.warning = false;
    this.settingsActive = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    this.commandedThrottle = 0;
    this.readyForFastCommand = false;
    this.TLMValues = [0, 0, 0, 0, 0, 0, 0, 0];
    this.TLMValueElements = [];
    this.TLMCanvasElement;
    this.TLMCanvasCTX;
    this.CompatibleFW_filename = "";
    this.ESC_settings = {
        0: { getCommand: OW_GET_EEVER, setCommand: null, name: "EEPROM version", type: "readonly", min: 0, max: 0, active: 0, changed: false, eever: 0, byteCount: 1, escTypes: onAllESCs }, // must always be 0
        40: { getCommand: OW_GET_ROTATION_DIRECTION, setCommand: OW_SET_ROTATION_DIRECTION, name: "Reverse rotation direction", feature: "standard", type: "checkbox", min: 0, max: 1, active: 0, changed: false, eever: 16, byteCount: 1, escTypes: onAllESCs },
        41: { getCommand: OW_GET_USE_SIN_START, setCommand: OW_SET_USE_SIN_START, name: "Slow start", feature: "standard", type: "checkbox", min: 0, max: 1, active: 0, changed: false, eever: 16, byteCount: 1, escTypes: onAllESCs },
        42: { getCommand: OW_GET_3D_MODE, setCommand: OW_SET_3D_MODE, name: "3D Mode", feature: "standard", type: "checkbox", min: 0, max: 1, active: 0, changed: false, eever: 1, byteCount: 1, escTypes: onAllESCs },
        43: { getCommand: OW_GET_LINEAR_THRUST, setCommand: OW_SET_LINEAR_THRUST, name: "Linear Thrust", feature: "advanced", type: "checkbox", min: 0, max: 1, active: 0, changed: false, eever: 16, byteCount: 1, escTypes: onAllESCs },
        44: { getCommand: OW_GET_PWM_MIN, setCommand: OW_SET_PWM_MIN, name: "PWM Min. Signal", type: "slider", feature: "advanced", min: 1000, max: 1400, active: 0, changed: false, eever: 17, byteCount: 2, escTypes: onAllESCs },
        45: { getCommand: OW_GET_PWM_MAX, setCommand: OW_SET_PWM_MAX, name: "PWM Max. Signal", type: "slider", feature: "advanced", min: 1600, max: 2000, active: 0, changed: false, eever: 17, byteCount: 2, escTypes: onAllESCs },
        46: { getCommand: OW_GET_ESC_BEEP, setCommand: OW_SET_ESC_BEEP, name: "ESC beeps", feature: "standard", type: "checkbox", min: 0, max: 1, active: 0, changed: false, eever: 18, byteCount: 1, escTypes: onAllESCs },
        47: { getCommand: OW_GET_CURRENT_CALIB, setCommand: OW_SET_CURRENT_CALIB, name: "Current calibration (%)", feature: "advanced", type: "value", min: 75, max: 125, active: 0, changed: false, eever: 18, byteCount: 1, escTypes: onAllESCs },
        48: { getCommand: OW_GET_LOW_RAMP, setCommand: OW_SET_LOW_RAMP, name: "Low slew rate", feature: "advanced", type: "value", min: 1, max: 1000, active: 1, changed: false, eever: 22, byteCount: 2, escTypes: onAllESCs },
        49: { getCommand: OW_GET_HIGH_RAMP, setCommand: OW_SET_HIGH_RAMP, name: "High slew rate", feature: "advanced", type: "value", min: 1, max: 1000, active: 1, changed: false, eever: 22, byteCount: 2, escTypes: onAllESCs },
        50: { getCommand: OW_GET_LED_COLOR, setCommand: OW_SET_LED_COLOR, name: "Color", feature: "standard", type: "colorpick", min: 0, max: 0xFFFFFFFF, active: 1, changed: false, eever: 22, byteCount: 4, escTypes: onAllESCs },
        51: { getCommand: OW_GET_SOFT_BRAKE, setCommand: OW_SET_SOFT_BRAKE, name: "Soft brake", feature: "advanced", type: "checkbox", min: 0, max: 1, active: 0, changed: false, eever: 23, byteCount: 1, escTypes: onAllESCs },
        56: { getCommand: OW_GET_ACTIVATION, setCommand: null, name: "Activated", feature: "advanced", type: "checkbox", min: 0, max: 1, active: 0, changed: false, eever: 25, byteCount: 1, escTypes: onAllESCs },

        99: { getCommand: OW_GET_ID, setCommand: OW_SET_ID, name: "ESC ID", feature: "advanced", type: "value", min: 1, max: 24, active: 0, changed: false, eever: 16, byteCount: 1, escTypes: onAllESCs } // must always be 99 and the last one
    };
}

const serial_options = [
    { id: 0, name: 'KISS FC Passthrough', connect_bitrate: 115200, disabled: false },
    { id: 1, name: 'Betaflight Passthrough', connect_bitrate: 115200, disabled: false },
    { id: 2, name: 'USB UART', connect_bitrate: 2000000, disabled: false },
    { id: 3, name: 'USB', connect_bitrate: 2000000, disabled: true }
];

const menu_options = [
    { id: 0, name: 'Overview', icon: "ui-icon-info", disabled: false },
    { id: 1, name: 'Settings', icon: "ui-icon-gear", disabled: false },
    { id: 2, name: 'Telemetry', icon: "ui-icon-heart", disabled: false },
];

const ESC_stats = [
    "Temp",
    "Voltage",
    "Current",
    "ERPM",
    "Consumption",
    "Debug 1",
    "Debug 2",
    "Debug 3",
    "Set throttle",
    "Reversible"
];

const TLM_Graph_Scales = [
    1.5,
    30,
    30,
    20,
    30,
    15,
    15,
    100
];

const TLM_scales = [
    1,
    1,
    1,
    100,
    1,
    1,
    1,
    1
];

var ESCs = [];

var SerialConnection = {
    connection: [],
    connectionErr: 0,
    connected: false,
    FoundPorts: [],
    Port: 0,
    pass_through: 100,
    pass_through_fails: 0,

    RXBuffer: [],
    RX_head: 0,
    RX_tail: 0,

    TXBuffer: [],
    TX_head: 0,
    TX_tail: 0
}

var FW_update = {
    hexString: [],
    binaryString: [],
    preparedPages: [],
    pagesCount: 0,
    fileUploadInput: 0,
    startUpdateInput: 0,
    FlashProcessActive: 0,
    loadedFileName: ""
}

var scanDone = 0;
var ESCsDisplayed = 0;
var FW_updater_Init_Done = 0;
var timeoutESC_IDs = [];
var LastSentData = [];
var loopInterval = 0;
var interval_Speedup_Done = 0;
var selectedMenu = 0;
var ESCsToBL = 0;
var menuEnabled = 1;
var ESC_package = [];


var KISS_PT = 0;
var BF_PT = 1;
var USB_UART = 2;
var VCP = 3;

var is_USB_only_bootloader = 0

var buttonsDisabled = 0;
var ConnectionType = KISS_PT;
var PT_status = 0;

var checkESCsStat = 0;
var checkESCid = 0;
var throwSerialBadCommunicationError = 0;

//===================================================================================== init
onload = function () {

    $(".ui-notification-container").notification({
        stack: "above"
    });

    Gen_Menu_Buttons(-1, true); // Generate Menu Button
    Gen_Types_Dropdown(serial_options); // Generate Serial Options

    // Check for serial ports and build options
    chrome.serial.getDevices(function (ports) {
        checkPorts(ports);
    });

    $("#con_button").click(function () {
        var el = $(this);
        if (el.text() === 'Connect') {
            OpenPort($("#con_port").children("option:selected").val());
        } else if (el.text() === 'Disconnect') {
            disconnect();
        } else {
            // do nothing
        }
    });

    loopInterval = setInterval(function () { Internal_Loop(); }, 50);

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
        console.error(info);
        switch (info.error) {
            case 'device_lost':
                disconnect();
                break;
        }
    });

    // Check for latest version
    var versionCheck = checkGithubRelease('https://api.github.com/repos/FETtec/ESC-Configurator/releases', chrome.runtime.getManifest().version);

    setTimeout(function () {
        //do what you need here
        if (Object.keys(versionCheck).length > 0) {
            // stuff to show outdated app
            var updateText = 'There is a new version of the GUI available.<br/><br/>';
            updateText += 'Get it <a href="' + versionCheck[0].html_url + '" target="_blank">here</a>';

            var updateHeader = "New Version available! (" + versionCheck[0].tag_name + ")";
            if (versionCheck[0].prerelease == true) updateHeader += ' <span>BETA</span>';

            $(".ui-notification-container").notification("create", {
                title: updateHeader,
                content: updateText,
            },
                {
                    /*    duration: 10000 */
                    sticky: true
                }
            );
        }
    }, 1000);

    // Debug output
    if (DEBUG) {
        $('#con_area').append('<button id="debug_button">Debug</button>');
        $('#debug_button').button().click(function () {
            // return debug to console
            console.log('ESCs[]');
            console.dir(ESCs);
            console.log('SerialConnection[]');
            console.dir(SerialConnection);
            console.log('Version: ' + chrome.runtime.getManifest().version);
            console.log('Update details');
            console.dir(versionCheck);
            return
        });
    }
}
onclose = function () {
    chrome.serial.disconnect(connection.connectionId, function () { });

}

//===================================================================================== port handling
function checkPorts(ports, force) {
    // check if not connected and if serial port count change
    if ((SerialConnection.connected == 0 && ports.length != SerialConnection.FoundPorts.length) || typeof (force) !== 'undefined') {
        SerialConnection.FoundPorts = ports;
        GenSerialDropdown(SerialConnection.FoundPorts);
    }
}

function UpdateSerialSection(status) {
    if (status === "connect") {
        $("#con_port").attr('disabled', true);
        $("#con_type").attr('disabled', true);
        $("#con_button").text("Disconnect");
    } else if (status === "disconnect") {
        $("#con_port").attr('disabled', false);
        $("#con_type").attr('disabled', false);
        $("#con_button").text("Connect");
    }

    $('#con_type').selectmenu("refresh");
    $('#con_port').selectmenu("refresh");
}

function GenSerialDropdown(ports) {
    $('#con_port').empty()
    for (var i in ports) {
        if (ports[i].path.toLowerCase().indexOf("/dev/cu.") === -1) // ignore cu. interfaces
            $('#con_port').append($("<option/>", {
                value: ports[i].path,
                text: ports[i].path
            }));
    }
    // selecting last entry
    $('#con_port').val($('#con_port option:last-child').val());

    $("#con_port").selectmenu();
    $('#con_port').selectmenu("refresh");

}

function Gen_Types_Dropdown(array) {
    $('#con_type').empty()
    for (var i in array) {
        $('#con_type').append($("<option/>", {
            value: array[i].id,
            text: array[i].name,
            disabled: array[i].disabled
        }));
    }
    $("#con_type").selectmenu();
    $('#con_type').selectmenu("refresh");
}

function Gen_Menu_Buttons(active_id, is_disabled) {

    $("#menu").empty();
    for (var i in menu_options) {
        var button_class = "";
        if (menu_options[i].id === active_id) {
            button_class = "ui-state-active";
        }
        var disabled_val = false;
        if (is_disabled == true) {
            disabled_val = true;
        } else {
            disabled_val = menu_options[i].disabled;
        }
        $('#menu')
            .append($('<button/>')
                .attr('id', "MB_" + menu_options[i].id)
                .attr('class', button_class)
                .button({
                    label: menu_options[i].name,
                    icon: menu_options[i].icon,
                    disabled: disabled_val
                })
                .click(function () {
                    ChangeDisplay(parseInt(this.id.replace(/MB_/, '')));
                })
            )
    }

    if (is_disabled && SerialConnection.connected == true) {
        $("#con_button").attr('disabled', true);
        $("#con_button").addClass("ui-state-disabled");

    } else {
        $("#con_button").attr('disabled', false);
        $("#con_button").removeClass("ui-state-disabled");
    }
}

var use_bit_rate = 2000000;

function OpenPort(port) {
    UpdateSerialSection("connect");
    ConnectionType = parseInt(document.getElementById("con_type").value);

    SerialConnection.Port = port;

    use_bit_rate = 2000000;
    if (SerialConnection.pass_through != SerialConnection.Port) {
        switch (ConnectionType) {
            case KISS_PT:
                use_bit_rate = 115200;
                PT_status = 1;
                OneWire = 0;
                break;
            case BF_PT:
                use_bit_rate = 115200;
                PT_status = 1;
                OneWire = 1;
                break
            case USB_UART:
                use_bit_rate = 2000000;
                PT_status = 0;
                OneWire = 1;
                break;
            case VCP:
                use_bit_rate = 2000000;
                PT_status = 0;
                OneWire = 0;
                break;
        }
    } else {
        switch (ConnectionType) {
            case KISS_PT:
                use_bit_rate = 921600;
                break;
            case BF_PT:
                use_bit_rate = 115200;
                break
            case USB_UART:
                use_bit_rate = 2000000;
                break;
            case VCP:
                use_bit_rate = 2000000;
                break;
        }
    }
    chrome.serial.connect(port, { bitrate: use_bit_rate, bufferSize: 200000, persistent: true }, onPortOpen);
}

var reconnectOnTxDone = 0;

function onPortOpen(cInfo) {
    if (typeof cInfo !== 'undefined') {
        SerialConnection.connection = cInfo;
        SerialConnection.connected = 1;
        if (ConnectionType == BF_PT) {
            sendBytes([0x23]);
            waitLoops = 10;
            if (DEBUG) console.log("Entered BF CLI");
        }
        if (reconnectOnTxDone == 0) $("#progressbar").show();
        else reconnectOnTxDone = 0;
    } else {
        if (++SerialConnection.connectionErr >= 10) {
            $("#dialog").text("Serial connection error. Please reconnect the USB port and try again.");
            $("#dialog").dialog({
                modal: true,
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                        disconnect();
                    }
                }
            });
            disconnect();
            SerialConnection.connectionErr = 0;
        } else {
            if (DEBUG) console.log("Serial Connection error -> retry");
            chrome.serial.connect(SerialConnection.Port, { bitrate: use_bit_rate, bufferSize: 200000 }, onPortOpen);
        }
    }
}

var NewBaud = 0;

function changeBaud(changeBaud) {
    NewBaud = changeBaud;
    chrome.serial.update(SerialConnection.connection.connectionId, { bitrate: NewBaud }, Reconnect);
}

function Reconnect() {
    PT_status = 0;
    SerialConnection.pass_through = SerialConnection.Port;
    if (DEBUG) console.log("changed Baud to: " + NewBaud);
}


function disconnect() {
    if (typeof SerialConnection.connection.connectionId !== 'undefined')
        chrome.serial.disconnect(SerialConnection.connection.connectionId, function () { });

    if (SerialConnection.connectionErr < 10)
        ChangeDisplay(99);

    clearInterval(loopInterval);
    interval_Speedup_Done = 0;

    scanDone = 0;
    timeoutESC_IDs = [];
    ESCsDisplayed = 0;
    FW_updater_Init_Done = 0;
    $('#overview').empty();
    $('#toolbar').empty();
    ESCs = [];

    FW_update.hexString = [];
    FW_update.binaryString = [];
    FW_update.preparedPages = [];
    FW_update.pagesCount = 0;

    // recheck for port changes
    chrome.serial.getDevices(function (ports) {
        checkPorts(ports, true);
    });

    interval_Speedup_Done = 0;
    clearInterval(loopInterval);
    loopInterval = setInterval(function () { Internal_Loop(); }, 50);
    selectedMenu = 0;
    SerialConnection.pass_through = 0;
    SerialConnection.pass_through_fails = 0;
    SerialConnection.connected = false;
    UpdateSerialSection("disconnect");

    // cleanup
    $("#progressbar").hide();
    $('#overview').empty();
    $('#toolbar').empty();
    Gen_Menu_Buttons(-1, true);

}

//===================================================================================== data transfer
var ignoreOwnBytesIndex = 0;
var TX_busy = 0;

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

var oldPortPath;
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
}

function ReconnectToOldPort(ports) {
    if (DEBUG) console.log("reconnect, search new port");
    var foundPort;
    if (DEBUG) console.log("reconnect, oldPortPath = " + oldPortPath);
    for (var i in ports) {
        if (ports[i].path == oldPortPath) {
            if (DEBUG) console.log("reconnect, connect to new port");
            if (DEBUG) console.log("reconnect, foundPortPath = " + ports[i].path);
            chrome.serial.connect(ports[i].path, { bitrate: use_bit_rate, bufferSize: 200000, persistent: true }, onPortOpen);
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

function sendBytes(bytes, do_not_Ignore_Last_Byte = 0) {
    LastSentData = [];
    if (OneWire) ignoreOwnBytesIndex = bytes.length - do_not_Ignore_Last_Byte;
    for (var i = 0; i < bytes.length; i++) {
        LastSentData[i] = bytes[i];
        SerialConnection.TXBuffer[SerialConnection.TX_head++] = bytes[i];
    }
    if (!TX_busy) TX();
}

var str2ab = function (arr) {
    var buf = new ArrayBuffer(arr.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0; i < arr.length; i++) {
        bufView[i] = arr[i];
    }
    return buf;
};


//===================================================================================== a slow loop to check com ports and stuff

var sentTestPackage = 0;
var bytesCount = 1;
var waitLoops = 0;
var noLoop = 0;
var communicationErrorWarningDone = 0;
var do_not_Update_Progress_Bar = 0;
var connection_attempts = 0;

function Internal_Loop() {
    if (noLoop) return;
    if (waitLoops > 0) {
        waitLoops--;
        return;
    }

    if (throwSerialBadCommunicationError && communicationErrorWarningDone == 0) {
        communicationErrorWarningDone = 1;
        $("#dialog").text("Many serial communication errors occurred! Proper functionality cannot be granted.");
        $("#dialog").dialog({
            modal: true,
            buttons: {
                Ok: function () {
                    $(this).dialog("close");
                    throwSerialBadCommunicationError = 0;
                }
            }
        });
    }
    if (SerialConnection.connected == 0) { // check for changed Com Ports (only if not connected)
        chrome.serial.getDevices(function (ports) {
            checkPorts(ports);
        });
    } else if (SerialConnection.connected == 1) {
        if (PT_status != 0) {
            if (PT_status == 1) {
                switch (ConnectionType) {
                    case KISS_PT:
                        var getPT = kissProtocol_preparePassthrough();
                        sendBytes(getPT);
                        if (DEBUG) console.log(getPT);
                        if (DEBUG) console.log("Requested KISS passthrough");
                        break;
                    case BF_PT:
                        SerialConnection.RX_tail = SerialConnection.RX_head;
                        var getPT = bfProtocol_preparePassthrough();
                        sendBytes(getPT);
                        if (DEBUG) console.log("Requested BF passthrough");
                        waitLoops = 20;
                        break
                    case USB_UART:
                        if (DEBUG) console.log("UART connected");
                        break;
                    case VCP:
                        if (DEBUG) console.log("VCP connected");
                        break;
                }
                do_not_Update_Progress_Bar = 0;
                PT_status = 2;
            } else if (PT_status == 2 && connection_attempts < MAX_TRY) {
                connection_attempts++;
                switch (ConnectionType) {
                    case KISS_PT:
                        if (SerialAvailable() < 2) {
                            if (DEBUG) console.log("no response from KISS FC, retry");
                            PT_status = 1;
                            do_not_Update_Progress_Bar = 1;
                        } else {
                            var testByte = readBytes(2);
                            if (testByte[0] == 88 && testByte[1] == 1) {
                                changeBaud(921600);
                                if (DEBUG) console.log("passthrough active!");
                                waitLoops = 20;
                                PT_status = 3;
                            } else {
                                if (DEBUG) console.log("wrong response from KISS FC, retry");
                                PT_status = 1;
                                do_not_Update_Progress_Bar = 1;
                            }
                        }
                        break;
                    case BF_PT:
                        if (SerialAvailable()) {
                            PT_status = 4;
                            var BF_CLI_answer = "";
                            while (SerialAvailable()) {
                                BF_CLI_answer += String.fromCharCode(readByte());
                            }
                            $("#dialog").text(BF_CLI_answer);
                            $("#dialog").dialog({
                                modal: true,
                                buttons: {
                                    Continue: function () {
                                        $(this).dialog("close");
                                        changeBaud(115200);
                                        if (DEBUG) console.log("passthrough active!");
                                        waitLoops = 5;
                                        PT_status = 3;
                                    },
                                    Cancel: function () {
                                        $(this).dialog("close");
                                        PT_status = 0;
                                        disconnect();
                                    }
                                }
                            });
                        }
                        break;
                    case USB_UART:
                        //
                        break;
                }
            } else if (connection_attempts = MAX_TRY && PT_status != 4) {
                noLoop = 1;
                // Connection failed
                if (DEBUG) console.log("Connection to FC failed");
                // display dialog
                $("#dialog").text("Unable to active FC passthrough mode. Maybe the FC is already in passthrough mode, or the FC FW version don't supports it.");
                $("#dialog").dialog({
                    modal: true,
                    buttons: {
                        Try: function () {
                            $(this).dialog("close");
                            switch (ConnectionType) {
                                case KISS_PT:
                                    changeBaud(921600);
                                    if (DEBUG) console.log("passthrough active!");
                                    waitLoops = 20;
                                    PT_status = 3;
                                    break;
                                case BF_PT:
                                    changeBaud(115200);
                                    if (DEBUG) console.log("passthrough active!");
                                    waitLoops = 5;
                                    PT_status = 3;
                                    break;
                            }
                            noLoop = 0;
                        },
                        Cancel: function () {
                            $(this).dialog("close");
                            // reset variables
                            PT_status = 0;
                            sentTestPackage = 0;
                            bytesCount = 1;
                            waitLoops = 0;
                            connection_attempts = 0;
                            // disconnect + cleanup
                            disconnect();
                            noLoop = 0;
                        }
                    }
                });
                return;
            }
            if (!do_not_Update_Progress_Bar) {
                var current_progress = Math.round(100 / 4 * (PT_status + 1));
                if (current_progress > 100) current_progress = 100;
                $("#progressbar").progressbar({
                    value: current_progress
                });
                $(".progress-label").text("Setup Passthrough " + current_progress + "%");
            }
            return;
        }
        if (interval_Speedup_Done == 0) {
            interval_Speedup_Done = 1;
            clearInterval(loopInterval);
            loopInterval = setInterval(function () { Internal_Loop(); }, 4);
        }
        if (!scanDone) {
            // Disable Disconnect
            Gen_Menu_Buttons(selectedMenu, true);
            ScanForESCs();
        } else if (!ESCsDisplayed) {
            displayESCs(document.getElementById("overview"));
            ESCsDisplayed = 1;
            // Enable Disconnect
            Gen_Menu_Buttons(selectedMenu, false);
        } else if (!FW_updater_Init_Done) {
            initFWUpdater();
            change_ESCs_status(0, 1, 0);
            FW_updater_Init_Done = 1;
        }
    }
    if (SerialConnection.connected == 1) {
        if (ESCsToBL) {
            check_ESCs_In_BL();
        } else {
            if (FW_update.FlashProcessActive == 1) {
                FlashProcessLoop();
            }
            if (selectedMenu == 2) {
                ToolProcessLoop();
            }
            if (selectedMenu == 1) {
                ConfigLoop();
            }
        }
    }
}

//===================================================================================== Switch from Bootloader to Firmware and back
var SwitchESCsFW_ID = 0;
var expectedHeader = 0;
var SwitchCommand = 0;
var switchProblem = 0;
var enableButtonsAfterSwitch = 0;
var refreshVersion = 0;
var SwitchStatus = 0;

function change_ESCs_status(stat, enableButtonsIfDone = 0, refreshVersionIfDone = 0) {
    disableButtons();
    SwitchESCsFW_ID = 0;
    switchProblem = 0;
    enableButtonsAfterSwitch = enableButtonsIfDone;
    refreshVersion = refreshVersionIfDone;
    if (stat == 0) {
        expectedHeader = 0x02;
        SwitchCommand = OW_RESET_TO_BL;
        if (DEBUG) console.log("changing status to Bootloader");
    } else {
        expectedHeader = 0x03;
        SwitchCommand = OW_BL_START_FW;
        if (DEBUG) console.log("changing status to Firmware");
    }
    SwitchStatus = 0;
    ESCsToBL = 1;

}
var waitLoops = 0;

function check_ESCs_In_BL() {
    if (waitLoops > 0) {
        waitLoops--;
        return;
    }
    if (reconnectOnTxDone != 0 && ConnectionType == VCP) return;

    if (waitForResponseID == 0) {
        while ((!(SwitchESCsFW_ID in ESCs)) && SwitchESCsFW_ID < 25) SwitchESCsFW_ID++;
        if (SwitchESCsFW_ID == 25) {
            ESCsToBL = 0;
            if (refreshVersion) {
                refreshVersion = 0;
                document.getElementById("overview").innerHTML = "";
                displayESCs(document.getElementById("overview"));
            }
            if (enableButtonsAfterSwitch) {
                enableButtons();
                enableButtonsAfterSwitch = 0;
            }
            return;
        }
        if (SwitchStatus == 0) {
            send_ESC_package(SwitchESCsFW_ID, 0, [OW_OK]);
            waitForResponseID = SwitchESCsFW_ID;
            waitForResponseType = 0;
            waitForResponseLength = 7;
            if (DEBUG) console.log("check with id: " + SwitchESCsFW_ID + " ");
        } else {
            if (refreshVersion) {
                send_ESC_package(SwitchESCsFW_ID, 0, [OW_REQ_SW_VER]);
                waitForResponseID = SwitchESCsFW_ID;
                waitForResponseType = 0;
                waitForResponseLength = 8;
                if (DEBUG) console.log("check FW version with id: " + SwitchESCsFW_ID + " ");
            } else {
                SwitchStatus = 0;
                SwitchESCsFW_ID++;
            }
        }
    } else {
        var responsePackage = checkForRespPackage();
        if (responsePackage) {
            timeoutESC_IDs[SwitchESCsFW_ID] = 0;
            if (SwitchStatus == 0) {
                if (responsePackage[0] == expectedHeader) {
                    if (expectedHeader == 0x02) ESCs[SwitchESCsFW_ID].asBL = true;
                    else ESCs[SwitchESCsFW_ID].asBL = false;
                    if (DEBUG) console.log("ESC with id: " + SwitchESCsFW_ID + " is ready");
                    SwitchStatus++;
                } else {
                    if (expectedHeader != 0x02) ESCs[SwitchESCsFW_ID].asBL = false;
                    else ESCs[SwitchESCsFW_ID].asBL = true;
                    if (switchProblem == 0) {
                        if (DEBUG) console.log("switching ESC with id: " + SwitchESCsFW_ID);
                        send_ESC_package(SwitchESCsFW_ID, 0, [SwitchCommand]);
                        if (ConnectionType == VCP) {
                            if (DEBUG) console.log("starting reconnect procedure 1");
                            ReconnectOnSend(0);
                        }
                        switchProblem++;
                        waitLoops = 20;
                    } else if (switchProblem < 20) {
                        if (DEBUG) console.log("ESC with id: " + SwitchESCsFW_ID + " don't switches ->retry");
                        send_ESC_package(SwitchESCsFW_ID, 0, [SwitchCommand]);
                        switchProblem++;
                        waitLoops = 20;
                    } else {
                        if (DEBUG) console.log("ESC with id: " + SwitchESCsFW_ID + " don't switches ->stop");
                        throwSerialBadCommunicationError = 1;
                        SwitchESCsFW_ID++;
                        switchProblem = 0;
                    }
                }
            } else {
                ESCs[SwitchESCsFW_ID].version = (responsePackage[5] / 10);
                ESCs[SwitchESCsFW_ID].subversion = (responsePackage[6] / 100);
                if (DEBUG) console.log("ESC with id: " + SwitchESCsFW_ID + " software version is: " + ESCs[SwitchESCsFW_ID].version + "." + ESCs[SwitchESCsFW_ID].subversion);
                SwitchStatus = 0;
                SwitchESCsFW_ID++;
            }
        } else if (++timeoutESC_IDs[SwitchESCsFW_ID] == 150 || timeoutESC_IDs[SwitchESCsFW_ID] == 300 || timeoutESC_IDs[SwitchESCsFW_ID] == 450) {
            sendBytes(LastSentData);
            if (DEBUG) console.log("no response, retrying");
        } else if (timeoutESC_IDs[SwitchESCsFW_ID] > 450) {
            if (DEBUG) console.log("no response from ESC with id: " + SwitchESCsFW_ID + " ->stop");
            throwSerialBadCommunicationError = 1;
            waitForResponseID = 0;
            SwitchESCsFW_ID++;
        }
    }
}


function refresh_displayed_version() {

}



//===================================================================================== Display handling

function ChangeDisplay(displayType) {
    if (menuEnabled == 0 || scanDone == 0) return;
    if (is_USB_only_bootloader == 1 && displayType != 0) {
        $("#dialog").text("USB Bootloaders are for update FW only");
        $("#dialog").dialog({
            modal: true,
            buttons: {
                Ok: function () {
                    $(this).dialog("close");
                }
            }
        });
        return;
    }
    if ((scanDone == 0 && displayType != 0) || (ESCs.length == 0 && displayType == 0) && displayType != 99) {
        $("#dialog").text("Select a COM port first, to scan for available ESC's !");
        $("#dialog").dialog({
            modal: true,
            buttons: {
                Ok: function () {
                    $(this).dialog("close");
                }
            }
        });
    } else if (ESCs.length == 0 && displayType != 99) {
        $("#dialog").text("No ESC's found. Please check that the ESC's are powered, have a working connection and try again.");
        $("#dialog").dialog({
            modal: true,
            buttons: {
                Ok: function () {
                    $(this).dialog("close");
                }
            }
        });
    } else {
        if (displayType == 2) {
            var minID = 0;
            var maxID = 0;
            var ID_count = 0;
            for (var i in ESCs) {
                if (minID == 0) minID = i;
                maxID = i;
                ID_count++;
            }
            if ((maxID - minID) + 1 > ID_count) {
                $("#dialog").text("ESC telemetry cannot be displayed because ID's have gaps. please change the ID's to be in a row.");
                $("#dialog").dialog({
                    modal: true,
                    buttons: {
                        Ok: function () {
                            $(this).dialog("close");
                            ChangeDisplay(1);
                        }
                    }
                });
                return;
            }
        }
        for (var i in ESCs) {
            ESCs[i].settingsActive[8] = 0;
            ESCs[i].settingsActive[9] = 0;
            ESCs[i].ESC_settings[0].active = 0;
        }
        $('#overview').empty();
        $('#toolbar').empty();
        if (displayType != 99) {
            selectedMenu = displayType;
            Gen_Menu_Buttons(selectedMenu, false);
        }
        if (displayType == 0) document.getElementById('toolbar').style.display = "block";
        else document.getElementById('toolbar').style.display = "none";

        displayESCs(document.getElementById("overview"));

        switch (displayType) {
            case 0:
                initFWUpdater();
                change_ESCs_status(0, 1, 0);
                break;
            case 1:
                initConfig();
                break;
            case 2:
                initTools();
                break;
        }

    }
}

//===================================================================================== ESC communication

function send_ESC_package(id, type, bytes) {
    var B_length = bytes.length + 6;
    ESC_package = [0x01, id, type, ((type >> 8) & 0xFF), B_length];
    for (var i = 0; i < bytes.length; i++) ESC_package.push(bytes[i]);
    ESC_package.push(getCRC(ESC_package, B_length - 1));
    sendBytes(ESC_package);
}

var waitForResponseID = 0;
var waitForResponseType = 0;
var waitForResponseLength = 0;
var RespBuf = [];
var RespIndex = 0;
var getLength = 5;

function checkForRespPackage() {
    var responsePackage = [];
    while (SerialAvailable()) {
        var testByte = readByte();
        if (RespIndex == 0 && testByte != 2 && testByte != 3) continue;
        if (RespIndex == 1 && waitForResponseID != testByte) {
            RespIndex = 0;
            continue;
        }

        if (RespIndex == 3 && waitForResponseType != ((testByte << 8) | RespBuf[2])) {
            RespIndex = 0;
            continue;
        }
        if (RespIndex == 4) {
            getLength = testByte;
        }
        RespBuf[RespIndex++] = testByte;
        if (RespIndex == getLength && RespIndex > 4) {
            if (getCRC(RespBuf, getLength - 1) == RespBuf[getLength - 1]) {
                for (var i = 0; i < getLength; i++) responsePackage[i] = RespBuf[i];
                if (DEBUG) console.log("valid package with " + getLength + "bytes received");
            }
            RespIndex = 0;
            getLength = 5;
            waitForResponseID = 0;
            waitForResponseType = 0;
            waitForResponseLength = 0;
        }
    }
    if (responsePackage.length > 1) return responsePackage;
    else return false;
}

var scanID = 1;
var scanStep = 0;

function ScanForESCs() {
    var current_progress = Math.round(100 / 24 * scanID);
    $("#progressbar").progressbar({
        value: current_progress
    });
    $(".progress-label").text("Scanning for ESC's " + current_progress + "%");

    if (!waitForResponseID) {
        if (scanStep == 0) { // look for ID
            timeoutESC_IDs[scanID] = 0;
            send_ESC_package(scanID, 0, [OW_OK]);
            waitForResponseID = scanID;
            waitForResponseType = 0;
            waitForResponseLength = 7;
            if (DEBUG) console.log("scan for ID: " + scanID);
        } else if (scanStep == 1) { //get Type
            timeoutESC_IDs[scanID] = 0;
            send_ESC_package(scanID, 0, [OW_REQ_TYPE]);
            waitForResponseID = scanID;
            waitForResponseType = 0;
            waitForResponseLength = 7;
            if (DEBUG) console.log("request version of ESC with ID: " + scanID);
        } else if (scanStep == 2) { //get version
            timeoutESC_IDs[scanID] = 0;
            send_ESC_package(scanID, 0, [OW_REQ_SW_VER]);
            waitForResponseID = scanID;
            waitForResponseType = 0;
            waitForResponseLength = 8;
            if (DEBUG) console.log("request type of ESC with ID: " + scanID);
        } else if (scanStep == 3) { //get SN
            timeoutESC_IDs[scanID] = 0;
            send_ESC_package(scanID, 0, [OW_REQ_SN]);
            waitForResponseID = scanID;
            waitForResponseType = 0;
            waitForResponseLength = 18;
            if (DEBUG) console.log("request Serialnumber of ESC with ID: " + scanID);
        }
    } else {
        var responsePackage = checkForRespPackage();
        if (responsePackage) {
            if (responsePackage[1] == scanID) {
                timeoutESC_IDs[scanID] = 0;
                if (scanStep == 0) {
                    ESCs[scanID] = new ESC();
                    ESCs[scanID].id = scanID;
                    ESCs[scanID].asBL = (responsePackage[0] == 0x02);
                    if (DEBUG) console.log("found ID: " + ESCs[scanID].id + ", is a bootloader: " + ESCs[scanID].asBL);
                    scanStep = 1;
                    ScanForESCs();
                } else if (scanStep == 1) {

                    ESCs[scanID].type = responsePackage[5];
                    if (ESCs[scanID].type > 127) {
                        is_USB_only_bootloader = 1;
                        if (DEBUG) console.log("Board type is USB bootloader only!");
                    }
                    ESCs[scanID].CompatibleFW_filename = ESC_types.find(x => x.id === ESCs[scanID].type).filename;

                    if (DEBUG) console.log("ESC with id: " + scanID + " is from type: " + ESCs[scanID].type);
                    scanStep = 2;
                    ScanForESCs();
                } else if (scanStep == 2) {

                    ESCs[scanID].version = (responsePackage[5] / 10);
                    ESCs[scanID].subversion = (responsePackage[6] / 100);

                    if (DEBUG) console.log("ESC with id: " + scanID + " software version is: " + ESCs[scanID].version + "." + ESCs[scanID].subversion);
                    scanStep = 3;
                    ScanForESCs();
                } else if (scanStep == 3) {

                    for (var i = 0; i < 12; i++) ESCs[scanID].SN[i] = responsePackage[i + 5];

                    if (DEBUG) {
                        console.log("ESC with id: " + scanID + " serialnumber is: ");
                        console.log(ESCs[scanID].SN);
                    }
                    scanStep = 0;
                    if (++scanID == 25 || is_USB_only_bootloader == 1) {
                        $("#progressbar").hide();
                        scanDone = 1;
                        scanID = 1;
                        enableButtons();
                        return;
                    }
                    ScanForESCs();
                }
            }
        } else if (++timeoutESC_IDs[scanID] > 0) {
            if (timeoutESC_IDs[scanID] == 5 || timeoutESC_IDs[scanID] == 10) {
                sendBytes(LastSentData);
                if (DEBUG) console.log("no response from ESC with id: " + scanID + " ->retry");
            } else if (timeoutESC_IDs[scanID] > 15) {
                timeoutESC_IDs[scanID] = 0;
                if (DEBUG) console.log("no response from ESC with id: " + scanID + " ->stop");
                waitForResponseID = 0;
                scanStep = 0;
                if (++scanID == 25) {
                    $("#progressbar").hide();
                    scanDone = 1;
                    scanID = 1;
                    if (ESCs.length == 0) {
                        $("#dialog").text("No ESC's found. Please check that the ESC's are powered, have a working connection and try again.");
                        $("#dialog").dialog({
                            modal: true,
                            buttons: {
                                Ok: function () {
                                    $(this).dialog("close");
                                }
                            }
                        });
                        disconnect();
                    }
                } else ScanForESCs();
            }
        }
    }
}

//===================================================================================== Display ESC's

function displayESCs(ParentElement) {
    for (var i in ESCs) {
        var ESC_div = document.createElement('div');
        Gen_Menu_Buttons(selectedMenu, false);
        if (selectedMenu == 0) {
            ESC_div.id = "ESC_container_" + i;
            if (ESCs[i].selected || selectedMenu != 0)
                ESC_div.className = "esc_active";
            else
                ESC_div.className = "esc_inactive";

            var ESC_ID_div = document.createElement('div');
            ESC_ID_div.className = "esc_info_id";
            ESC_ID_div.innerHTML = ESCs[i].id;
            ESC_div.appendChild(ESC_ID_div);

            var ESC_info_div = document.createElement('div');
            ESC_info_div.className = "esc_info_div";
            ESC_div.appendChild(ESC_info_div);

            var ESC_TypeDiv = document.createElement('div');
            ESC_TypeDiv.className = "esc_info_type";
            ESC_TypeDiv.innerHTML = ESC_types.find(x => x.id === ESCs[i].type).name;
            ESC_info_div.appendChild(ESC_TypeDiv);

            var ESC_versionDiv = document.createElement('div');
            ESC_versionDiv.className = "esc_info_version";
            ESC_versionDiv.innerHTML = "FW. ver. : " + ESCs[i].version + "-" + ESCs[i].subversion;
            ESC_info_div.appendChild(ESC_versionDiv);

            var ESC_SNDiv = document.createElement('div');
            ESC_SNDiv.className = "esc_info_sn";
            ESC_SNDiv.innerHTML = "SN: ";
            for (var y = 0; y < 12; y++)
                ESC_SNDiv.innerHTML += dec2hex(ESCs[i].SN[y]) + " ";
            ESC_info_div.appendChild(ESC_SNDiv);

            var ESC_selectDiv = document.createElement('div');
            ESC_selectDiv.className = "esc_info_select";
            ESC_info_div.appendChild(ESC_selectDiv);

            ESCs[i].ESC_select_Input = document.createElement('input');
            ESCs[i].ESC_select_Input.type = "checkbox";
            ESCs[i].ESC_select_Input.id = "esc_select_id_" + i;
            if (ESCs[i].selected)
                ESCs[i].ESC_select_Input.checked = true;
            else ESCs[i].ESC_select_Input.checked = false;
            ESCs[i].ESC_select_Input.onclick = function () {
                var ownId = this.id.replace(/esc_select_id_/, "");
                var targetESC = ESCs[ownId];
                var divContainer = document.getElementById("ESC_container_" + ownId);
                if (!targetESC.selected) {
                    targetESC.selected = true;
                    this.checked = true;
                    divContainer.className = "esc_active";
                } else {
                    targetESC.selected = false;
                    this.checked = false;
                    divContainer.className = "esc_inactive";
                }
            }

            setting_Checkbox_label = document.createElement('label');
            setting_Checkbox_label.htmlFor = "esc_select_id_" + i;
            setting_Checkbox_label.className = "checklabel";

            checkmark_div = document.createElement('div');
            checkmark_div.className = "checkmark";

            checkmark_stem = document.createElement('div');
            checkmark_stem.className = "checkmark_stem";
            checkmark_div.appendChild(checkmark_stem);

            checkmark_kick = document.createElement('div');
            checkmark_kick.className = "checkmark_kick";
            checkmark_div.appendChild(checkmark_kick);

            setting_Checkbox_label.appendChild(checkmark_div);

            ESC_selectDiv.appendChild(ESCs[i].ESC_select_Input);
            ESC_selectDiv.appendChild(setting_Checkbox_label);

            ESCs[i].loadingBar = document.createElement('div');
            ESCs[i].loadingBar.id = "esc_info_progress_bar_" + i;
            ESC_div.appendChild(ESCs[i].loadingBar);
        } else if (selectedMenu == 1) {
            // ---------------------------------------------------------------------------------------------------// settings
            // ESC_settings
            ESC_div.id = "ESC_container_" + i;

            ESC_div.className = "settings_container";

            var ESC_ID_div = document.createElement('div');
            ESC_ID_div.className = "esc_info_id";
            ESC_ID_div.innerHTML = ESCs[i].id;
            ESC_div.appendChild(ESC_ID_div);

            var ESC_info_div = document.createElement('div');
            ESC_info_div.className = "esc_settings_div";
            ESC_div.appendChild(ESC_info_div);

            for (var y in ESCs[i].ESC_settings) {
                // Type decision
                switch (ESCs[i].ESC_settings[y].type) {
                    case "checkbox":
                        var ESC_setting = document.createElement('div');
                        ESC_setting.className = "setting_container";
                        if (ESCs[i].ESC_settings[y].eever > ESCs[i].ESC_settings[0].active) ESC_setting.style.display = "none";

                        ESC_setting_text = document.createElement('div')
                        ESC_setting_text.className = "setting_text";

                        ESC_setting_text.innerHTML = ESCs[i].ESC_settings[y].name + " ";

                        ESC_setting.appendChild(ESC_setting_text);
                        ESC_info_div.appendChild(ESC_setting);
                        settingCheckbox = document.createElement('input');
                        settingCheckbox.type = "checkbox";
                        settingCheckbox.id = ESCs[i].ESC_settings[y].getCommand + "_setting_id_" + i;
                        settingCheckbox.onchange = function () {
                            SettingsChanged(this.id);
                        }
                        if (ESCs[i].ESC_settings[y].active) {
                            settingCheckbox.checked = true;
                            ESC_setting.className += " setting_container_active";
                        } else {
                            ESC_setting.className += " setting_container_inactive";
                        }
                        ESC_setting.appendChild(settingCheckbox);
                        setting_Checkbox_label = document.createElement('label');
                        setting_Checkbox_label.htmlFor = ESCs[i].ESC_settings[y].getCommand + "_setting_id_" + i;
                        setting_Checkbox_label.className = "checklabel";

                        checkmark_div = document.createElement('div');
                        checkmark_div.className = "checkmark";

                        checkmark_stem = document.createElement('div');
                        checkmark_stem.className = "checkmark_stem";
                        checkmark_div.appendChild(checkmark_stem);

                        checkmark_kick = document.createElement('div');
                        checkmark_kick.className = "checkmark_kick";
                        checkmark_div.appendChild(checkmark_kick);

                        setting_Checkbox_label.appendChild(checkmark_div);

                        ESC_setting.appendChild(setting_Checkbox_label);
                        break
                    case "slider":
                        var ESC_setting = document.createElement('div');
                        ESC_setting.className = "setting_container";
                        if (ESCs[i].ESC_settings[y].eever > ESCs[i].ESC_settings[0].active) ESC_setting.style.display = "none";

                        ESC_setting_text = document.createElement('div')
                        ESC_setting_text.className = "setting_text";
                        ESC_setting_text.innerHTML = ESCs[i].ESC_settings[y].name + " ";
                        ESC_setting.appendChild(ESC_setting_text);
                        ESC_info_div.appendChild(ESC_setting);
                        settingSlider = document.createElement('input');
                        settingSlider.type = "range";
                        settingSlider.min = ESCs[i].ESC_settings[y].min
                        settingSlider.max = ESCs[i].ESC_settings[y].max
                        settingSlider.className = "settings_rangeSlider"; //  ui-corner-all
                        settingSlider.value = ESCs[i].ESC_settings[y].active;
                        settingSlider.id = ESCs[i].ESC_settings[y].getCommand + "_setting_id_" + i;
                        settingSlider.onchange = function () {
                            SettingsChanged(this.id);
                        }
                        settingSlider.oninput = function () {
                            var tmpid = this.id.replace(/setting_id_/, "setting_id_value_")
                            document.getElementById(tmpid).value = document.getElementById(this.id).value
                        }

                        ESC_setting.appendChild(settingSlider);

                        settingNumber = document.createElement('output');
                        settingNumber.className = "setting_value";
                        //settingNumber.style = "width: 50px"
                        settingNumber.type = "hidden"
                        settingNumber.value = ESCs[i].ESC_settings[y].active;
                        settingNumber.id = ESCs[i].ESC_settings[y].getCommand + "_setting_id_value_" + i;
                        ESC_setting.appendChild(settingNumber);

                        break
                    case "colorpick":
                        //console.log(ESCs[i].ESC_settings[y].active)
                        var colorpickarray = [];
                        colorpickarray['Type'] = (ESCs[i].ESC_settings[y].active) & 0xFF       // 0=off, 1=RGB, 2=GRB
                        if (colorpickarray['Type'] = 2) {
                            colorpickarray['G'] = (ESCs[i].ESC_settings[y].active >> 24) & 0xFF
                            colorpickarray['R'] = (ESCs[i].ESC_settings[y].active >> 16) & 0xFF
                        } else {
                            colorpickarray['R'] = (ESCs[i].ESC_settings[y].active >> 24) & 0xFF
                            colorpickarray['G'] = (ESCs[i].ESC_settings[y].active >> 16) & 0xFF
                        }
                        colorpickarray['B'] = (ESCs[i].ESC_settings[y].active >> 8) & 0xFF
                        console.dir(colorpickarray)
                        var ESC_setting = document.createElement('div');
                        ESC_setting.className = "setting_container";
                        if (ESCs[i].ESC_settings[y].eever > ESCs[i].ESC_settings[0].active) ESC_setting.style.display = "none";
                        ESC_setting_text = document.createElement('div')
                        ESC_setting_text.className = "setting_text";
                        ESC_setting_text.innerHTML = ESCs[i].ESC_settings[y].name + " ";
                        ESC_setting.appendChild(ESC_setting_text);
                        ESC_info_div.appendChild(ESC_setting);
                        settingNumber = document.createElement('input');
                        settingNumber.type = "number";
                        settingNumber.readOnly = true;
                        settingNumber.style.width = ((ESCs[i].ESC_settings[y].max.toString(10).length * 12) + 5) + "px";
                        settingNumber.className = "settings_numberBox"; //  ui-corner-all
                        settingNumber.value = ESCs[i].ESC_settings[y].active;
                        settingNumber.id = ESCs[i].ESC_settings[y].getCommand + "_setting_id_" + i;
                        settingNumber.onchange = function () {
                            SettingsChanged(this.id);
                        }
                        ESC_setting.appendChild(settingNumber);
                        break


                    /*
                                            var ESC_setting = document.createElement('div');
                                            ESC_setting.className = "setting_container";
                                            if (ESCs[i].ESC_settings[y].eever > ESCs[i].ESC_settings[0].active) ESC_setting.style.display = "none";
                                            ESC_setting_text = document.createElement('div')
                                            ESC_setting_text.className = "setting_text";
                                            ESC_setting_text.innerHTML = ESCs[i].ESC_settings[y].name + " ";
                                            ESC_setting.appendChild(ESC_setting_text);
                                            ESC_info_div.appendChild(ESC_setting);
                                            settingNumber = document.createElement('input');
                                            //settingNumber.type = "number";
                                            settingNumber.style.width = ((ESCs[i].ESC_settings[y].max.toString(10).length * 12) + 5) + "px";
                                            settingNumber.className = "jscolor"; //  ui-corner-all
                                            settingNumber.value = dec2hex(colorpickarray['R']) + dec2hex(colorpickarray['G']) + dec2hex(colorpickarray['B']);
                                            settingNumber.id = ESCs[i].ESC_settings[y].getCommand + "_setting_id_" + i;
                                            settingNumber.onchange = function () {
                                                SettingsChanged(this.id);
                                            }
                                            ESC_setting.appendChild(settingNumber);
                                            break
                    */
                    case "value":
                        var ESC_setting = document.createElement('div');
                        ESC_setting.className = "setting_container";
                        if (ESCs[i].ESC_settings[y].eever > ESCs[i].ESC_settings[0].active) ESC_setting.style.display = "none";
                        ESC_setting_text = document.createElement('div')
                        ESC_setting_text.className = "setting_text";
                        ESC_setting_text.innerHTML = ESCs[i].ESC_settings[y].name + " ";
                        ESC_setting.appendChild(ESC_setting_text);
                        ESC_info_div.appendChild(ESC_setting);
                        settingNumber = document.createElement('input');
                        settingNumber.type = "number";
                        settingNumber.style.width = ((ESCs[i].ESC_settings[y].max.toString(10).length * 12) + 5) + "px";
                        settingNumber.className = "settings_numberBox"; //  ui-corner-all
                        settingNumber.value = ESCs[i].ESC_settings[y].active;
                        settingNumber.id = ESCs[i].ESC_settings[y].getCommand + "_setting_id_" + i;
                        settingNumber.onchange = function () {
                            SettingsChanged(this.id);
                        }
                        ESC_setting.appendChild(settingNumber);
                        break
                    case "readonly":
                        var ESC_setting = document.createElement('div');
                        ESC_setting.className = "setting_container";
                        if (ESCs[i].ESC_settings[y].eever > ESCs[i].ESC_settings[0].active) ESC_setting.style.display = "none";
                        ESC_setting_text = document.createElement('div')
                        ESC_setting_text.className = "setting_text";
                        ESC_setting_text.innerHTML = ESCs[i].ESC_settings[y].name + " ";
                        ESC_setting.appendChild(ESC_setting_text);
                        ESC_info_div.appendChild(ESC_setting);
                        settingNumber = document.createElement('input');
                        settingNumber.type = "number";
                        settingNumber.readOnly = true;
                        settingNumber.style.width = ((ESCs[i].ESC_settings[y].max.toString(10).length * 12) + 20) + "px";
                        settingNumber.className = "settings_numberBox"; //  ui-corner-all
                        settingNumber.value = ESCs[i].ESC_settings[y].active;
                        settingNumber.id = ESCs[i].ESC_settings[y].getCommand + "_setting_id_" + i;
                        settingNumber.onchange = function () {
                            SettingsChanged(this.id);
                        }
                        ESC_setting.appendChild(settingNumber);
                        break;
                    default:
                }
            }

            ESC_save_Input = document.createElement('input');
            ESC_save_Input.type = "button";
            ESC_save_Input.value = "Save";
            ESC_save_Input.id = "esc_save_id_" + i;
            ESC_save_Input.className = "settings_save_button_inactive ui-button";
            ESC_save_Input.onclick = function () {
                saveSettingsOfId(parseInt(this.id.replace(/esc_save_id_/, "")));
            }
            ESC_div.appendChild(ESC_save_Input);

        } else if (selectedMenu == 2) {
            // ---------------------------------------------------------------------------------------------------// tools

            ESC_div.id = "ESC_Canvas_Container_" + i;

            var ESC_ToolDiv = document.createElement('div');
            ESC_ToolDiv.className = "canvas_header";
            ESC_div.appendChild(ESC_ToolDiv);

            var ESC_CommandDIV = document.createElement('div');
            ESC_CommandDIV.className = "canvas_button_area";

            ESC_ToolDiv.appendChild(ESC_CommandDIV);

            var ESC_Name = document.createElement('div');
            ESC_Name.className = "canvas_esc_name";
            ESC_Name.innerHTML = ESCs[i].id;
            ESC_CommandDIV.appendChild(ESC_Name);

            for (var setting in ESC_stats) {
                var NewSetting = document.createElement('button');

                if (ESCs[i].settingsActive[setting]) {
                    NewSetting.className = "button_active";
                } else {
                    NewSetting.className = "button_inactive";
                }
                NewSetting.id = "SE_" + i + "_" + setting;
                NewSetting.innerHTML = ESC_stats[setting];
                NewSetting.onclick = function () {
                    if (this.className == "button_inactive") {
                        CheckSetting(this.id.replace(/SE_/, ''), 1);
                        this.className = "button_active";
                    } else {
                        CheckSetting(this.id.replace(/SE_/, ''), 0);
                        this.className = "button_inactive";
                    }
                }
                ESC_CommandDIV.appendChild(NewSetting);
            }
            var clearDiv = document.createElement('div');
            clearDiv.className = "clear";
            ESC_CommandDIV.appendChild(clearDiv);

            var TLMnameDiv = document.createElement('div');
            TLMnameDiv.className = "canvas_legend_area";
            ESC_div.appendChild(TLMnameDiv);

            for (var y = 0; y < 8; y++) {
                var TLM_element = document.createElement('div');
                TLM_element.className = "canvas_legend_text canvas_element_" + y;
                TLM_element.innerHTML = ESC_stats[y] + " :"
                TLMnameDiv.appendChild(TLM_element);
                ESCs[i].TLMValueElements[y] = document.createElement('div');
                ESCs[i].TLMValueElements[y].id = "canvas_legend_value_" + y;
                ESCs[i].TLMValueElements[y].className = "canvas_element_" + y;
                ESCs[i].TLMValueElements[y].innerHTML = "0";
                TLMnameDiv.appendChild(ESCs[i].TLMValueElements[y]);
            }

            ESCs[i].TLMCanvasElement = document.createElement('CANVAS');
            ESCs[i].TLMCanvasElement.className = "canvas_area"
            ESC_div.appendChild(ESCs[i].TLMCanvasElement);


            var clearDiv = document.createElement('div');
            clearDiv.className = "clear";
            ESC_div.appendChild(clearDiv);

            // Throttle to start            
            var throttleContainerDiv = document.createElement('div');
            throttleContainerDiv.className = "throttle_bar_container";
            ESC_div.appendChild(throttleContainerDiv);


            var Throttle_word_div = document.createElement('div');
            Throttle_word_div.className = "throttle_word_div";
            Throttle_word_div.innerHTML = "Throttle: ";
            throttleContainerDiv.appendChild(Throttle_word_div);

            var ESC_ThrottleDiv = document.createElement('div');
            ESC_ThrottleDiv.className = "throttle_bar_div";
            throttleContainerDiv.appendChild(ESC_ThrottleDiv);

            ESCs[i].ThrottleValue = document.createElement('input');
            ESCs[i].ThrottleValue.type = "range";
            ESCs[i].ThrottleValue.value = 0;
            ESCs[i].ThrottleValue.className = "ThrottleSlider";
            ESCs[i].ThrottleValue.min = -100;
            ESCs[i].ThrottleValue.max = 100;
            ESCs[i].ThrottleValue.id = "ESC_Thr_Value_" + i;
            ESCs[i].ThrottleValue.addEventListener('input', function (evt) {
                var tmpESCval = parseInt(this.valueAsNumber);
                var tmpESCid = parseInt(this.id.replace(/ESC_Thr_Value_/, ''))
                if (ESCs[tmpESCid].settingsActive[8]) {
                    if (!ESCs[tmpESCid].settingsActive[9] && tmpESCval < 0) {
                        // reverse not active prevent negative values
                        ESCs[tmpESCid].ThrottleValue.value = 0
                        ESCs[tmpESCid].commandedThrottle = 0
                        flash_button("SE_" + tmpESCid + "_9");
                    } else {
                        // update throttle value
                        ESCs[tmpESCid].commandedThrottle = tmpESCval;
                    }
                } else {
                    // ESC not enabled
                    ESCs[tmpESCid].ThrottleValue.value = 0
                    flash_button("SE_" + tmpESCid + "_8");
                }
            })
            ESCs[i].ThrottleValue.addEventListener('dblclick', function (evt) {
                var tmpESCid = parseInt(this.id.replace(/ESC_Thr_Value_/, ''))
                ESCs[tmpESCid].ThrottleValue.value = 0
                ESCs[tmpESCid].commandedThrottle = 0
            })

            ESC_ThrottleDiv.appendChild(ESCs[i].ThrottleValue);

        }
        ParentElement.appendChild(ESC_div);
    }
}




function disableButtons() {
    Gen_Menu_Buttons(selectedMenu, true);
    for (var i in ESCs) {
        ESCs[i].ESC_select_Input.disabled = true;
    }
    menuEnabled = 0;
    buttonsDisabled = 1;
}
function enableButtons() {
    Gen_Menu_Buttons(selectedMenu, false);
    for (var i in ESCs) {
        ESCs[i].ESC_select_Input.disabled = false;
    }
    menuEnabled = 1;
    buttonsDisabled = 0;
}

//===================================================================================== FW update / hex file handling

function initFWUpdater() {
    buttonAdded = 0;


    $("#toolbar").append(
        $('<div/>').attr({ id: 'localFW', class: 'fileContainer' }).button().click(function () {
            if (DEBUG) console.log("LOCAL");
        }
        ));
    $("#localFW").append().html("<span>Local Firmware</span>");

    toolbar = document.getElementById("localFW");
    document.getElementById('toolbar').style.display = "block";
    FW_update.fileUploadInput = document.createElement('input');
    FW_update.fileUploadInput.type = "file";
    FW_update.fileUploadInput.id = "file_upload";
    FW_update.fileUploadInput.addEventListener('change', function (evt) {
        var fileLoaded = this.value.split('\\');
        FW_update.hexString = null;
        FW_update.loadedFileName = fileLoaded[fileLoaded.length - 1];
        if (DEBUG) console.log('reading file: ' + FW_update.loadedFileName);
        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function (e) {
                FW_update.hexString = e.target.result;
                parseHexFile(FW_update.hexString);
            };
        })(evt.target.files[0]);

        reader.readAsText(evt.target.files[0]);
    }, false);
    toolbar.appendChild(FW_update.fileUploadInput);

    // Begin remote section
    $("#toolbar").append(
        $('<button/>')
            .attr({ id: 'remoteFW' })
            .button()
            .click(function () {
                if (DEBUG) console.log("check for remote firmware");
                loadGithubReleases("https://api.github.com/repos/FETtec/ESC-Firmware/releases", function (data) {
                    if ($('#remoteFWSelect').length == 0) {
                        $("#toolbar").append($('<select/>').attr({ id: 'remoteFWSelect' }));
                    }
                    $('#remoteFWSelect').empty()
                    $('#remoteFWSelect').append($("<option/>", {
                        value: null,
                        text: "---"
                    }));
                    $.each(data, function (index, release) {
                        if (DEBUG) console.log("Processing releases: " + release.name);
                        var release_name = ESC_types.find(x => x.id === ESCs[ESCs.length - 1].type).name + " " + release.tag_name;
                        if (release.prerelease == true)
                            release_name += " (BETA)"
                        $.each(release.assets, function (index2, asset) {
                            if (asset.name.endsWith(".hex") && asset.name.startsWith(ESC_types.find(x => x.id === ESCs[ESCs.length - 1].type).filename)) {
                                if (asset.name.includes("_BLUPDATE_"))
                                    release_name += " BOOTLOADER"
                                if (DEBUG) console.log("Processing firmware: " + asset.name);
                                $('#remoteFWSelect').append($("<option/>", {
                                    value: asset.browser_download_url,
                                    text: release_name
                                }));
                            }
                        });

                    });
                    // Create select menu
                    $("#remoteFWSelect").selectmenu();
                    $('#remoteFWSelect').selectmenu("refresh");
                    // on change remote select menu
                    $('#remoteFWSelect').on('selectmenuchange', function () {
                        var fw_url = $(this).val();
                        FW_update.loadedFileName = fw_url;
                        if (fw_url.startsWith("https://")) {
                            $.ajax({
                                url: fw_url,
                                type: 'GET',
                                crossDomain: true,
                                success: function (data) {
                                    if (DEBUG) console.log("Loaded remote ESC hex file");
                                    self.pages = parseHexFile(data);
                                },
                                error: function (data) {
                                    if (DEBUG) console.log("ERROR on download file")
                                    $(".ui-notification-container").notification("create", {
                                        title: "Unable to download",
                                        content: "Unable to download remote firmware. Please check for connectivity.",
                                    });

                                }
                            });
                        }
                    });

                });

            }));
    $("#remoteFW").append().html("Remote Firmware");
}

function PrepareUpdate() {
    if ($('#FW_flash').length == 0) {
        $("#toolbar").append(
            $('<button/>')
                .attr({ id: 'FW_flash' })
                .button()
                .click(function () {
                    StartFlashProcess();
                }))
            ;
        $("#FW_flash").append().html("Flash selected!");
    }
}
var FlashESC_ID = 0;

function StartFlashProcess() {
    if (FW_update.FlashProcessActive == 0) {
        FW_update.fileUploadInput.disabled = true;
        FW_update.startUpdateInput.disabled = true;
        // Disable disconnect
        FlashESC_ID = 0;
        FW_update.FlashProcessActive = 1;
        afterFlashedDisplay = 0;
        disableButtons();
    }
}

var act_ESC_flash_Stat = 0;
var act_ESC_sent_Page = 0;
var afterFlashedDisplay = 0;

function FlashProcessLoop() {
    while ((!(FlashESC_ID in ESCs) || !ESCs[FlashESC_ID].selected) && FlashESC_ID < 25) FlashESC_ID++;
    if (FlashESC_ID != 25) {
        if (waitForResponseID == 0) {
            if (act_ESC_flash_Stat < 2) {
                if (act_ESC_flash_Stat == 0) {
                    if (DEBUG) console.log("Starting to flash ESC with ID: " + FlashESC_ID + "...");
                    if (!ESCs[FlashESC_ID].asBL) {
                        send_ESC_package(FlashESC_ID, 0, [OW_RESET_TO_BL]);
                        if (DEBUG) console.log("reset ESC with ID: " + FlashESC_ID + " to bootloader");
                    }
                    act_ESC_flash_Stat = 1;
                } else {
                    send_ESC_package(FlashESC_ID, 0, [OW_OK]);
                    waitForResponseID = FlashESC_ID;
                    waitForResponseType = 0;
                    waitForResponseLength = 7;
                    if (DEBUG) console.log("check if ESC with ID: " + FlashESC_ID + " is in bootloader mode");
                }
            } else if (act_ESC_flash_Stat == 2) {
                send_ESC_package(FlashESC_ID, 0, [OW_BL_PAGES_TO_FLASH, (FW_update.pagesCount & 0xFF), (FW_update.pagesCount >> 8)]);
                act_ESC_sent_Page = FW_update.pagesCount;
                waitForResponseID = FlashESC_ID;
                waitForResponseType = 0;
                waitForResponseLength = 7;
                if (DEBUG) console.log("sent to ESC with ID: " + FlashESC_ID + " the block count that need to be flashed & erase flash command. ");
            } else if (act_ESC_flash_Stat == 3) {
                if (act_ESC_sent_Page > 0) {
                    send_ESC_package(FlashESC_ID, act_ESC_sent_Page, FW_update.preparedPages[act_ESC_sent_Page - 1]);
                    if (DEBUG) console.log("sent to ESC with ID: " + FlashESC_ID + " flash block number: " + act_ESC_sent_Page);
                    waitForResponseID = FlashESC_ID;
                    waitForResponseType = act_ESC_sent_Page;
                    waitForResponseLength = 134;
                    $("#esc_info_progress_bar_" + FlashESC_ID).progressbar({
                        value: Math.round((99 - (99 / FW_update.pagesCount * act_ESC_sent_Page)))
                    });
                } else {
                    $("#esc_info_progress_bar_" + FlashESC_ID).progressbar({
                        value: 100
                    });
                    if (DEBUG) console.log("ESC with ID: " + FlashESC_ID + " update done");
                    act_ESC_flash_Stat = 0;
                    act_ESC_sent_Page = 0;
                    ESCs[FlashESC_ID].asBL = false;
                    FlashESC_ID++;
                }
            } else if (act_ESC_flash_Stat == 4) {
                send_ESC_package(FlashESC_ID, 0, [OW_BL_PAGE_CORRECT]);
                waitForResponseID = FlashESC_ID;
                waitForResponseType = 0;
                waitForResponseLength = 7;
                if (DEBUG) console.log("verification done, sended write command");
            }
        } else {
            var responsePackage = checkForRespPackage();
            if (responsePackage) {
                if (responsePackage[1] == FlashESC_ID) {
                    timeoutESC_IDs[FlashESC_ID] = 0;
                    if (act_ESC_flash_Stat == 1) {
                        if (responsePackage[0] == 0x02) {
                            ESCs[FlashESC_ID].asBL = true;
                            if (DEBUG) console.log("ESC with ID: " + FlashESC_ID + " is in bootloader mode");
                            act_ESC_flash_Stat = 2;
                        } else {
                            if (DEBUG) console.log("ESC with ID: " + FlashESC_ID + " don't moves to bootloader!");
                            send_ESC_package(FlashESC_ID, 0, [OW_RESET_TO_BL]);
                            if (DEBUG) console.log("reset ESC with ID: " + FlashESC_ID + " to bootloader");
                        }
                    } else if (act_ESC_flash_Stat == 2) {
                        if (responsePackage[5] == 0) {
                            if (DEBUG) console.log("ESC with ID: " + FlashESC_ID + " confirmed flash erase");
                            act_ESC_flash_Stat = 3;
                        } else {
                            if (DEBUG) console.log("ESC with ID: " + FlashESC_ID + " reported error: " + responsePackage[5]);
                        }
                    } else if (act_ESC_flash_Stat == 3) {
                        if (DEBUG) console.log("received from ESC with ID: " + FlashESC_ID + " block number: " + act_ESC_sent_Page + " for verification.");
                        var verifyFailed = 0;
                        for (i = 0; i < 128; i++) {
                            if (FW_update.preparedPages[act_ESC_sent_Page - 1][i] != responsePackage[i + 5]) {
                                verifyFailed = 1;
                                break;
                            }
                        }
                        if (verifyFailed == 0) {
                            act_ESC_flash_Stat = 4;
                            FlashProcessLoop();
                        } else {
                            if (DEBUG) console.log("verification failed");
                        }
                    } else if (act_ESC_flash_Stat == 4) {
                        if (responsePackage[5] == 0) {
                            if (DEBUG) console.log("page written.");
                            act_ESC_sent_Page--;
                            act_ESC_flash_Stat = 3;
                            FlashProcessLoop();
                        } else {
                            if (DEBUG) console.log("page could not be written. error: " + responsePackage[5]);
                            // unable to write block 255 (require BL Update)
                            if (act_ESC_sent_Page == 255 && responsePackage[5] == 2) {
                                if (DEBUG) console.log("Bootloader not supporting more than 255 pages ");
                                $("#dialog").text("This ESC doesn't have the latest bootloader and can't support this firmware. Please flash the available bootloader update. Once completed please flash again this version.");
                                FlashESC_ID = 0;
                                FW_update.FlashProcessActive = 0;
                                $("#dialog").dialog({
                                    modal: true,
                                    buttons: {
                                        Ok: function () {
                                            $(this).dialog("close");

                                            FW_update.fileUploadInput.disabled = false;
                                            FW_update.startUpdateInput.disabled = false;
                                            change_ESCs_status(0, 1, 1);
                                            $('#toolbar').empty();
                                            initFWUpdater(); //lets reset the
                                        }
                                    }
                                });

                            }

                            timeoutESC_IDs[FlashESC_ID] = 0;
                            act_ESC_flash_Stat = 2;
                            waitForResponseID = 0;
                            if (DEBUG) console.log("restarting flash process for ESC with ID :" + FlashESC_ID);
                        }
                    }
                }
            } else if (++timeoutESC_IDs[FlashESC_ID] == 100 || timeoutESC_IDs[FlashESC_ID] == 200 || timeoutESC_IDs[FlashESC_ID] == 300) {
                sendBytes(LastSentData);
                if (DEBUG) console.log("no response, retrying");

            } else if (timeoutESC_IDs[FlashESC_ID] > 550) {
                send_ESC_package(FlashESC_ID, 0xFFFF, [FlashESC_ID + 10, FlashESC_ID + 20]);
                timeoutESC_IDs[FlashESC_ID] = 0;
                act_ESC_flash_Stat = 2;
                waitForResponseID = 0;
                if (DEBUG) console.log("restarting flash process for ESC with ID :" + FlashESC_ID);

            }
        }
    } else {
        if (afterFlashedDisplay == 0) {
            if (is_USB_only_bootloader == 0) {
                change_ESCs_status(1);

            } else {
                $("#dialog").text("Firmware update done! Please power cycle board.");
                $("#dialog").dialog({
                    modal: true,
                    buttons: {
                        Ok: function () {
                            $(this).dialog("close");
                        }
                    }
                });
                enableButtons();
                ChangeDisplay(0);
            }
            afterFlashedDisplay = 1;
        } else if (afterFlashedDisplay < 50) afterFlashedDisplay++;
        else if (afterFlashedDisplay == 50) {
            if (is_USB_only_bootloader == 0) change_ESCs_status(0);
            afterFlashedDisplay = 51;
        } else if (afterFlashedDisplay == 51) {
            if (DEBUG) console.log('flash process done!');
            $("#dialog").text("Firmware update done! For health and safety always remove all propellers! Please check motor direction.");
            $("#dialog").dialog({
                modal: true,
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                    }
                }
            });
            FlashESC_ID = 0;
            FW_update.FlashProcessActive = 0;
            FW_update.fileUploadInput.disabled = false;
            FW_update.startUpdateInput.disabled = false;
            if (is_USB_only_bootloader == 0) change_ESCs_status(0, 1, 1);
            $('#toolbar').empty();
            initFWUpdater(); //lets reset the
        }
    }
}

function parseHexFile(hexData) {
    var tempHexString = hexData.replace(/(?:\r\n|\r|\n)/g, '').split(':');
    var address_Counter = 0
    var hexStartFound = 0;
    var lineArr = [];
    FW_update.hexString = [];
    FW_update.binaryString = [];
    FW_update.preparedPages = [];
    FW_update.pagesCount = 0;
    for (var i = 0; i < tempHexString.length; i++) {
        lineArr = tempHexString[i].split("");
        var hex_Line_Address = parseInt('0x' + lineArr[2] + '' + lineArr[3] + '' + lineArr[4] + '' + lineArr[5]);
        if ((i == 2 && hexStartFound == 0) || (i == 1 && parseInt(lineArr[1]) != 2)) {
            hexStartFound = 1;
            address_Counter = hex_Line_Address;
            if (DEBUG) console.log('hex start at: ' + dec2hex(address_Counter));
        }
        if (i == 3) {
            if (((parseInt(lineArr[2]) == 1 && parseInt(lineArr[3])) == 8) || ((parseInt(lineArr[2]) == 3 && parseInt(lineArr[3])) == 8) || parseInt(lineArr[2]) == 4) {
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
            if (hex_Line_Address < address_Counter) hex_Line_Address = address_Counter;
            while (address_Counter < hex_Line_Address) {
                FW_update.binaryString.push(255);
                address_Counter++;
            }
            for (var y = 8; y < lineArr.length - 2; y += 2) {
                address_Counter++;
                FW_update.binaryString.push(parseInt('0x' + lineArr[y] + lineArr[y + 1]));
            }
        }
    }
    //prepare block that need to be flashed
    var page_counter = 0;
    var page_Byte_counter = 0;

    // resize to full pages
    var fitting_pages = Math.ceil(FW_update.binaryString.length / 128);
    var left_Bytes = (fitting_pages * 128) - (FW_update.binaryString.length);
    if (DEBUG) console.log('loaded: ' + FW_update.binaryString.length + ' bytes');
    for (var i = 0; i < left_Bytes; i++) {
        FW_update.binaryString.push(255);
    }
    FW_update.pagesCount = FW_update.binaryString.length / 128;
    if (DEBUG) console.log('page conform: ' + FW_update.binaryString.length + 'bytes, ' + FW_update.binaryString.length / 128 + ' pages');
    TopPage = FW_update.binaryString.length / 128;

    for (var i = 0; i < FW_update.binaryString.length; i++) {
        if (page_Byte_counter == 0) FW_update.preparedPages[page_counter] = [];
        FW_update.preparedPages[page_counter].push(FW_update.binaryString[i]);
        page_Byte_counter++;
        if (page_Byte_counter == 128) {
            page_Byte_counter = 0;
            page_counter++;
        }
    }
    PrepareUpdate();
}

//===================================================================================== Tools

var throttleWarningDone = 0;

var MaxESCid = 0;
var MinESCid = 0;

var ESCsReady = 0;
var GraphArr = [];

function initTools() {
    throttleWarningDone = 0;
    ESCsReady = 0;
    checkESCsStat = 0;
    checkESCid = 0;

    // get max ESC ID
    MaxESCid = 0;
    MinESCid = 25;
    for (var i in ESCs) {
        ESCs[i].readyForFastCommand = false;
        ESCs[i].commandedThrottle = 0;
        if (i > MaxESCid) MaxESCid = i;
        if (i < MinESCid) MinESCid = i;
        ESCs[i].TLMCanvasCTX = ESCs[i].TLMCanvasElement.getContext("2d");
        GraphArr[i] = [];
        for (var j = 0; j < 8; j++) {
            GraphArr[i][j] = [];
            for (var k = 0; k < 121; k++) GraphArr[i][j][k] = 0;
        }
    }
    change_ESCs_status(1);
}
var lastCRC = 0;
var Throttle_Com_First_Byte = 0;
var lastRequestedTLM = 0;

function sentFastThrottleSignal() {
    var throttle_Values = [];
    var throttleCommand = [];

    for (var i in ESCs) {
        if (ESCs[i].readyForFastCommand == true) {
            throttle_Values[i - 1] = (100 + ESCs[i].commandedThrottle) * 10;
        } else {
            throttle_Values[i - 1] = 1000;
        }
    }

    var startIndex = MinESCid - 1;

    throttleCommand[0] = 128 | (lastRequestedTLM << 4);
    throttleCommand[0] |= ((throttle_Values[startIndex] >> 10) & 0x01) << 3;
    throttleCommand[0] |= 0x01;
    Throttle_Com_First_Byte = throttleCommand[0];

    throttleCommand[1] = (((throttle_Values[startIndex] >> 7) & 0x07)) << 5;
    throttleCommand[1] |= ALL_ID;

    var actThrottleCommand = startIndex;
    var BitsLeftFromCommand = 7;
    var actByte = 2;
    var bitsFromByteLeft = 8;
    var bitsToAddLeft = (12 + (((MaxESCid - MinESCid) + 1) * 11)) - 16;
    while (bitsToAddLeft > 0) {
        if (bitsFromByteLeft >= BitsLeftFromCommand) {
            throttleCommand[actByte] |= (throttle_Values[actThrottleCommand] & ((1 << BitsLeftFromCommand) - 1)) << (bitsFromByteLeft - BitsLeftFromCommand);
            bitsToAddLeft -= BitsLeftFromCommand;
            bitsFromByteLeft -= BitsLeftFromCommand;
            actThrottleCommand++;
            BitsLeftFromCommand = 11;
            if (bitsToAddLeft == 0) {
                actByte++;
                bitsFromByteLeft = 8;
            }
        } else {
            throttleCommand[actByte] |= (throttle_Values[actThrottleCommand] >> (BitsLeftFromCommand - bitsFromByteLeft)) & ((1 << bitsFromByteLeft) - 1);
            bitsToAddLeft -= bitsFromByteLeft;
            BitsLeftFromCommand -= bitsFromByteLeft;
            actByte++;
            bitsFromByteLeft = 8;
            if (BitsLeftFromCommand == 0) {
                actThrottleCommand++;
                BitsLeftFromCommand = 11;
            }
        }
    }
    var commandLength = Math.ceil((12 + (((MaxESCid - MinESCid) + 1) * 11)) / 8);
    lastCRC = getCRC(throttleCommand, commandLength);
    throttleCommand[commandLength] = lastCRC;
    sendBytes(throttleCommand, 1);
}


var wait_for_TLM = 0;
var wait_for_TLM_loops = 0;
var display_TLM = 0;
var start_check = 0;

function ToolProcessLoop() {
    var blProblem = 0;
    if (ESCsReady) {
        if (buttonsDisabled) enableButtons();
        var waitForTlmCount = (((MaxESCid - MinESCid) + 1) * 2) + OneWire;
        if (SerialAvailable() == waitForTlmCount) {
            var last_CRC_byte_Valid = 1;
            if (OneWire) {
                var last_CRC_byte = readByte();
                if (last_CRC_byte != lastCRC) last_CRC_byte_Valid = 0;
            }
            var TLM_bytes = readBytes(waitForTlmCount - OneWire);
            if (last_CRC_byte_Valid && TLM_bytes[0] != lastCRC && TLM_bytes[waitForTlmCount - 1] != Throttle_Com_First_Byte) {
                var readTlmByte = 0;
                for (var i in ESCs) {
                    ESCs[i].TLMValues[lastRequestedTLM] = (TLM_bytes[readTlmByte++] << 8) | TLM_bytes[readTlmByte++];
                }
            }
            SerialConnection.RX_tail = SerialConnection.RX_head;
            wait_for_TLM_loops = 0;
        } else { //empty buffer
            if (++wait_for_TLM_loops > 2) {
                SerialConnection.RX_tail = SerialConnection.RX_head;
                wait_for_TLM_loops = 0;
            }
        }
        if (start_check > 20) {
            // check for ESC error but wait some time
            for (var i in ESCs) {
                if (ESCs[i].warning == false) {

                    if (ESCs[i].TLMValues[4] == 7357) {
                        ESCs[i].warning = true;
                        var message = "";
                        switch (ESCs[i].TLMValues[2]) {
                            case 1000:
                                message = "Failure on LOW side FETs/gatedriver detected."
                                break;
                            case 2000:
                                message = "No motor detected or failure on HIGH side FETs/gatedriver"
                                break;
                            case 3000:
                                console.log(ESC_types.find(x => x.id === ESCs[i].TLMValues[5]).name)
                                console.log(ESC_types.find(x => x.id === ESCs[i].TLMValues[6]).name)
                                var detected_esc = (ESC_types.find(x => x.id === ESCs[i].TLMValues[5]).name)
                                var expected_esc = (ESC_types.find(x => x.id === ESCs[i].TLMValues[6]).name)
                                message = "Firmware mismatch to hardware.<br><br>Expected HW: " + expected_esc + "<br>Detected HW: " + detected_esc;
                                break;

                            default:
                                message = "An unexpected error occurred. (" + ESCs[i].TLMValues[2] + ")";
                                break;

                        }

                        $(".ui-notification-container").notification("create", {
                            title: "Problem on ESC id " + i + " detected",
                            content: message,
                        },
                            {
                                /*    duration: 10000 */
                                sticky: true
                            }
                        );

                    }
                }
            }
        }

        displayTLMValues(display_TLM++);
        if (display_TLM == 8) {
            display_TLM = 0;
        }
        start_check++;
        if (wait_for_TLM_loops == 0) {
            if (++lastRequestedTLM > 7) lastRequestedTLM = 0;
            sentFastThrottleSignal();
        }
    } else { // prepare ESC's for fast Command
        if (waitForResponseID == 0) {
            while ((!(checkESCid in ESCs)) && checkESCid < 25) checkESCid++;
            if (checkESCid == 25) {
                ESCsReady = 1;
                return;
            }
            if (checkESCsStat == 0) {
                send_ESC_package(checkESCid, 0, [OW_OK]);
                waitForResponseID = checkESCid;
                waitForResponseType = 0;
                waitForResponseLength = 7;
                if (DEBUG) console.log("check with id: " + checkESCid + " ");
            } else {
                send_ESC_package(checkESCid, 0, [OW_SET_FAST_COM_LENGTH, (Math.ceil((12 + (((MaxESCid - MinESCid) + 1) * 11)) / 8) + 1), MinESCid, (MaxESCid - MinESCid) + 1]);
                waitForResponseID = checkESCid;
                waitForResponseType = 0;
                waitForResponseLength = 7;
                if (DEBUG) console.log("set fast throttle for ESC with id: " + checkESCid + " ");
            }
        } else {
            var responsePackage = checkForRespPackage();
            if (responsePackage) {
                timeoutESC_IDs[checkESCid] = 0;
                if (checkESCsStat == 0) {
                    if ((responsePackage[0] & 0x07) == 0x03) {
                        ESCs[checkESCid].asBL = false;
                        checkESCsStat++;
                    } else {
                        ESCs[checkESCid].asBL = true;
                        if (blProblem == 0) {
                            if (DEBUG) console.log("ESC with id: " + checkESCid + " remains in bootloader mode ->retry");
                            send_ESC_package(checkESCid, 0, [OW_BL_START_FW]);
                            blProblem = 1;
                        } else {
                            if (DEBUG) console.log("ESC with id: " + checkESCid + " remains in bootloader mode ->stop");
                            throwSerialBadCommunicationError = 1;
                            checkESCid++;
                            blProblem = 0;
                        }
                    }
                } else {
                    if (responsePackage[5] == OW_OK) {
                        ESCs[checkESCid].readyForFastCommand = true;
                        checkESCsStat = 0;
                        checkESCid++;
                    }
                }
            } else if (++timeoutESC_IDs[checkESCid] == 150 || timeoutESC_IDs[checkESCid] == 300 || timeoutESC_IDs[checkESCid] == 450) {
                sendBytes(LastSentData);
                if (DEBUG) console.log("no response, retrying");
            } else if (timeoutESC_IDs[checkESCid] > 450) {
                if (DEBUG) console.log("no response from ESC with id: " + checkESCid + " ->stop");
                throwSerialBadCommunicationError = 1;
                waitForResponseID = 0;
                checkESCsStat = 0;
                checkESCid++;
            }
        }
    }
}

function displayTLMValues(tlmVal) {
    for (var i in ESCs) {
        ESCs[i].TLMValueElements[tlmVal].innerHTML = ESCs[i].TLMValues[tlmVal] * TLM_scales[tlmVal];


        GraphArr[i][tlmVal].unshift((ESCs[i].TLMValues[tlmVal] / TLM_Graph_Scales[tlmVal]));
        GraphArr[i][tlmVal].pop();

        if (tlmVal == 0) {
            ESCs[i].TLMCanvasCTX.clearRect(0, 0, canvas_width, canvas_height);
            for (var j = 0; j < 8; j++) {
                if (ESCs[i].settingsActive[j]) {
                    ESCs[i].TLMCanvasCTX.beginPath();
                    ESCs[i].TLMCanvasCTX.moveTo(0, canvas_height - GraphArr[i][j][0]);
                    for (var k = 1; k < 121; k++) {
                        ESCs[i].TLMCanvasCTX.lineTo(k * 5, canvas_height - GraphArr[i][j][k]);
                    }
                    ESCs[i].TLMCanvasCTX.strokeStyle = colorFromCSSClass("canvas_element_" + j);
                    ESCs[i].TLMCanvasCTX.stroke();
                }
            }
        }
    }
}




function CheckSetting(settingID, active) {
    var settingIDs = settingID.split("_");
    var ESCid = parseInt(settingIDs[0]);
    var settingId = parseInt(settingIDs[1]);
    if (active && settingId == 8 && !throttleWarningDone) {
        throttleWarningDone = 1;
        $("#dialog").text("Be aware of injury when running motors! Please make sure everything is fixed and safe. Remove propellers.");
        $("#dialog").dialog({
            modal: true,
            buttons: {
                Ok: function () {
                    $(this).dialog("close");
                }
            }
        });
    }
    if (!active && (settingId == 8 || (settingId == 9 && ESCs[ESCid].commandedThrottle < 0))) {
        ESCs[ESCid].ThrottleValue.value = 0;
        ESCs[ESCid].commandedThrottle = 0;
    }
    ESCs[ESCid].settingsActive[settingId] = active;
}

function flash_button(button) {
    var button_flashed = 0;
    var flashInterval = 0;
    flashInterval = setInterval(function () {
        if (button_flashed < 4) {
            button_flashed++;
            if (button_flashed % 2) {
                document.getElementById(button).className = "button_active";
            } else {
                document.getElementById(button).className = "button_inactive";
            }

        } else {
            clearInterval(flashInterval);
            flashInterval = 0;
        }
    }, 50);
}

function colorFromCSSClass(className) {
    var tmp = document.createElement("div"),
        color;
    tmp.style.cssText = "position:fixed;left:-100px;top:-100px;width:1px;height:1px";
    tmp.className = className;
    document.body.appendChild(tmp); // required in some browsers
    color = getComputedStyle(tmp).getPropertyValue("color");
    document.body.removeChild(tmp);
    return color
}

//===================================================================================== ConfigurationLoop

var SettingsRead = 0;
var readSetting = 0;
var read_ESC_ids = [];
var read_ESC_settings = [];
var ESC_ID_Index = 0;
var ESC_Setting_Index = 0;
var settings_index_max = 0;

function initConfig() {
    change_ESCs_status(1);
    SettingsRead = 0;
    read_ESC_ids = [];
    read_ESC_settings = [];
    ESC_ID_Index = 0;
    ESC_Setting_Index = 0;
    checkESCsStat = 0;
    for (var ESC_IDs in ESCs) {
        read_ESC_ids.push(ESC_IDs);
        timeoutESC_IDs[ESC_IDs] = 0;
    }
    for (var ESC_Settings in ESCs[read_ESC_ids[0]].ESC_settings) read_ESC_settings.push(ESC_Settings);
}

var saveNewSettingsToId = 0;
var newSettingsValues = {};
function ConfigLoop() {
    var blProblem = 0;
    if (!SettingsRead) {
        if (waitForResponseID == 0) {

            if (ESC_Setting_Index == read_ESC_settings.length) {
                ESC_Setting_Index = 0;
                ESC_ID_Index++;
                checkESCsStat = 0;
            }
            if (ESC_ID_Index == read_ESC_ids.length) {
                SettingsRead = 1;
                document.getElementById("overview").innerHTML = "";
                displayESCs(document.getElementById("overview"));
                if (buttonsDisabled) enableButtons();
                return;
            }
            if ((ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[read_ESC_settings[ESC_Setting_Index]].eever != 0 && ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[read_ESC_settings[ESC_Setting_Index]].eever > ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[0].active) || ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[read_ESC_settings[ESC_Setting_Index]].escTypes.indexOf(ESCs[read_ESC_ids[ESC_ID_Index]].type) == -1) {
                ESC_Setting_Index++;
                checkESCsStat = 0;
                return;
            }
            if (checkESCsStat == 0) {
                send_ESC_package(read_ESC_ids[ESC_ID_Index], 0, [OW_OK]);
                waitForResponseID = read_ESC_ids[ESC_ID_Index];
                waitForResponseType = 0;
                waitForResponseLength = 7;
                if (DEBUG) console.log("check with id: " + read_ESC_ids[ESC_ID_Index] + " ");
            } else {
                send_ESC_package(read_ESC_ids[ESC_ID_Index], 0, [ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[read_ESC_settings[ESC_Setting_Index]].getCommand]);
                waitForResponseID = read_ESC_ids[ESC_ID_Index];
                waitForResponseType = 0;
                waitForResponseLength = 6 + ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[read_ESC_settings[ESC_Setting_Index]].byteCount;
                if (DEBUG) console.log("requesting Setting " + ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[read_ESC_settings[ESC_Setting_Index]].name + " with command " + ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[read_ESC_settings[ESC_Setting_Index]].getCommand + " from ESC with id: " + read_ESC_ids[ESC_ID_Index] + " ");
            }
        } else {
            var responsePackage = checkForRespPackage();
            if (responsePackage) {
                timeoutESC_IDs[read_ESC_ids[ESC_ID_Index]] = 0;
                if (checkESCsStat == 0) {
                    if ((responsePackage[0] & 0x07) == 0x03) {
                        ESCs[read_ESC_ids[ESC_ID_Index]].asBL = false;
                        checkESCsStat++;
                    } else {
                        ESCs[read_ESC_ids[ESC_ID_Index]].asBL = true;
                        if (blProblem == 0) {
                            if (DEBUG) console.log("ESC with id: " + read_ESC_ids[ESC_ID_Index] + " remains in bootloader mode ->retry");
                            send_ESC_package(read_ESC_ids[ESC_ID_Index], 0, [OW_BL_START_FW]);
                            blProblem = 1;
                        } else {
                            if (DEBUG) console.log("ESC with id: " + read_ESC_ids[ESC_ID_Index] + " remains in bootloader mode ->stop");
                            throwSerialBadCommunicationError = 1;
                            checkESCid++;
                            blProblem = 0;
                        }
                    }
                } else {
                    if (ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[read_ESC_settings[ESC_Setting_Index]].byteCount == 1) {
                        ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[read_ESC_settings[ESC_Setting_Index]].active = responsePackage[5];
                    } else if (ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[read_ESC_settings[ESC_Setting_Index]].byteCount == 2) {
                        ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[read_ESC_settings[ESC_Setting_Index]].active = (responsePackage[5] << 8) | responsePackage[6];
                    } else if (ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[read_ESC_settings[ESC_Setting_Index]].byteCount == 4) {
                        ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[read_ESC_settings[ESC_Setting_Index]].active = (responsePackage[5] << 24) | (responsePackage[6] << 16) | (responsePackage[7] << 8) | responsePackage[8];
                    }
                    checkESCsStat = 0;
                    if (DEBUG) console.log("Setting " + ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[read_ESC_settings[ESC_Setting_Index]].name + " from ESC with id: " + read_ESC_ids[ESC_ID_Index] + " is " + ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[read_ESC_settings[ESC_Setting_Index]].active + " bytecound: " + ESCs[read_ESC_ids[ESC_ID_Index]].ESC_settings[read_ESC_settings[ESC_Setting_Index]].byteCount);
                    ESC_Setting_Index++;
                }
            } else if (++timeoutESC_IDs[read_ESC_ids[ESC_ID_Index]] == 150 || timeoutESC_IDs[read_ESC_ids[ESC_ID_Index]] == 300 || timeoutESC_IDs[read_ESC_ids[ESC_ID_Index]] == 450) {
                sendBytes(LastSentData);
                if (DEBUG) console.log("no response, retrying");
            } else if (timeoutESC_IDs[read_ESC_ids[ESC_ID_Index]] > 450) {
                if (DEBUG) console.log("no response from ESC with id: " + read_ESC_ids[ESC_ID_Index] + " ->stop");
                throwSerialBadCommunicationError = 1;
                waitForResponseID = 0;
                checkESCsStat = 0;
                ESC_ID_Index++;
            }
        }
        // save settings
    } else if (saveNewSettingsToId) {
        if (waitForResponseID == 0) {
            while (ESC_Setting_Index < read_ESC_settings.length && ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].changed == false) ESC_Setting_Index++;
            if (ESC_Setting_Index >= read_ESC_settings.length) {
                if (DEBUG) console.log("allChanges saved");
                document.getElementById("esc_save_id_" + saveNewSettingsToId).className = "settings_save_button_inactive ui-button";
                saveNewSettingsToId = 0;
                return;
            }

            if (checkESCsStat == 0) {
                send_ESC_package(saveNewSettingsToId, 0, [ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].getCommand]);
                waitForResponseID = saveNewSettingsToId;
                waitForResponseType = 0;
                waitForResponseLength = 7;
                if (DEBUG) console.log("GET Setting " + ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].name + " with command " + ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].getCommand + " from ESC with id: " + saveNewSettingsToId + " ");
            } else {
                if (ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].byteCount == 1) {
                    send_ESC_package(saveNewSettingsToId, 0, [(ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].setCommand), newSettingsValues[read_ESC_settings[ESC_Setting_Index]]]);
                } else if (ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].byteCount == 2) {
                    send_ESC_package(saveNewSettingsToId, 0, [(ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].setCommand), (newSettingsValues[read_ESC_settings[ESC_Setting_Index]] >> 8), (newSettingsValues[read_ESC_settings[ESC_Setting_Index]] & 0xFF)]);
                } else if (ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].byteCount == 4) {
                    send_ESC_package(saveNewSettingsToId, 0, [(ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].setCommand), (newSettingsValues[read_ESC_settings[ESC_Setting_Index]] >> 24), (newSettingsValues[read_ESC_settings[ESC_Setting_Index]] >> 16) & 0xFF, (newSettingsValues[read_ESC_settings[ESC_Setting_Index]] >> 8) & 0xFF, (newSettingsValues[read_ESC_settings[ESC_Setting_Index]] & 0xFF)]);
                }
                if (ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].name == "ESC ID") {
                    waitForResponseID = newSettingsValues[read_ESC_settings[ESC_Setting_Index]];
                } else {
                    waitForResponseID = saveNewSettingsToId;
                }
                waitForResponseType = 0;
                waitForResponseLength = 7;
                if (DEBUG) console.log("SET Setting " + ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].name + " with command " + (ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].getCommand + 1) + " to:" + newSettingsValues[read_ESC_settings[ESC_Setting_Index]] + " at ESC with id: " + saveNewSettingsToId + " ");
            }
        } else {
            var responsePackage = checkForRespPackage();
            if (responsePackage) {
                timeoutESC_IDs[saveNewSettingsToId] = 0;
                if (checkESCsStat == 0) {
                    var responsePayload = 0;
                    if (ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].byteCount == 1) {
                        responsePayload = responsePackage[5];
                    } else if (ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].byteCount == 2) {
                        responsePayload = (responsePackage[5] << 8) | responsePackage[6];
                    }
                    else if (ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].byteCount == 4) {
                        responsePayload = (responsePackage[5] << 24) | (responsePackage[6] << 16) | (responsePackage[7] << 8) | responsePackage[8];
                    }
                    if (responsePayload == ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].active) {
                        if (DEBUG) console.log("GET response correct");
                        checkESCsStat++;
                    } else {
                        if (DEBUG) console.log("SET response not correct (" + responsePayload + ") instead of (" + ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].active + "). stop");
                        throwSerialBadCommunicationError = 1;
                        ESC_Setting_Index++;
                    }
                    waitForResponseID = 0;
                } else {
                    if (responsePackage[5] == OW_OK) {
                        ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].changed = false;
                        ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].active = newSettingsValues[read_ESC_settings[ESC_Setting_Index]];
                        checkESCsStat = 0;
                        if (ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].getCommand == OW_GET_ID) {
                            $("#dialog").text("A ESC id was changed. GUI must reset! please connect again.");
                            $("#dialog").dialog({
                                modal: true,
                                buttons: {
                                    Ok: function () {
                                        $(this).dialog("close");
                                    }
                                }
                            });
                            disconnect();
                            return;
                        }
                        if (DEBUG) console.log("saved setting: " + ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].name);
                        ESC_Setting_Index++;
                    } else {
                        if (DEBUG) console.log("error while saving..." + ESCs[saveNewSettingsToId].ESC_settings[read_ESC_settings[ESC_Setting_Index]].name);
                        checkESCsStat = 0;
                        ESC_Setting_Index++;
                    }
                    waitForResponseID = 0;
                }
            } else if (++timeoutESC_IDs[saveNewSettingsToId] == 150 || timeoutESC_IDs[saveNewSettingsToId] == 300 || timeoutESC_IDs[saveNewSettingsToId] == 450) {
                sendBytes(LastSentData);
                if (DEBUG) console.log("no response, retrying");
            } else if (timeoutESC_IDs[saveNewSettingsToId] > 450) {
                if (DEBUG) console.log("no response from ESC with id: " + saveNewSettingsToId + " ->stop");
                throwSerialBadCommunicationError = 1;
                waitForResponseID = 0;
                checkESCsStat = 0;
                ESC_Setting_Index++;
            }
        }
    }
}


function checkChangedSettings(ID) {
    var changedSettings = false;
    newSettingsValues = {};
    for (var y in ESCs[ID].ESC_settings) {
        if ((ESCs[ID].ESC_settings[y].min != 0 || ESCs[ID].ESC_settings[y].max != 0) && ESCs[ID].ESC_settings[y].escTypes.indexOf(ESCs[ID].type) != -1) {
            if (ESCs[ID].ESC_settings[y].min == 0 && ESCs[ID].ESC_settings[y].max == 1) { // just active or inactive
                if (document.getElementById(ESCs[ID].ESC_settings[y].getCommand + "_setting_id_" + ID).checked) {
                    newSettingsValues[y] = 1;
                    document.getElementById(ESCs[ID].ESC_settings[y].getCommand + "_setting_id_" + ID).parentElement.className = "setting_container setting_container_active";
                } else {
                    newSettingsValues[y] = 0;
                    document.getElementById(ESCs[ID].ESC_settings[y].getCommand + "_setting_id_" + ID).parentElement.className = "setting_container setting_container_inactive";
                }
            } else { // value
                newSettingsValues[y] = parseInt(document.getElementById(ESCs[ID].ESC_settings[y].getCommand + "_setting_id_" + ID).value);
                if (newSettingsValues[y] > ESCs[ID].ESC_settings[y].max) newSettingsValues[y] = ESCs[ID].ESC_settings[y].max;
                if (newSettingsValues[y] < ESCs[ID].ESC_settings[y].min) newSettingsValues[y] = ESCs[ID].ESC_settings[y].min;
                document.getElementById(ESCs[ID].ESC_settings[y].getCommand + "_setting_id_" + ID).value = newSettingsValues[y];
            }
            if (newSettingsValues[y] != ESCs[ID].ESC_settings[y].active) {
                ESCs[ID].ESC_settings[y].changed = true;
                changedSettings = true;
            }
        }
    }
    return changedSettings;
}


function SettingsChanged(inputID) {
    var idString = inputID.split("_");
    var ID = parseInt(idString[idString.length - 1]);
    var changedSettings = checkChangedSettings(ID);
    if (changedSettings) document.getElementById("esc_save_id_" + ID).className = "settings_save_button_active ui-button";
    else document.getElementById("esc_save_id_" + ID).className = "settings_save_button_inactive ui-button";
}


function saveSettingsOfId(ID) {
    //collect Settings-
    var changedSettings = checkChangedSettings(ID);
    if (ESCs[ID].ESC_settings[99].changed) {
        var ID_is_free = 1;
        for (i = 0; i < read_ESC_ids.length; i++) {
            if (newSettingsValues[99] == read_ESC_ids[i]) ID_is_free = 0;
        }
        if (ID_is_free == 0) {
            $("#dialog").text("ESC ID:" + newSettingsValues[99] + " is already in use, please choose another one.");
            $("#dialog").dialog({
                modal: true,
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                    }
                }
            });
            return;
        }
    }
    ESC_Setting_Index = 0;
    checkESCsStat = 0;
    for (var ESC_IDs in ESCs) timeoutESC_IDs[ESC_IDs] = 0;
    if (changedSettings) {
        saveNewSettingsToId = ID; // make the loop save the settings
    }
}