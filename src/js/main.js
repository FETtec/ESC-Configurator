"user strict";

const DEBUG = 0;
const SERIALDEBUG = 0; // show send/receive

const MAX_TRY = 2;
const DEFAULT_TIMEOUT = 215;

const TLMcanvasWidth = 600;
const TLMcanvasHeight = 142;

const KISS_PT = 0;
const BF_PT = 1;
const USB_UART = 2;
const VCP = 3;

const DEVICE_types = [
    { id: 0, name: "none", filename: '' },
    { id: 1, name: "FETtec ESC 35A", filename: 'FETTEC_35A_ESC_G0_', start_addr: 1800, blOnly: false },
    { id: 2, name: "FETtec ESC 50A", filename: 'FETTEC_50A_ESC_G0_', start_addr: 1800, blOnly: false },
    { id: 3, name: "FETtec ESC 7A", filename: 'FETTEC_7A_ESC_G0_', start_addr: 1800, blOnly: false },
    { id: 4, name: "G4_ESC", filename: '' },
    { id: 5, name: "FETtec PRO ESC 60A", filename: 'FETTEC_PRO_60A_ESC_S32K_', start_addr: 4000, blOnly: false },
    { id: 6, name: "FETtec ESC 45A", filename: 'FETTEC_45A_ESC_G0_', start_addr: 1800, blOnly: false },
    { id: 7, name: "FETtec ESC 45A HV", filename: 'FETTEC_45A_HV_ESC_G0_', start_addr: 1800, blOnly: false },
    { id: 8, name: "FETtec ESC 15A", filename: 'FETTEC_15A_ESC_G0_', start_addr: 1800, blOnly: false },
    { id: 64, name: "ESC 15A", filename: 'ESC_DEF_GD_15A_ESC_G0_', start_addr: 1800, blOnly: false },
    { id: 65, name: "ESC 15A", filename: 'ESC_ADV_GD_15A_ESC_G0_', start_addr: 1800, blOnly: false },
    //    { id: 66, name: "ESC 15A", filename: '' },
    //    { id: 67, name: "ESC 15A", filename: '' },
    { id: 68, name: "ESC 25A", filename: 'ESC_DEF_GD_25A_ESC_G0_', start_addr: 1800, blOnly: false },
    { id: 69, name: "ESC 25A", filename: 'ESC_ADV_GD_25A_ESC_G0_', start_addr: 1800, blOnly: false },
    //    { id: 70, name: "ESC 25A", filename: '' },
    //    { id: 71, name: "ESC 25A", filename: '' },
    { id: 72, name: "ESC 35A", filename: 'ESC_DEF_GD_35A_ESC_G0_', start_addr: 1800, blOnly: false },
    { id: 73, name: "ESC 35A", filename: 'ESC_ADV_GD_35A_ESC_G0_', start_addr: 1800, blOnly: false },
    { id: 74, name: "ESC 35A", filename: 'ESC_DEF_GD_35A_ESC_G4_', start_addr: 1800, blOnly: false },
    { id: 75, name: "ESC 35A", filename: 'ESC_ADV_GD_35A_ESC_G4_', start_addr: 1800, blOnly: false },
    //    { id: 76, name: "ESC 35A", filename: '' },
    //    { id: 77, name: "ESC 35A", filename: '' },
    { id: 78, name: "ESC 45A", filename: 'ESC_DEF_GD_45A_ESC_G0_', start_addr: 1800, blOnly: false },
    { id: 79, name: "ESC 45A", filename: 'ESC_DEF_GD_45A_ESC_G0_', start_addr: 1800, blOnly: false },
    { id: 80, name: "ESC 45A", filename: 'ESC_DEF_GD_45A_ESC_G4_', start_addr: 1800, blOnly: false },
    { id: 81, name: "ESC 45A", filename: 'ESC_DEF_GD_45A_ESC_G4_', start_addr: 1800, blOnly: false },
    { id: 82, name: "ESC 45A", filename: 'ESC_DEF_GD_45A_ESC_S32K_', start_addr: 4000, blOnly: false },
    { id: 83, name: "ESC 45A", filename: 'ESC_DEF_GD_45A_ESC_S32K_', start_addr: 4000, blOnly: false },
    //    { id: 84, name: "ESC 45A", filename: '' },
    //    { id: 85, name: "ESC 45A", filename: '' },
    { id: 86, name: "ESC 55A", filename: 'ESC_DEF_GD_55A_ESC_G0_', start_addr: 1800, blOnly: false },
    { id: 87, name: "ESC 55A", filename: 'ESC_DEF_GD_55A_ESC_G0_', start_addr: 1800, blOnly: false },
    { id: 88, name: "ESC 55A", filename: 'ESC_DEF_GD_55A_ESC_G4_', start_addr: 3800, blOnly: false },
    { id: 89, name: "ESC 55A", filename: 'ESC_DEF_GD_55A_ESC_G4_', start_addr: 3800, blOnly: false },
    { id: 90, name: "ESC 55A", filename: 'ESC_DEF_GD_55A_ESC_S32K_', start_addr: 4000, blOnly: false },
    { id: 91, name: "ESC 55A", filename: 'ESC_DEF_GD_55A_ESC_S32K_', start_addr: 4000, blOnly: false },
    //    { id: 92, name: "ESC 55A", filename: '' },
    //    { id: 93, name: "ESC 55A", filename: '' },
    { id: 94, name: "ESC 65A", filename: 'ESC_DEF_GD_65A_ESC_G0_', start_addr: 1800, blOnly: false },
    { id: 95, name: "ESC 65A", filename: 'ESC_DEF_GD_65A_ESC_G0_', start_addr: 1800, blOnly: false },
    { id: 96, name: "ESC 65A", filename: 'ESC_DEF_GD_65A_ESC_G4_', start_addr: 3800, blOnly: false },
    { id: 96, name: "ESC 65A", filename: 'ESC_DEF_GD_65A_ESC_G4_', start_addr: 3800, blOnly: false },
    { id: 98, name: "ESC 65A", filename: 'ESC_DEF_GD_65A_ESC_S32K_', start_addr: 4000, blOnly: false },
    { id: 99, name: "ESC 65A", filename: 'ESC_DEF_GD_65A_ESC_S32K_', start_addr: 4000, blOnly: false },
    //    { id: 100, name: "ESC 65A", filename: '' },
    //    { id: 101, name: "ESC 65A", filename: '' },
    { id: 102, name: "ESC 80A", filename: 'ESC_DEF_GD_80A_ESC_G4_', start_addr: 3800, blOnly: false },
    { id: 103, name: "ESC 80A", filename: 'ESC_DEF_GD_80A_ESC_G4_', start_addr: 3800, blOnly: false },
    { id: 104, name: "ESC 80A", filename: 'ESC_DEF_GD_80A_ESC_S32K_', start_addr: 4000, blOnly: false },
    { id: 105, name: "ESC 80A", filename: 'ESC_DEF_GD_80A_ESC_S32K_', start_addr: 4000, blOnly: false },
    //    { id: 106, name: "ESC 80A", filename: '' },
    //    { id: 107, name: "ESC 80A", filename: '' },
    { id: 102, name: "ESC 100A", filename: 'ESC_DEF_GD_100A_ESC_G4_', start_addr: 3800, blOnly: false },
    { id: 103, name: "ESC 100A", filename: 'ESC_DEF_GD_100A_ESC_G4_', start_addr: 3800, blOnly: false },
    { id: 104, name: "ESC 100A", filename: 'ESC_DEF_GD_100A_ESC_S32K_', start_addr: 4000, blOnly: false },
    { id: 105, name: "ESC 100A", filename: 'ESC_DEF_GD_100A_ESC_S32K_', start_addr: 4000, blOnly: false },
    //    { id: 106, name: "ESC 100A", filename: '' },
    //    { id: 107, name: "ESC 100A", filename: '' },
    { id: 128, name: "FETtec G4-FC", filename: 'FETTEC_FC_G4-', start_addr: 3800, blOnly: true },
    { id: 129, name: "FETtec G0-OSD", filename: 'RG_OSD_G0', start_addr: 1000, blOnly: true }
];

const Serial_Options = [
    { id: 0, name: 'KISS FC Passthrough', connect_bitrate: 115200, disabled: false },
    { id: 1, name: 'Betaflight Passthrough', connect_bitrate: 115200, disabled: false },
    { id: 2, name: 'USB UART', connect_bitrate: 2000000, disabled: false },
    { id: 3, name: 'USB', connect_bitrate: 2000000, disabled: false }
];

const Menu_Options = [
    { id: 0, name: 'Overview', icon: "ui-icon-info", disabled: false },
    { id: 1, name: 'Settings', icon: "ui-icon-gear", disabled: false },
    { id: 2, name: 'Telemetry', icon: "ui-icon-heart", disabled: false },
];

const TLM_Device_Stats = [
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

function DEVICE() {
    this.id = 0;
    this.asBL = false;
    this.type = 0;
    this.SN = [];
    this.version = 0;
    this.subversion = 0;
    this.activated = 0;
    this.activationkey = 0;
    this.Device_select_Input = 0;
    this.selected = true;
    this.loadingBar = 0;
    this.warning = false;
    // begin ESC specific settings
    this.settingsActive = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0]; // TLM buttons
    this.commandedThrottle = 0;
    this.readyForFastCommand = false;
    this.TLMValues = [0, 0, 0, 0, 0, 0, 0, 0];
    this.TLMValueElements = [];
    this.TLMCanvasElement;
    this.TLMCanvasCTX;
    // end ESC specific settings
    this.DeviceSettings = {
        0: { getCommand: OW_GET_EEVER, setCommand: null, name: "EEPROM version", type: "readonly", min: 0, max: 0, active: 0, changed: false, eever: 0, byteCount: 1, DeviceTypes: onAllESCs }, // must always be 0
        40: { getCommand: OW_GET_ROTATION_DIRECTION, setCommand: OW_SET_ROTATION_DIRECTION, name: "Reverse rotation direction", feature: "standard", type: "checkbox", min: 0, max: 1, active: 0, changed: false, eever: 16, byteCount: 1, DeviceTypes: onAllESCs },
        41: { getCommand: OW_GET_USE_SIN_START, setCommand: OW_SET_USE_SIN_START, name: "Slow start", feature: "standard", type: "checkbox", min: 0, max: 1, active: 0, changed: false, eever: 16, byteCount: 1, DeviceTypes: onAllESCs },
        42: { getCommand: OW_GET_3D_MODE, setCommand: OW_SET_3D_MODE, name: "3D Mode", feature: "standard", type: "checkbox", min: 0, max: 1, active: 0, changed: false, eever: 1, byteCount: 1, DeviceTypes: onAllESCs },
        43: { getCommand: OW_GET_LINEAR_THRUST, setCommand: OW_SET_LINEAR_THRUST, name: "Linear Thrust", feature: "advanced", type: "readonly", min: 0, max: 1, active: 0, changed: false, eever: 16, byteCount: 1, DeviceTypes: onAllESCs },
        44: { getCommand: OW_GET_PWM_MIN, setCommand: OW_SET_PWM_MIN, name: "PWM Min. Signal", type: "slider", feature: "advanced", min: 1000, max: 1400, active: 0, changed: false, eever: 17, byteCount: 2, DeviceTypes: onAllESCs },
        45: { getCommand: OW_GET_PWM_MAX, setCommand: OW_SET_PWM_MAX, name: "PWM Max. Signal", type: "slider", feature: "advanced", min: 1600, max: 2000, active: 0, changed: false, eever: 17, byteCount: 2, DeviceTypes: onAllESCs },
        46: { getCommand: OW_GET_ESC_BEEP, setCommand: OW_SET_ESC_BEEP, name: "ESC beeps", feature: "standard", type: "checkbox", min: 0, max: 1, active: 0, changed: false, eever: 18, byteCount: 1, DeviceTypes: onAllESCs },
        47: { getCommand: OW_GET_CURRENT_CALIB, setCommand: OW_SET_CURRENT_CALIB, name: "Current calibration (%)", feature: "advanced", type: "value", min: 75, max: 125, active: 0, changed: false, eever: 18, byteCount: 1, DeviceTypes: onAllESCs },
        48: { getCommand: OW_GET_LOW_RAMP, setCommand: OW_SET_LOW_RAMP, name: "Low slew rate", feature: "advanced", type: "value", min: 1, max: 1000, active: 1, changed: false, eever: 22, byteCount: 2, DeviceTypes: onAllESCs },
        49: { getCommand: OW_GET_HIGH_RAMP, setCommand: OW_SET_HIGH_RAMP, name: "High slew rate", feature: "advanced", type: "value", min: 1, max: 1000, active: 1, changed: false, eever: 22, byteCount: 2, DeviceTypes: onAllESCs },
        50: { getCommand: OW_GET_LED_COLOR, setCommand: OW_SET_LED_COLOR, name: "Color", feature: "standard", type: "readonly", min: 0, max: 0xFFFFFFFF, active: 1, changed: false, eever: 22, byteCount: 4, DeviceTypes: onAllESCs },
        51: { getCommand: OW_GET_SOFT_BRAKE, setCommand: OW_SET_SOFT_BRAKE, name: "Soft brake", feature: "advanced", type: "checkbox", min: 0, max: 1, active: 0, changed: false, eever: 23, byteCount: 1, DeviceTypes: onAllESCs },

        56: { getCommand: OW_GET_ACTIVATION, setCommand: OW_GET_ACTIVATION, name: "Activated", feature: "advanced", type: "readonly", min: 0, max: 1, active: 0, changed: false, eever: 25, byteCount: 1, DeviceTypes: onAllESCs },

        99: { getCommand: OW_GET_ID, setCommand: OW_SET_ID, name: "OneWire ID", feature: "advanced", type: "value", min: 1, max: 24, active: 0, changed: false, eever: 16, byteCount: 1, DeviceTypes: onAllESCs } // must always be 99 and the last one
    };
}

// helper to prevent single arrays in all settings

var actDeviceFlashPage = 0;
var actDeviceFlashStat = 0;
var activationActive = 0;
var addressCounter = 0
var afterFlashedDisplay = 0;
var buttonsDisabled = 0;
var bytesCount = 1;
var checkDEVICEsStats = 0;
var checkDeviceId = 0;
var communicationErrorWarningDone = 0;
var connectionType = KISS_PT;
var connection_attempts = 0;
var deviceActivateId = 0;
var deviceIdIndex = 0;
var deviceSettingIndex = 0;
var devicesDisplayed = 0;
var devicesReady = 0;
var devicesToBL = 0;
var displayTLM = 0;
var do_not_Update_Progress_Bar = 0;
var enableButtonsAfterSwitch = 0;
var expectedHeader = 0;
var extraDelay = 1;
var firmwareUpdaterInitDone = 0;
var flashDeviceId = 0;
var getLength = 5;
var interval_Speedup_Done = 0;
var is_USB_only_bootloader = 0
var lastCRC = 0;
var lastRequestedTLM = 0;
var loopInterval = 0;
var maxDeviceId = 0;
var menuEnabled = 1;
var minDeviceId = 0;
var newBaud = 0;
var noLoop = 0;
var onewire = 0;
var ptStatus = 0;
var readSetting = 0;
var reconnectOnTxDone = 0;
var refreshVersion = 0;
var responseIndex = 0;
var saveNewSettingsToId = 0;
var scanDone = 0;
var scanID = 1;
var scanStep = 0;
var selectedMenu = 0;
var sentTestPackage = 0;
var serialBadError = 0;
var settingsRead = 0;
var settings_index_max = 0;
var start_check = 0;
var switchCommand = 0;
var switchDeviceId = 0;
var switchProblem = 0;
var switchStatus = 0;
var thrCommandFirstByte = 0;
var throttleWarningDone = 0;
var toolbar = 0;
var use_bit_rate = 2000000;
var waitForResponseID = 0;
var waitForResponseLength = 0;
var waitForResponseType = 0;
var waitLoops = 0;
var waitLoops = 0;
var wait_for_TLM = 0;
var wait_for_TLM_loops = 0;

var DEVICEs = [];
var DevicePackage = [];
var GraphArr = [];
var LastSentData = [];
var RespBuf = [];
var readDeviceIDs = [];
var readDeviceSettings = [];
var timeoutDeviceIDs = [];

var onAllESCs = [];
for (var i in DEVICE_types) onAllESCs.push(DEVICE_types[i].id);

var newSettingsValues = {};

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
    loadedFileName: "",
    startAddr: null,
    WhitePilotLogoPos: null,
    BlackPilotLogoPos: null,
    WhitePilotLogoArr: [],
    BlackPilotLogoArr: [],
    WhiteStartLogoPos: null,
    BlackStartLogoPos: null,
    WhiteStartLogoArr: [],
    BlackStartLogoArr: []
}

//===================================================================================== init
onload = function () {

    $(".ui-notification-container").notification({
        stack: "above"
    });

    Gen_Menu_Buttons(-1, true); // Generate Menu Button
    Gen_Types_Dropdown(Serial_Options); // Generate Serial Options

    // Check for serial ports and build options
    chrome.serial.getDevices(function (ports) {
        checkPorts(ports, true);
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
            console.dir(DEVICEs);
            console.log('SerialConnection[]');
            console.dir(SerialConnection);
            console.log('Version: ' + chrome.runtime.getManifest().version);
            console.log('Update details');
            console.dir(versionCheck);
            console.log("DEBUG");
            console.log(FW_update);
            //OW_activate();
            showLogoEditor(startLogoWidth, startLogoHeight, FW_update.WhiteStartLogoArr, FW_update.BlackStartLogoArr, FW_update.WhiteStartLogoPos, FW_update.BlackStartLogoPos);
            return
        });
    }
}
onclose = function () {
    chrome.serial.disconnect(connection.connectionId, function () { });
}

//===================================================================================== port handling

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
    for (var i in Menu_Options) {
        var button_class = "";
        if (Menu_Options[i].id === active_id) {
            button_class = "ui-state-active";
        }
        var disabled_val = false;
        if (is_disabled == true) {
            disabled_val = true;
        } else {
            disabled_val = Menu_Options[i].disabled;
        }
        $('#menu')
            .append($('<button/>')
                .attr('id', "MB_" + Menu_Options[i].id)
                .attr('class', button_class)
                .button({
                    label: Menu_Options[i].name,
                    icon: Menu_Options[i].icon,
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

function OpenPort(port) {
    UpdateSerialSection("connect");
    connectionType = parseInt(document.getElementById("con_type").value);

    SerialConnection.Port = port;

    use_bit_rate = 2000000;
    if (SerialConnection.pass_through != SerialConnection.Port) {
        switch (connectionType) {
            case KISS_PT:
                use_bit_rate = 115200;
                ptStatus = 1;
                onewire = 0;
                break;
            case BF_PT:
                use_bit_rate = 115200;
                ptStatus = 1;
                onewire = 1;
                break
            case USB_UART:
                use_bit_rate = 2000000;
                ptStatus = 0;
                onewire = 1;
                break;
            case VCP:
                use_bit_rate = 2000000;
                ptStatus = 1;
                onewire = 0;
                break;
        }
    } else {
        switch (connectionType) {
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

function onPortOpen(cInfo) {
    if (typeof cInfo !== 'undefined') {
        SerialConnection.connection = cInfo;
        SerialConnection.connected = 1;
        if (connectionType == BF_PT) {
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

function changeBaud(changeBaud) {
    newBaud = changeBaud;
    chrome.serial.update(SerialConnection.connection.connectionId, { bitrate: newBaud }, Reconnect);
}

function Reconnect() {
    ptStatus = 0;
    SerialConnection.pass_through = SerialConnection.Port;
    if (DEBUG) console.log("changed Baud to: " + newBaud);
}

function disconnect() {
    selectedMenu = 0;
    activationActive = 0;
    bytesCount = 1;
    connection_attempts = 0;

    sentTestPackage = 0;
    SerialConnection.pass_through = 0;
    SerialConnection.pass_through_fails = 0;
    SerialConnection.connected = false;
    interval_Speedup_Done = 0;
    ptStatus = 0;
    waitLoops = 0;
    is_USB_only_bootloader = 0;

    scanDone = 0;
    devicesDisplayed = 0;

    DEVICEs = [];
    timeoutDeviceIDs = [];

    firmwareUpdaterInitDone = 0;
    FW_update.hexString = [];
    FW_update.binaryString = [];
    FW_update.preparedPages = [];
    FW_update.pagesCount = 0;
    FW_update.startAddr = null;
    FW_update.WhitePilotLogoPos = null;
    FW_update.BlackPilotLogoPos = null;
    FW_update.WhitePilotLogoArr = [];
    FW_update.BlackPilotLogoArr = [];
    FW_update.WhiteStartLogoPos = null;
    FW_update.BlackStartLogoPos = null;
    FW_update.WhiteStartLogoArr = [];
    FW_update.BlackStartLogoArr = [];

    if (typeof SerialConnection.connection.connectionId !== 'undefined')
        chrome.serial.disconnect(SerialConnection.connection.connectionId, function () { });

    if (SerialConnection.connectionErr < 10)
        ChangeDisplay(99);

    clearInterval(loopInterval);

    $('#overview').empty();
    $('#toolbar').empty();

    // recheck for port changes
    chrome.serial.getDevices(function (ports) {
        checkPorts(ports, true);
    });

    interval_Speedup_Done = 0;
    clearInterval(loopInterval);
    loopInterval = setInterval(function () { Internal_Loop(); }, 50);

    UpdateSerialSection("disconnect");

    // cleanup
    $("#progressbar").hide();
    $('#overview').empty();
    $('#toolbar').empty();
    Gen_Menu_Buttons(-1, true);
}

function OW_activate() {
    activationActive = 1;
    deviceActivateId = 0;
}

function activationLoop() {
    if (waitForResponseID == 0) {
        while ((!(deviceActivateId in DEVICEs)) && deviceActivateId < 25) deviceActivateId++;
        if (DEVICE_types.find(x => x.id === DEVICEs[deviceActivateId].type).blOnly == true) {
            if (DEBUG) console.log("Device " + deviceActivateId + " is blOnly next.");
            deviceActivateId++;
        }
        if (deviceActivateId == 25) {
            activationActive = 0;
            return;
        }
        // collect activationkey //  DEVICEs[DEVICE_activate_ID].activationkey
        // 66007e000d50363146353920
        /*
                $.ajax({
                    url: "",
                    type: 'GET',
                    crossDomain: true,
                    success: function (data) {
                        if (DEBUG) console.log("Collect key from ");
                        //DEVICEs[ESCactivateID].activationkey = data;
                    },
                    error: function (data) {
                        if (DEBUG) console.log("ERROR on collect key")
                        $(".ui-notification-container").notification("create", {
                            title: "Unable to activate",
                            content: "Activation require internet connection.",
                        });
        
                    }
                }); 
                */
        if (switchStatus == 0) {
            // request
            if (DEBUG) console.log("DEVICE " + deviceActivateId + " send OK_OK cmd");
            send_OneWire_package(deviceActivateId, 0, [OW_OK]);
            waitForResponseID = deviceActivateId;
            waitForResponseType = 0;
            waitForResponseLength = 7;
        } else {
            if (DEBUG) console.log("DEVICE " + deviceActivateId + " send OW_GET_ACTIVATION cmd");
            send_OneWire_package(deviceActivateId, 0, [OW_GET_ACTIVATION]);
            waitForResponseID = deviceActivateId;
            waitForResponseType = 0;
            waitForResponseLength = 7;
        }
    } else {
        var responsePackage = checkForRespPackage();
        if (responsePackage) {
            timeoutDeviceIDs[deviceActivateId] = 0;
            if (switchStatus == 0) {
                if (responsePackage[0] == OW_RESPONSE_IN_FW) {
                    switchStatus++;
                    waitForResponseID = 0;
                    if (DEBUG) console.log("DEVICE " + deviceActivateId + " is in firmware");
                } else {
                    if (switchProblem == 0) {
                        if (DEBUG) console.log("DEVICE " + deviceActivateId + " send OW_BL_START_FW cmd");
                        send_OneWire_package(deviceActivateId, 0, [OW_BL_START_FW]);
                        if (connectionType == VCP) {
                            if (DEBUG) console.log("starting reconnect procedure 1");
                            ReconnectOnSend(0);
                        }
                        switchProblem++;
                        waitLoops = 20;
                    } else if (switchProblem < 20) {
                        if (DEBUG) console.log("ESC with id: " + deviceActivateId + " don't switches ->retry");
                        send_OneWire_package(deviceActivateId, 0, [switchCommand]);
                        switchProblem++;
                        waitLoops = 20;
                    } else {
                        if (DEBUG) console.log("DEVICE with id: " + deviceActivateId + " don't switches ->stop");
                        serialBadError = 1;
                        switchProblem = 0;
                    }
                }
            } else if (switchStatus == 1) {
                DEVICEs[deviceActivateId].activated = (responsePackage[5]);
                if (DEBUG) console.log("DEVICE " + deviceActivateId + " response is " + DEVICEs[deviceActivateId].activated);
                switchStatus++;
            } else if (switchStatus == 2) {
                if (DEVICEs[deviceActivateId].activated == 0) {
                    if (DEBUG) console.log("Activating DEVICE " + deviceActivateId + " with key " + DEVICEs[deviceActivateId].activationkey);
                    // -6F0A6E67
                    send_OneWire_package(deviceActivateId, 0, [OW_SET_ACTIVATION, -0x6F, 0x0A, 0x6E, 0x67]); // need to replace with proper key
                    waitForResponseID = deviceActivateId;
                    waitForResponseType = 0;
                    waitForResponseLength = 7;
                    switchStatus++;
                } else {
                    if (DEBUG) console.log("DEVICE " + deviceActivateId + " is already activated.");
                    switchStatus = 0;
                    deviceActivateId++;
                }
            } else if (switchStatus == 3) {
                if (responsePackage[5] == OW_OK) {
                    if (DEBUG) console.log("DEVICE " + deviceActivateId + " response OK.");
                    if (DEBUG) console.log("DEVICE " + deviceActivateId + " send OW_GET_ACTIVATION cmd");
                    send_OneWire_package(deviceActivateId, 0, [OW_GET_ACTIVATION]);
                    waitForResponseID = deviceActivateId;
                    waitForResponseType = 0;
                    waitForResponseLength = 7;
                    switchStatus++;
                } else {
                    if (DEBUG) console.log("DEVICE " + deviceActivateId + " activation wrong response: " + responsePackage[5]);
                }
                switchStatus = 0;
                deviceActivateId++;
            } else if (switchStatus == 4) {
                console.log(responsePackage);
                switchStatus = 0;
                deviceActivateId++;
            }
        } else if (++timeoutDeviceIDs[deviceActivateId] == DEFAULT_TIMEOUT || timeoutDeviceIDs[deviceActivateId] == DEFAULT_TIMEOUT * 2 || timeoutDeviceIDs[deviceActivateId] == DEFAULT_TIMEOUT * 3) {
            sendBytes(LastSentData);
            if (DEBUG) console.log("no response, retrying");
        } else if (timeoutDeviceIDs[deviceActivateId] > DEFAULT_TIMEOUT * 3) {
            if (DEBUG) console.log("no response from DEVICE with id: " + deviceActivateId + " ->stop");
            serialBadError = 1;
            waitForResponseID = 0;
            deviceActivateId++;
        }
    }
}

//===================================================================================== a slow loop to check com ports and stuff

function Internal_Loop() {
    if (noLoop) return;
    if (waitLoops > 0) {
        waitLoops--;
        return;
    }

    if (serialBadError && communicationErrorWarningDone == 0) {
        communicationErrorWarningDone = 1;
        if (DEBUG) console.log("Many serial comm errors");
        $("#dialog").text("Many serial communication errors occurred! Proper functionality cannot be granted.");
        $("#dialog").dialog({
            modal: true,
            buttons: {
                Ok: function () {
                    $(this).dialog("close");
                    serialBadError = 0;
                }
            }
        });
    }
    if (SerialConnection.connected == 0) { // check for changed Com Ports (only if not connected)
        chrome.serial.getDevices(function (ports) {
            checkPorts(ports);
        });
    } else if (SerialConnection.connected == 1) {
        if (ptStatus != 0) {
            if (ptStatus == 1) {
                switch (connectionType) {
                    case KISS_PT:
                        var getPT = kissProtocol_preparePassthrough();
                        sendBytes(getPT);
                        if (DEBUG) console.log("Requested KISS passthrough via " + getPT);
                        waitLoops = 40;
                        break;
                    case BF_PT:
                        SerialConnection.RX_tail = SerialConnection.RX_head;
                        var getPT = bfProtocol_preparePassthrough();
                        sendBytes(getPT);
                        if (DEBUG) console.log("Requested BF passthrough");
                        waitLoops = 40;
                        break
                    case USB_UART:
                        if (DEBUG) console.log("UART connected");
                        break;
                    case VCP:
                        var getPT = usb_prepareReset();
                        sendBytes(getPT);
                        ReconnectOnSend(0);
                        if (DEBUG) console.log("VCP requested reset ");
                        waitLoops = 40;
                        break;
                }
                do_not_Update_Progress_Bar = 0;
                ptStatus = 2;
            } else if (ptStatus == 2 && connection_attempts < MAX_TRY) {
                connection_attempts++;
                switch (connectionType) {
                    case KISS_PT:
                        if (SerialAvailable() < 2) {
                            if (DEBUG) console.log("no response from KISS FC, retry");
                            ptStatus = 1;
                            do_not_Update_Progress_Bar = 1;
                        } else {
                            var testByte = readBytes(2);
                            if (testByte[0] == 88 && testByte[1] == 1) {
                                changeBaud(921600);
                                if (DEBUG) console.log("passthrough active!");
                                waitLoops = 20;
                                ptStatus = 3;
                            } else {
                                if (DEBUG) console.log("wrong response from KISS FC, retry");
                                ptStatus = 1;
                                do_not_Update_Progress_Bar = 1;
                            }
                        }
                        break;
                    case BF_PT:
                        if (SerialAvailable()) {
                            ptStatus = 4;
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
                                        ptStatus = 3;
                                    },
                                    Cancel: function () {
                                        $(this).dialog("close");
                                        ptStatus = 0;
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
            } else if (connection_attempts = MAX_TRY && ptStatus != 4) {
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
                            switch (connectionType) {
                                case KISS_PT:
                                    changeBaud(921600);
                                    if (DEBUG) console.log("passthrough active!");
                                    waitLoops = 20;
                                    ptStatus = 3;
                                    break;
                                case BF_PT:
                                    changeBaud(115200);
                                    if (DEBUG) console.log("passthrough active!");
                                    waitLoops = 5;
                                    ptStatus = 3;
                                    break;
                            }
                            noLoop = 0;
                        },
                        Cancel: function () {
                            $(this).dialog("close");
                            // disconnect + cleanup
                            disconnect();
                            noLoop = 0;
                        }
                    }
                });
                return;
            }
            if (!do_not_Update_Progress_Bar) {
                var current_progress = Math.round(100 / 4 * (ptStatus + 1));
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
            ScanForDevices();
        } else if (!devicesDisplayed) {
            displayDevices(document.getElementById("overview"));
            devicesDisplayed = 1;
            // Enable Disconnect
            Gen_Menu_Buttons(selectedMenu, false);
        } else if (!firmwareUpdaterInitDone) {
            initFWUpdater();
            change_Devices_status(0, 1, 0);
            firmwareUpdaterInitDone = 1;
        }
    }
    if (SerialConnection.connected == 1) {
        if (devicesToBL) {
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
            if (activationActive == 1) {
                activationLoop();
            }
        }
    }
}

//===================================================================================== Switch from Bootloader to Firmware and back

function change_Devices_status(stat, enableButtonsIfDone = 0, refreshVersionIfDone = 0) {
    disableButtons();
    switchDeviceId = 0;
    switchProblem = 0;
    enableButtonsAfterSwitch = enableButtonsIfDone;
    refreshVersion = refreshVersionIfDone;
    if (stat == 0) {
        expectedHeader = OW_RESPONSE_IN_BL;
        switchCommand = OW_RESET_TO_BL;
        if (DEBUG) console.log("changing status to Bootloader");
    } else {
        expectedHeader = OW_RESPONSE_IN_FW;
        switchCommand = OW_BL_START_FW;
        if (DEBUG) console.log("changing status to Firmware");
    }
    switchStatus = 0;
    devicesToBL = 1;
}

function check_ESCs_In_BL() {
    if (waitLoops > 0) {
        waitLoops--;
        return;
    }
    if (reconnectOnTxDone != 0 && connectionType == VCP) return;

    if (waitForResponseID == 0) {
        while ((!(switchDeviceId in DEVICEs)) && switchDeviceId < 25) switchDeviceId++;
        if (switchDeviceId == 25) {
            devicesToBL = 0;
            if (refreshVersion) {
                refreshVersion = 0;
                document.getElementById("overview").innerHTML = "";
                displayDevices(document.getElementById("overview"));
            }
            if (enableButtonsAfterSwitch) {
                enableButtons();
                enableButtonsAfterSwitch = 0;
            }
            return;
        }

        if ((DEVICE_types.find(x => x.id === DEVICEs[switchDeviceId].type)).blOnly == true) {
            switchStatus = 0;
            switchDeviceId++;
            return;
        }

        if (switchStatus == 0) {
            send_OneWire_package(switchDeviceId, 0, [OW_OK]);
            waitForResponseID = switchDeviceId;
            waitForResponseType = 0;
            waitForResponseLength = 7;
            if (DEBUG) console.log("check with id: " + switchDeviceId + " ");
        } else {
            if (refreshVersion) {
                send_OneWire_package(switchDeviceId, 0, [OW_REQ_SW_VER]);
                waitForResponseID = switchDeviceId;
                waitForResponseType = 0;
                waitForResponseLength = 8;
                if (DEBUG) console.log("check FW version with id: " + switchDeviceId + " ");
            } else {
                switchStatus = 0;
                switchDeviceId++;
            }
        }
    } else {
        var responsePackage = checkForRespPackage();
        if (responsePackage) {
            timeoutDeviceIDs[switchDeviceId] = 0;
            if (switchStatus == 0) {
                if (responsePackage[0] == expectedHeader) {
                    if (expectedHeader == OW_RESPONSE_IN_BL) DEVICEs[switchDeviceId].asBL = true;
                    else DEVICEs[switchDeviceId].asBL = false;
                    if (DEBUG) console.log("DEVICE with id: " + switchDeviceId + " is ready");
                    switchStatus++;
                } else {
                    if (expectedHeader != OW_RESPONSE_IN_BL) DEVICEs[switchDeviceId].asBL = false;
                    else DEVICEs[switchDeviceId].asBL = true;
                    if (switchProblem == 0) {
                        if (DEVICE_types.find(x => x.id === DEVICEs[switchDeviceId].type).blOnly == true) return
                        if (DEBUG) console.log("switching DEVICE with id: " + switchDeviceId);
                        send_OneWire_package(switchDeviceId, 0, [switchCommand]);
                        if (connectionType == VCP) {
                            if (DEBUG) console.log("starting reconnect procedure 1");
                            ReconnectOnSend(0);
                        }
                        switchProblem++;
                        waitLoops = 20;
                    } else if (switchProblem < 20) {
                        if (DEBUG) console.log("DEVICE with id: " + switchDeviceId + " don't switches ->retry");
                        send_OneWire_package(switchDeviceId, 0, [switchCommand]);
                        switchProblem++;
                        waitLoops = 20;
                    } else {
                        if (DEBUG) console.log("DEVICE with id: " + switchDeviceId + " don't switches ->stop");
                        serialBadError = 1;
                        switchDeviceId++;
                        switchProblem = 0;
                    }
                }
            } else {
                DEVICEs[switchDeviceId].version = (responsePackage[5] / 10);
                DEVICEs[switchDeviceId].subversion = (responsePackage[6] / 100);
                if (DEBUG) console.log("DEVICE with id: " + switchDeviceId + " software version is: " + DEVICEs[switchDeviceId].version + "." + DEVICEs[switchDeviceId].subversion);
                switchStatus = 0;
                switchDeviceId++;
            }
        } else if (++timeoutDeviceIDs[switchDeviceId] == DEFAULT_TIMEOUT || timeoutDeviceIDs[switchDeviceId] == DEFAULT_TIMEOUT * 2 || timeoutDeviceIDs[switchDeviceId] == DEFAULT_TIMEOUT * 3) {
            sendBytes(LastSentData);
            if (DEBUG) console.log("no response, retrying");
        } else if (timeoutDeviceIDs[switchDeviceId] > DEFAULT_TIMEOUT * 3) {
            if (DEBUG) console.log("no response from DEVICE with id: " + switchDeviceId + " ->stop");
            serialBadError = 1;
            waitForResponseID = 0;
            switchDeviceId++;
        }
    }
}

function refresh_displayed_version() {
}

//===================================================================================== Display handling

function ChangeDisplay(displayType) {
    if (menuEnabled == 0 || scanDone == 0) return;

    var only_flash = 1;
    $.each(DEVICEs, function (index, device) {
        if (device !== undefined) {
            if (DEVICE_types.find(x => x.id === device.type).blOnly != true)
                only_flash = 0
        }
    })

    if (only_flash == 1 && displayType != 0 && SerialConnection.connected != false) {
        $("#dialog").text("Connected devices only support firmware flashing.");
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
    if ((scanDone == 0 && displayType != 0) || (DEVICEs.length == 0 && displayType == 0) && displayType != 99) {
        $("#dialog").text("Select a COM port first, to scan for available ESC's !");
        $("#dialog").dialog({
            modal: true,
            buttons: {
                Ok: function () {
                    $(this).dialog("close");
                }
            }
        });
    } else if (DEVICEs.length == 0 && displayType != 99) {
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
            for (var i in DEVICEs) {
                if (DEVICE_types.find(x => x.id === DEVICEs[i].type).blOnly == true) break;
                if (minID == 0) minID = i;
                maxID = i;
                ID_count++;
            }
            if ((maxID - minID) + 1 > ID_count) {
                $("#dialog").text("DEVICE telemetry cannot be displayed because ID's have gaps. please change the ID's to be in a row.");
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
        for (var i in DEVICEs) {
            DEVICEs[i].settingsActive[8] = 0;
            DEVICEs[i].settingsActive[9] = 0;
            DEVICEs[i].DeviceSettings[0].active = 0;
        }
        $('#overview').empty();
        $('#toolbar').empty();
        if (displayType != 99) {
            selectedMenu = displayType;
            Gen_Menu_Buttons(selectedMenu, false);
        }
        if (displayType == 0) document.getElementById('toolbar').style.display = "block";
        else document.getElementById('toolbar').style.display = "none";

        displayDevices(document.getElementById("overview"));

        switch (displayType) {
            case 0:
                initFWUpdater();
                change_Devices_status(0, 1, 0);
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

//===================================================================================== DEVICE communication

function checkForRespPackage() {
    var responsePackage = [];
    while (SerialAvailable()) {
        var testByte = readByte();
        if (responseIndex == 0 && testByte != 2 && testByte != 3) continue;
        if (responseIndex == 1 && waitForResponseID != testByte) {
            responseIndex = 0;
            continue;
        }

        if (responseIndex == 3 && waitForResponseType != ((testByte << 8) | RespBuf[2])) {
            responseIndex = 0;
            continue;
        }
        if (responseIndex == 4) {
            getLength = testByte;
        }
        RespBuf[responseIndex++] = testByte;
        if (responseIndex == getLength && responseIndex > 4) {
            if (getCRC(RespBuf, getLength - 1) == RespBuf[getLength - 1]) {
                for (var i = 0; i < getLength; i++) responsePackage[i] = RespBuf[i];
                if (DEBUG) console.log("valid package with " + getLength + "bytes received");
            }
            responseIndex = 0;
            getLength = 5;
            waitForResponseID = 0;
            waitForResponseType = 0;
            waitForResponseLength = 0;
        }
    }
    if (responsePackage.length > 1) {
        if (SERIALDEBUG) console.log("RCV: " + responsePackage)
        return responsePackage;
    }
    else return false;
}

function ScanForDevices() {
    var current_progress = Math.round(100 / 24 * scanID);
    $("#progressbar").progressbar({
        value: current_progress
    });
    $(".progress-label").text("Scanning for devices " + current_progress + "%");

    if (!waitForResponseID) {
        if (scanStep == 0) { // look for ID
            timeoutDeviceIDs[scanID] = 0;
            send_OneWire_package(scanID, 0, [OW_OK]);
            waitForResponseID = scanID;
            waitForResponseType = 0;
            waitForResponseLength = 7;
            if (DEBUG) console.log("scan for ID: " + scanID);
        } else if (scanStep == 1) { //get Type
            timeoutDeviceIDs[scanID] = 0;
            send_OneWire_package(scanID, 0, [OW_REQ_TYPE]);
            waitForResponseID = scanID;
            waitForResponseType = 0;
            waitForResponseLength = 7;
            if (DEBUG) console.log("request version of DEVICE with ID: " + scanID);
        } else if (scanStep == 2) { //get version
            timeoutDeviceIDs[scanID] = 0;
            send_OneWire_package(scanID, 0, [OW_REQ_SW_VER]);
            waitForResponseID = scanID;
            waitForResponseType = 0;
            waitForResponseLength = 8;
            if (DEBUG) console.log("request type of DEVICE with ID: " + scanID);
        } else if (scanStep == 3) { //get SN
            timeoutDeviceIDs[scanID] = 0;
            send_OneWire_package(scanID, 0, [OW_REQ_SN]);
            waitForResponseID = scanID;
            waitForResponseType = 0;
            waitForResponseLength = 18;
            if (DEBUG) console.log("request Serialnumber of DEVICE with ID: " + scanID);
        }
    } else {
        var responsePackage = checkForRespPackage();
        if (responsePackage) {
            if (responsePackage[1] == scanID) {
                timeoutDeviceIDs[scanID] = 0;
                if (scanStep == 0) {
                    DEVICEs[scanID] = new DEVICE();
                    DEVICEs[scanID].id = scanID;
                    DEVICEs[scanID].asBL = (responsePackage[0] == OW_RESPONSE_IN_BL);
                    if (DEBUG) console.log("found ID: " + DEVICEs[scanID].id + ", is a bootloader: " + DEVICEs[scanID].asBL);
                    scanStep = 1;
                    ScanForDevices();
                } else if (scanStep == 1) {

                    DEVICEs[scanID].type = responsePackage[5];
                    if (DEVICEs[scanID].type == 128) {
                        is_USB_only_bootloader = 1;
                        if (DEBUG) console.log("Board type is USB bootloader only!");
                    }

                    if (DEBUG) console.log("DEVICE with id: " + scanID + " is from type: " + DEVICEs[scanID].type);
                    scanStep = 2;
                    ScanForDevices();
                } else if (scanStep == 2) {

                    DEVICEs[scanID].version = (responsePackage[5] / 10);
                    DEVICEs[scanID].subversion = (responsePackage[6] / 100);

                    if (DEBUG) console.log("DEVICE with id: " + scanID + " software version is: " + DEVICEs[scanID].version + "." + DEVICEs[scanID].subversion);
                    scanStep = 3;
                    ScanForDevices();
                } else if (scanStep == 3) {

                    for (var i = 0; i < 12; i++) DEVICEs[scanID].SN[i] = responsePackage[i + 5];

                    if (DEBUG) {
                        console.log("DEVICE with id: " + scanID + " serialnumber is: ");
                        console.log(DEVICEs[scanID].SN);
                    }
                    scanStep = 0;
                    if (++scanID == 25) {
                        $("#progressbar").hide();
                        scanDone = 1;
                        scanID = 1;
                        enableButtons();
                        return;
                    }
                    ScanForDevices();
                }
            }
        } else if (++timeoutDeviceIDs[scanID] > 0) {
            if (timeoutDeviceIDs[scanID] == 5 || timeoutDeviceIDs[scanID] == 10) {
                sendBytes(LastSentData);
                if (DEBUG) console.log("no response from DEVICE with id: " + scanID + " ->retry");
            } else if (timeoutDeviceIDs[scanID] > 15) {
                timeoutDeviceIDs[scanID] = 0;
                if (DEBUG) console.log("no response from DEVICE with id: " + scanID + " ->stop");
                waitForResponseID = 0;
                scanStep = 0;
                if (++scanID == 25) {
                    $("#progressbar").hide();
                    scanDone = 1;
                    scanID = 1;
                    if (DEVICEs.length == 0) {
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
                } else ScanForDevices();
            }
        }
    }
}

//===================================================================================== Display ESC's

function displayDevices(ParentElement) {
    for (var i in DEVICEs) {
        var DeviceDiv = document.createElement('div');
        Gen_Menu_Buttons(selectedMenu, false);
        if (selectedMenu == 0) {
            DeviceDiv.id = "Device_container_" + i;
            if (DEVICEs[i].selected || selectedMenu != 0)
                DeviceDiv.className = "Device_active";
            else
                DeviceDiv.className = "Device_inactive";

            var DeviceIdDiv = document.createElement('div');
            DeviceIdDiv.className = "Device_Info_id";
            DeviceIdDiv.innerHTML = DEVICEs[i].id;
            DeviceDiv.appendChild(DeviceIdDiv);

            var DeviceInfoDiv = document.createElement('div');
            DeviceInfoDiv.className = "Device_Info_div";
            DeviceDiv.appendChild(DeviceInfoDiv);

            var DeviceTypeDiv = document.createElement('div');
            DeviceTypeDiv.className = "Device_Info_type";
            DeviceTypeDiv.innerHTML = DEVICE_types.find(x => x.id === DEVICEs[i].type).name;
            DeviceInfoDiv.appendChild(DeviceTypeDiv);

            var DeviceVersionDiv = document.createElement('div');
            DeviceVersionDiv.className = "Device_Info_version";
            DeviceVersionDiv.innerHTML = "FW. ver. : " + DEVICEs[i].version + "-" + DEVICEs[i].subversion;
            DeviceInfoDiv.appendChild(DeviceVersionDiv);

            var DeviceSerialDiv = document.createElement('div');
            DeviceSerialDiv.className = "Device_Info_sn";
            DeviceSerialDiv.innerHTML = "SN: ";
            for (var y = 0; y < 12; y++)
                DeviceSerialDiv.innerHTML += dec2hex(DEVICEs[i].SN[y]) + " ";
            DeviceInfoDiv.appendChild(DeviceSerialDiv);

            var DeviceSelectDiv = document.createElement('div');
            DeviceSelectDiv.className = "Device_Info_select";
            DeviceInfoDiv.appendChild(DeviceSelectDiv);

            DEVICEs[i].Device_select_Input = document.createElement('input');
            DEVICEs[i].Device_select_Input.type = "checkbox";
            DEVICEs[i].Device_select_Input.id = "device_select_id_" + i;
            if (DEVICEs[i].selected)
                DEVICEs[i].Device_select_Input.checked = true;
            else DEVICEs[i].Device_select_Input.checked = false;
            DEVICEs[i].Device_select_Input.onclick = function () {
                var ownId = this.id.replace(/device_select_id_/, "");
                var targetDevice = DEVICEs[ownId];
                var divContainer = document.getElementById("Device_container_" + ownId);
                if (!targetDevice.selected) {
                    targetDevice.selected = true;
                    this.checked = true;
                    divContainer.className = "Device_active";
                } else {
                    targetDevice.selected = false;
                    this.checked = false;
                    divContainer.className = "Device_inactive";
                }
            }

            setting_Checkbox_label = document.createElement('label');
            setting_Checkbox_label.htmlFor = "device_select_id_" + i;
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

            DeviceSelectDiv.appendChild(DEVICEs[i].Device_select_Input);
            DeviceSelectDiv.appendChild(setting_Checkbox_label);

            DEVICEs[i].loadingBar = document.createElement('div');
            DEVICEs[i].loadingBar.id = "Device_Info_progress_bar_" + i;
            DeviceDiv.appendChild(DEVICEs[i].loadingBar);
        } else if (selectedMenu == 1) {
            // ---------------------------------------------------------------------------------------------------// settings
            // DeviceSettings
            if (DEVICE_types.find(x => x.id === DEVICEs[i].type).blOnly == true) break;
            DeviceDiv.id = "Device_container_" + i;

            DeviceDiv.className = "settings_container";

            var DeviceIdDiv = document.createElement('div');
            DeviceIdDiv.className = "Device_Info_id";
            DeviceIdDiv.innerHTML = DEVICEs[i].id;
            DeviceDiv.appendChild(DeviceIdDiv);

            var DeviceInfoDiv = document.createElement('div');
            DeviceInfoDiv.className = "Device_settings_div";
            DeviceDiv.appendChild(DeviceInfoDiv);

            for (var y in DEVICEs[i].DeviceSettings) {
                // Type decision
                switch (DEVICEs[i].DeviceSettings[y].type) {
                    case "checkbox":
                        var DeviceSetting = document.createElement('div');
                        DeviceSetting.className = "setting_container";
                        if (DEVICEs[i].DeviceSettings[y].eever > DEVICEs[i].DeviceSettings[0].active) DeviceSetting.style.display = "none";

                        DeviceSettingText = document.createElement('div')
                        DeviceSettingText.className = "setting_text";

                        DeviceSettingText.innerHTML = DEVICEs[i].DeviceSettings[y].name + " ";

                        DeviceSetting.appendChild(DeviceSettingText);
                        DeviceInfoDiv.appendChild(DeviceSetting);
                        settingCheckbox = document.createElement('input');
                        settingCheckbox.type = "checkbox";
                        settingCheckbox.id = DEVICEs[i].DeviceSettings[y].getCommand + "_setting_id_" + i;
                        settingCheckbox.onchange = function () {
                            SettingsChanged(this.id);
                        }
                        if (DEVICEs[i].DeviceSettings[y].active) {
                            settingCheckbox.checked = true;
                            DeviceSetting.className += " setting_container_active";
                        } else {
                            DeviceSetting.className += " setting_container_inactive";
                        }
                        DeviceSetting.appendChild(settingCheckbox);
                        setting_Checkbox_label = document.createElement('label');
                        setting_Checkbox_label.htmlFor = DEVICEs[i].DeviceSettings[y].getCommand + "_setting_id_" + i;
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

                        DeviceSetting.appendChild(setting_Checkbox_label);
                        break
                    case "slider":
                        var DeviceSetting = document.createElement('div');
                        DeviceSetting.className = "setting_container";
                        if (DEVICEs[i].DeviceSettings[y].eever > DEVICEs[i].DeviceSettings[0].active) DeviceSetting.style.display = "none";
                        DeviceSettingText = document.createElement('div')
                        DeviceSettingText.className = "setting_text";
                        DeviceSettingText.innerHTML = DEVICEs[i].DeviceSettings[y].name + " ";
                        DeviceSetting.appendChild(DeviceSettingText);
                        DeviceInfoDiv.appendChild(DeviceSetting);
                        settingSlider = document.createElement('input');
                        settingSlider.type = "range";
                        settingSlider.min = DEVICEs[i].DeviceSettings[y].min
                        settingSlider.max = DEVICEs[i].DeviceSettings[y].max
                        settingSlider.className = "settings_rangeSlider"; //  ui-corner-all
                        settingSlider.value = DEVICEs[i].DeviceSettings[y].active;
                        settingSlider.id = DEVICEs[i].DeviceSettings[y].getCommand + "_setting_id_" + i;
                        settingSlider.onchange = function () {
                            SettingsChanged(this.id);
                        }
                        settingSlider.oninput = function () {
                            var tmpid = this.id.replace(/setting_id_/, "setting_id_value_")
                            document.getElementById(tmpid).value = document.getElementById(this.id).value
                        }
                        DeviceSetting.appendChild(settingSlider);
                        settingNumber = document.createElement('output');
                        settingNumber.className = "setting_value";
                        settingNumber.type = "hidden"
                        settingNumber.value = DEVICEs[i].DeviceSettings[y].active;
                        settingNumber.id = DEVICEs[i].DeviceSettings[y].getCommand + "_setting_id_value_" + i;
                        DeviceSetting.appendChild(settingNumber);

                        break
                    case "colorpick":
                        break
                    case "value":
                        var DeviceSetting = document.createElement('div');
                        DeviceSetting.className = "setting_container";
                        if (DEVICEs[i].DeviceSettings[y].eever > DEVICEs[i].DeviceSettings[0].active) DeviceSetting.style.display = "none";
                        DeviceSettingText = document.createElement('div')
                        DeviceSettingText.className = "setting_text";
                        DeviceSettingText.innerHTML = DEVICEs[i].DeviceSettings[y].name + " ";
                        DeviceSetting.appendChild(DeviceSettingText);
                        DeviceInfoDiv.appendChild(DeviceSetting);
                        settingNumber = document.createElement('input');
                        settingNumber.type = "number";
                        settingNumber.style.width = ((DEVICEs[i].DeviceSettings[y].max.toString(10).length * 12) + 5) + "px";
                        settingNumber.className = "settings_numberBox"; //  ui-corner-all
                        settingNumber.value = DEVICEs[i].DeviceSettings[y].active;
                        settingNumber.id = DEVICEs[i].DeviceSettings[y].getCommand + "_setting_id_" + i;
                        settingNumber.onchange = function () {
                            SettingsChanged(this.id);
                        }
                        DeviceSetting.appendChild(settingNumber);
                        break
                    case "readonly":
                        var DeviceSetting = document.createElement('div');
                        DeviceSetting.className = "setting_container";
                        DeviceSetting.style.display = "none";
                        DeviceSettingText = document.createElement('div')
                        DeviceSettingText.className = "setting_text";
                        DeviceSettingText.innerHTML = DEVICEs[i].DeviceSettings[y].name + " ";
                        DeviceSetting.appendChild(DeviceSettingText);
                        DeviceInfoDiv.appendChild(DeviceSetting);
                        settingNumber = document.createElement('input');
                        settingNumber.type = "number";
                        settingNumber.readOnly = true;
                        settingNumber.style.width = ((DEVICEs[i].DeviceSettings[y].max.toString(10).length * 12) + 20) + "px";
                        settingNumber.className = "settings_numberBox"; //  ui-corner-all
                        settingNumber.value = DEVICEs[i].DeviceSettings[y].active;
                        settingNumber.id = DEVICEs[i].DeviceSettings[y].getCommand + "_setting_id_" + i;
                        DeviceSetting.appendChild(settingNumber);
                        break;
                    default:
                }
            }

            DeviceSaveInput = document.createElement('input');
            DeviceSaveInput.type = "button";
            DeviceSaveInput.value = "Save";
            DeviceSaveInput.id = "device_save_id_" + i;
            DeviceSaveInput.className = "settings_save_button_inactive ui-button";
            DeviceSaveInput.onclick = function () {
                saveSettingsOfId(parseInt(this.id.replace(/device_save_id_/, "")));
            }
            DeviceDiv.appendChild(DeviceSaveInput);

        } else if (selectedMenu == 2) {
            // ---------------------------------------------------------------------------------------------------// tools
            if (DEVICE_types.find(x => x.id === DEVICEs[i].type).blOnly == true) break;
            DeviceDiv.id = "Device_Canvas_Container_" + i;

            var DeviceToolDiv = document.createElement('div');
            DeviceToolDiv.className = "canvas_header";
            DeviceDiv.appendChild(DeviceToolDiv);

            var DeviceCommandDiv = document.createElement('div');
            DeviceCommandDiv.className = "canvas_button_area";

            DeviceToolDiv.appendChild(DeviceCommandDiv);

            var DeviceName = document.createElement('div');
            DeviceName.className = "canvas_Device_name";
            DeviceName.innerHTML = DEVICEs[i].id;
            DeviceCommandDiv.appendChild(DeviceName);

            for (var setting in TLM_Device_Stats) {
                var NewSetting = document.createElement('button');

                if (DEVICEs[i].settingsActive[setting]) {
                    NewSetting.className = "button_active";
                } else {
                    NewSetting.className = "button_inactive";
                }
                NewSetting.id = "SE_" + i + "_" + setting;
                NewSetting.innerHTML = TLM_Device_Stats[setting];
                NewSetting.onclick = function () {
                    if (this.className == "button_inactive") {
                        CheckSetting(this.id.replace(/SE_/, ''), 1);
                        this.className = "button_active";
                    } else {
                        CheckSetting(this.id.replace(/SE_/, ''), 0);
                        this.className = "button_inactive";
                    }
                }
                DeviceCommandDiv.appendChild(NewSetting);
            }
            var clearDiv = document.createElement('div');
            clearDiv.className = "clear";
            DeviceCommandDiv.appendChild(clearDiv);

            var TLMnameDiv = document.createElement('div');
            TLMnameDiv.className = "canvas_legend_area";
            DeviceDiv.appendChild(TLMnameDiv);

            for (var y = 0; y < 8; y++) {
                var TLM_element = document.createElement('div');
                TLM_element.className = "canvas_legend_text canvas_element_" + y;
                TLM_element.innerHTML = TLM_Device_Stats[y] + " :"
                TLMnameDiv.appendChild(TLM_element);
                DEVICEs[i].TLMValueElements[y] = document.createElement('div');
                DEVICEs[i].TLMValueElements[y].id = "canvas_legend_value_" + y;
                DEVICEs[i].TLMValueElements[y].className = "canvas_element_" + y;
                DEVICEs[i].TLMValueElements[y].innerHTML = "0";
                TLMnameDiv.appendChild(DEVICEs[i].TLMValueElements[y]);
            }

            DEVICEs[i].TLMCanvasElement = document.createElement('CANVAS');
            DEVICEs[i].TLMCanvasElement.className = "canvas_area"
            DeviceDiv.appendChild(DEVICEs[i].TLMCanvasElement);


            var clearDiv = document.createElement('div');
            clearDiv.className = "clear";
            DeviceDiv.appendChild(clearDiv);

            // Throttle to start            
            var throttleContainerDiv = document.createElement('div');
            throttleContainerDiv.className = "throttle_bar_container";
            DeviceDiv.appendChild(throttleContainerDiv);


            var Throttle_word_div = document.createElement('div');
            Throttle_word_div.className = "throttle_word_div";
            Throttle_word_div.innerHTML = "Throttle :";

            ThrottleValueNumber = document.createElement('output');
            ThrottleValueNumber.className = "setting_value";
            ThrottleValueNumber.id = "throttle_id_value_text_" + i;
            ThrottleValueNumber.value = 0 + "%";
            Throttle_word_div.appendChild(ThrottleValueNumber);

            throttleContainerDiv.appendChild(Throttle_word_div);

            var DeviceThrottleDiv = document.createElement('div');
            DeviceThrottleDiv.className = "throttle_bar_div";
            throttleContainerDiv.appendChild(DeviceThrottleDiv);

            DEVICEs[i].ThrottleValue = document.createElement('input');
            DEVICEs[i].ThrottleValue.type = "range";
            DEVICEs[i].ThrottleValue.value = 0;
            DEVICEs[i].ThrottleValue.className = "ThrottleSlider";
            DEVICEs[i].ThrottleValue.min = -100;
            DEVICEs[i].ThrottleValue.max = 100;
            DEVICEs[i].ThrottleValue.id = "device_throttle_val_" + i;
            DEVICEs[i].ThrottleValue.addEventListener('input', function (evt) {
                var tmpDeviceVal = parseInt(this.valueAsNumber);
                var tmpDeviceId = parseInt(this.id.replace(/device_throttle_val_/, ''))
                if (DEVICEs[tmpDeviceId].settingsActive[8]) {
                    if (!DEVICEs[tmpDeviceId].settingsActive[9] && tmpDeviceVal < 0) {
                        // reverse not active prevent negative values
                        DEVICEs[tmpDeviceId].ThrottleValue.value = 0
                        DEVICEs[tmpDeviceId].commandedThrottle = 0
                        flash_button("SE_" + tmpDeviceId + "_9");
                    } else {
                        // update throttle value
                        DEVICEs[tmpDeviceId].commandedThrottle = tmpDeviceVal;
                    }
                } else {
                    // DEVICE not enabled
                    DEVICEs[tmpDeviceId].ThrottleValue.value = 0
                    flash_button("SE_" + tmpDeviceId + "_8");
                }
                document.getElementById("throttle_id_value_text_" + tmpDeviceId).value = DEVICEs[tmpDeviceId].ThrottleValue.value + "%";

            })
            DEVICEs[i].ThrottleValue.addEventListener('dblclick', function (evt) {
                var tmpDeviceId = parseInt(this.id.replace(/device_throttle_val_/, ''))
                DEVICEs[tmpDeviceId].ThrottleValue.value = 0
                DEVICEs[tmpDeviceId].commandedThrottle = 0
                document.getElementById("throttle_id_value_text_" + tmpDeviceId).value = DEVICEs[tmpDeviceId].ThrottleValue.value + "%";
            })

            DeviceThrottleDiv.appendChild(DEVICEs[i].ThrottleValue);
        }
        ParentElement.appendChild(DeviceDiv);
    }
}

function disableButtons() {
    Gen_Menu_Buttons(selectedMenu, true);
    for (var i in DEVICEs) {
        DEVICEs[i].Device_select_Input.disabled = true;
    }
    menuEnabled = 0;
    buttonsDisabled = 1;
}
function enableButtons() {
    Gen_Menu_Buttons(selectedMenu, false);
    for (var i in DEVICEs) {
        DEVICEs[i].Device_select_Input.disabled = false;
    }
    menuEnabled = 1;
    buttonsDisabled = 0;
}

//===================================================================================== FW update / hex file handling

function initFWUpdater() {
    $("#toolbar").append(
        $('<div/>').attr({ id: 'localFW', class: 'fileContainer' }).button().click(function () {
            if (DEBUG) console.log("LOCAL File Selected");
            $("#firmware_file_upload").val(null);
        }
        ));
    $("#localFW").append().html("<span>Local Firmware</span>");

    toolbar = document.getElementById("localFW");
    document.getElementById('toolbar').style.display = "block";
    FW_update.fileUploadInput = document.createElement('input');
    FW_update.fileUploadInput.type = "file";
    FW_update.fileUploadInput.id = "firmware_file_upload";
    FW_update.fileUploadInput.addEventListener('change', function (evt) {
        var fileLoaded = this.value.split('\\');
        FW_update.hexString = null;
        FW_update.loadedFileName = fileLoaded[fileLoaded.length - 1].replace(/^.*[\\\/]/, '');
        if (DEBUG) console.log('reading file: ' + FW_update.loadedFileName);
        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function (e) {
                FW_update.hexString = e.target.result;
                parseHexFile(FW_update.hexString);
                PrepareUpdate();
                $("#remoteFWSelect").remove()
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
                // TODO
                //loadGithubReleases("https://api.github.com/repos/lichtl/test/releases", function (data) {
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
                        $.each(release.assets, function (index2, asset) {
                            if (DEBUG) console.log("Processing firmware: " + asset.name);
                            var tmpTypes = []
                            $.each(DEVICEs, function (index, device) {
                                if (device !== undefined) {
                                    if (tmpTypes.includes(device.type)) {
                                    } else {
                                        tmpTypes.push(device.type)
                                        if (asset.name.endsWith(".hex") && asset.name.startsWith(DEVICE_types.find(x => x.id === device.type).filename)) {
                                            var release_name = DEVICE_types.find(x => x.id === device.type).name + " " + release.tag_name;
                                            if (release.prerelease == true)
                                                release_name += " (BETA)"
                                            if (asset.name.includes("_BLUPDATE_"))
                                                release_name += " BOOTLOADER"
                                            $('#remoteFWSelect').append($("<option/>", {
                                                value: asset.browser_download_url,
                                                text: release_name
                                            }));
                                        }
                                    }
                                }
                            })

                        });

                    });
                    // Create select menu
                    $("#remoteFWSelect").selectmenu();
                    $('#remoteFWSelect').selectmenu("refresh");
                    // on change remote select menu
                    $('#remoteFWSelect').on('selectmenuchange', function () {
                        var fw_url = $(this).val();
                        FW_update.loadedFileName = fw_url.substring(fw_url.lastIndexOf('/') + 1);

                        if (fw_url.startsWith("https://")) {
                            $.ajax({
                                url: fw_url,
                                type: 'GET',
                                crossDomain: true,
                                success: function (data) {
                                    if (DEBUG) console.log("Loaded remote DEVICE hex file " + fw_url + " Filename:" + FW_update.loadedFileName);
                                    self.pages = parseHexFile(data);
                                    PrepareUpdate();
                                },
                                error: function (data) {
                                    if (DEBUG) console.log("ERROR on download file " + fw_url)
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
    $.each(DEVICEs, function (index, device) {
        if (device !== undefined) {
            var tmpContainer = document.getElementById("Device_container_" + device.id);
            var tmpcheckBox = document.getElementById("device_select_id_" + device.id);
            if ((FW_update.loadedFileName).startsWith(DEVICE_types.find(x => x.id === device.type).filename)) {
                DEVICEs[device.id].selected = true
                tmpContainer.className = "Device_active";
                tmpcheckBox.checked = true
            } else {
                DEVICEs[device.id].selected = false
                tmpContainer.className = "Device_inactive";
                tmpcheckBox.checked = false
            }
        }
    })
    $('#FW_flash').remove();
    $("#FW_chPlogo").remove();
    $("#FW_chSlogo").remove();

    if (searchPilotLogo(FW_update.binaryString) == 1) { // Logo
        $("#toolbar").append(
            $('<button/>')
                .attr({ id: 'FW_chPlogo' })
                .button()
                .click(function () {
                    showLogoEditor(pilotLogoWidth, pilotLogoHeight, FW_update.WhitePilotLogoArr, FW_update.BlackPilotLogoArr, FW_update.WhitePilotLogoPos, FW_update.BlackPilotLogoPos);
                }))
            ;
        $("#FW_chPlogo").append().html("Pilot Logo");
    }

    if (DEBUG) {
        var StartLogo = searchStartLogo(FW_update.binaryString);
    }

    if (StartLogo == 1) { // Logo
        $("#toolbar").append(
            $('<button/>')
                .attr({ id: 'FW_chSlogo' })
                .button()
                .click(function () {
                    showLogoEditor(startLogoWidth, startLogoHeight, FW_update.WhiteStartLogoArr, FW_update.BlackStartLogoArr, FW_update.WhiteStartLogoPos, FW_update.BlackStartLogoPos);
                }))
            ;
        $("#FW_chSlogo").append().html("Start Logo");
    }
    if ($('#FW_flash').length == 0) {
        $("#toolbar").append(
            $('<button/>')
                .attr({ id: 'FW_flash' })
                .button()
                .click(function () {
                    PrepareHex2Pages(FW_update.binaryString);
                    StartFlashProcess();
                }))
            ;
        $("#FW_flash").append().html("Flash selected!");
    }

}

function StartFlashProcess() {
    if (FW_update.FlashProcessActive == 0) {
        FW_update.fileUploadInput.disabled = true;
        FW_update.startUpdateInput.disabled = true;
        // Disable disconnect
        flashDeviceId = 0;
        FW_update.FlashProcessActive = 1;
        afterFlashedDisplay = 0;
        disableButtons();
    }
}

function FlashProcessLoop() {
    while ((!(flashDeviceId in DEVICEs) || !DEVICEs[flashDeviceId].selected) && flashDeviceId < 25) flashDeviceId++;
    if (flashDeviceId != 25) {
        if (waitForResponseID == 0) {
            if (actDeviceFlashStat < 2) {
                if (actDeviceFlashStat == 0) {
                    if (DEBUG) console.log("Starting to flash DEVICE with ID: " + flashDeviceId + "...");
                    if (!DEVICEs[flashDeviceId].asBL) {
                        send_OneWire_package(flashDeviceId, 0, [OW_RESET_TO_BL]);
                        if (DEBUG) console.log("reset DEVICE with ID: " + flashDeviceId + " to bootloader");
                    }
                    actDeviceFlashStat = 1;
                } else {
                    send_OneWire_package(flashDeviceId, 0, [OW_OK]);
                    waitForResponseID = flashDeviceId;
                    waitForResponseType = 0;
                    waitForResponseLength = 7;
                    if (DEBUG) console.log("check if DEVICE with ID: " + flashDeviceId + " is in bootloader mode");
                }
            } else if (actDeviceFlashStat == 2) {
                send_OneWire_package(flashDeviceId, 0, [OW_BL_PAGES_TO_FLASH, (FW_update.pagesCount & 0xFF), (FW_update.pagesCount >> 8)]);
                actDeviceFlashPage = FW_update.pagesCount;
                waitForResponseID = flashDeviceId;
                waitForResponseType = 0;
                waitForResponseLength = 7;
                extraDelay = 1;
                if (DEBUG) console.log("sent to DEVICE with ID: " + flashDeviceId + " the block count that need to be flashed & erase flash command. ");
            } else if (actDeviceFlashStat == 3) {
                if (actDeviceFlashPage > 0) {
                    send_OneWire_package(flashDeviceId, actDeviceFlashPage, FW_update.preparedPages[actDeviceFlashPage - 1]);
                    if (DEBUG) console.log("sent to DEVICE with ID: " + flashDeviceId + " flash block number: " + actDeviceFlashPage);
                    waitForResponseID = flashDeviceId;
                    waitForResponseType = actDeviceFlashPage;
                    waitForResponseLength = 134;
                    $("#Device_Info_progress_bar_" + flashDeviceId).progressbar({
                        value: Math.round((99 - (99 / FW_update.pagesCount * actDeviceFlashPage)))
                    });
                } else {
                    $("#Device_Info_progress_bar_" + flashDeviceId).progressbar({
                        value: 100
                    });
                    if (DEBUG) console.log("DEVICE with ID: " + flashDeviceId + " update done");
                    actDeviceFlashStat = 0;
                    actDeviceFlashPage = 0;
                    DEVICEs[flashDeviceId].asBL = false;
                    flashDeviceId++;
                }
            } else if (actDeviceFlashStat == 4) {
                send_OneWire_package(flashDeviceId, 0, [OW_BL_PAGE_CORRECT]);
                waitForResponseID = flashDeviceId;
                waitForResponseType = 0;
                waitForResponseLength = 7;
                if (DEBUG) console.log("verification done, sended write command");
            }
        } else {
            var responsePackage = checkForRespPackage();
            if (responsePackage) {
                if (responsePackage[1] == flashDeviceId) {
                    timeoutDeviceIDs[flashDeviceId] = 0;
                    if (actDeviceFlashStat == 1) {
                        if (responsePackage[0] == OW_RESPONSE_IN_BL) {
                            DEVICEs[flashDeviceId].asBL = true;
                            if (DEBUG) console.log("DEVICE with ID: " + flashDeviceId + " is in bootloader mode");
                            actDeviceFlashStat = 2;
                        } else {
                            if (DEBUG) console.log("DEVICE with ID: " + flashDeviceId + " don't moves to bootloader!");
                            send_OneWire_package(flashDeviceId, 0, [OW_RESET_TO_BL]);
                            if (DEBUG) console.log("reset DEVICE with ID: " + flashDeviceId + " to bootloader");
                        }
                    } else if (actDeviceFlashStat == 2) {
                        if (responsePackage[5] == 0) {
                            if (DEBUG) console.log("DEVICE with ID: " + flashDeviceId + " confirmed flash erase");
                            actDeviceFlashStat = 3;
                            extraDelay = is_USB_only_bootloader;
                        } else {
                            if (DEBUG) console.log("DEVICE with ID: " + flashDeviceId + " reported error: " + responsePackage[5]);
                        }
                    } else if (actDeviceFlashStat == 3) {
                        if (DEBUG) console.log("received from DEVICE with ID: " + flashDeviceId + " block number: " + actDeviceFlashPage + " for verification.");
                        var verifyFailed = 0;
                        for (i = 0; i < 128; i++) {
                            if (FW_update.preparedPages[actDeviceFlashPage - 1][i] != responsePackage[i + 5]) {
                                verifyFailed = 1;
                                break;
                            }
                        }
                        if (verifyFailed == 0) {
                            actDeviceFlashStat = 4;
                            FlashProcessLoop();
                        } else {
                            if (DEBUG) console.log("verification failed");
                        }
                    } else if (actDeviceFlashStat == 4) {
                        if (responsePackage[5] == 0) {
                            if (DEBUG) console.log("page written.");
                            actDeviceFlashPage--;
                            actDeviceFlashStat = 3;
                            FlashProcessLoop();
                        } else {
                            if (DEBUG) console.log("page could not be written. error: " + responsePackage[5]);
                            // unable to write block 255 (require BL Update)
                            if (actDeviceFlashPage == 255 && responsePackage[5] == 2) {
                                if (DEBUG) console.log("Bootloader not supporting more than 255 pages ");
                                $("#dialog").text("This DEVICE doesn't have the latest bootloader and can't support this firmware. Please flash the available bootloader update. Once completed please flash again this version.");
                                flashDeviceId = 0;
                                FW_update.FlashProcessActive = 0;
                                $("#dialog").dialog({
                                    modal: true,
                                    buttons: {
                                        Ok: function () {
                                            $(this).dialog("close");
                                            FW_update.fileUploadInput.disabled = false;
                                            FW_update.startUpdateInput.disabled = false;
                                            change_Devices_status(0, 1, 1);
                                            $('#toolbar').empty();
                                            initFWUpdater(); //lets reset the
                                        }
                                    }
                                });

                            }
                            timeoutDeviceIDs[flashDeviceId] = 0;
                            actDeviceFlashStat = 2;
                            waitForResponseID = 0;
                            if (DEBUG) console.log("restarting flash process for DEVICE with ID :" + flashDeviceId);
                        }
                    }
                }
            } else if (++timeoutDeviceIDs[flashDeviceId] == DEFAULT_TIMEOUT + (350 * extraDelay) || timeoutDeviceIDs[flashDeviceId] == (DEFAULT_TIMEOUT * 2) + (500 * extraDelay) || timeoutDeviceIDs[flashDeviceId] == (DEFAULT_TIMEOUT * 3) + (650 * extraDelay)) {
                sendBytes(LastSentData);
                if (DEBUG) console.log("no response, retrying");
            } else if (timeoutDeviceIDs[flashDeviceId] > (DEFAULT_TIMEOUT * 3) + (800 * extraDelay)) {
                send_OneWire_package(flashDeviceId, 0xFFFF, [flashDeviceId + 10, flashDeviceId + 20]);
                timeoutDeviceIDs[flashDeviceId] = 0;
                actDeviceFlashStat = 2;
                waitForResponseID = 0;
                if (DEBUG) console.log("restarting flash process for DEVICE with ID :" + flashDeviceId);
            }
        }
    } else {
        if (afterFlashedDisplay == 0) {
            if (is_USB_only_bootloader == 0) {
                change_Devices_status(1);
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
            if (is_USB_only_bootloader == 0) change_Devices_status(0);
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
            flashDeviceId = 0;
            FW_update.FlashProcessActive = 0;
            FW_update.fileUploadInput.disabled = false;
            FW_update.startUpdateInput.disabled = false;
            if (is_USB_only_bootloader == 0) change_Devices_status(0, 1, 1);
            $('#toolbar').empty();
            initFWUpdater(); //lets reset the
        }
    }
}

//===================================================================================== Tools

function initTools() {
    throttleWarningDone = 0;
    devicesReady = 0;
    checkDEVICEsStats = 0;
    checkDeviceId = 0;

    // get max OneWire ID
    maxDeviceId = 0;
    minDeviceId = 25;
    for (var i in DEVICEs) {
        DEVICEs[i].readyForFastCommand = false;
        DEVICEs[i].commandedThrottle = 0;
        if (i > maxDeviceId) maxDeviceId = i;
        if (i < minDeviceId) minDeviceId = i;

        if (DEVICE_types.find(x => x.id === DEVICEs[i].type).blOnly != true) {
            DEVICEs[i].TLMCanvasCTX = DEVICEs[i].TLMCanvasElement.getContext("2d");
            GraphArr[i] = [];
            for (var j = 0; j < 8; j++) {
                GraphArr[i][j] = [];
                for (var k = 0; k < 121; k++) GraphArr[i][j][k] = 0;
            }
        }
    }
    change_Devices_status(1);
}

function sentFastThrottleSignal() {
    var throttle_Values = [];
    var throttleCommand = [];
    for (var i in DEVICEs) {
        if (DEVICEs[i].readyForFastCommand == true) {
            throttle_Values[i - 1] = (100 + DEVICEs[i].commandedThrottle) * 10;
        } else {
            throttle_Values[i - 1] = 1000;
        }
    }
    var startIndex = minDeviceId - 1;

    throttleCommand[0] = 128 | (lastRequestedTLM << 4);
    throttleCommand[0] |= ((throttle_Values[startIndex] >> 10) & 0x01) << 3;
    throttleCommand[0] |= 0x01;
    thrCommandFirstByte = throttleCommand[0];
    throttleCommand[1] = (((throttle_Values[startIndex] >> 7) & 0x07)) << 5;
    throttleCommand[1] |= ALL_ID;

    var actThrottleCommand = startIndex;
    var BitsLeftFromCommand = 7;
    var actByte = 2;
    var bitsFromByteLeft = 8;
    var bitsToAddLeft = (12 + (((maxDeviceId - minDeviceId) + 1) * 11)) - 16;
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
    var commandLength = Math.ceil((12 + (((maxDeviceId - minDeviceId) + 1) * 11)) / 8);
    lastCRC = getCRC(throttleCommand, commandLength);
    throttleCommand[commandLength] = lastCRC;
    sendBytes(throttleCommand, 1);
}

function ToolProcessLoop() {
    var blProblem = 0;
    if (devicesReady) {
        if (buttonsDisabled) enableButtons();
        var waitForTlmCount = (((maxDeviceId - minDeviceId) + 1) * 2) + onewire;
        if (SerialAvailable() == waitForTlmCount) {
            var last_CRC_byte_Valid = 1;
            if (onewire) {
                var last_CRC_byte = readByte();
                if (last_CRC_byte != lastCRC) last_CRC_byte_Valid = 0;
            }
            var TLM_bytes = readBytes(waitForTlmCount - onewire);
            if (last_CRC_byte_Valid && TLM_bytes[0] != lastCRC && TLM_bytes[waitForTlmCount - 1] != thrCommandFirstByte) {
                var readTlmByte = 0;
                for (var i in DEVICEs) {
                    DEVICEs[i].TLMValues[lastRequestedTLM] = (TLM_bytes[readTlmByte++] << 8) | TLM_bytes[readTlmByte++];
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
            // check for DEVICE error but wait some time
            for (var i in DEVICEs) {
                if (DEVICEs[i].warning == false) {

                    if (DEVICEs[i].TLMValues[4] == 7357) {
                        DEVICEs[i].warning = true;
                        var message = "";
                        switch (DEVICEs[i].TLMValues[2]) {
                            case 1000:
                                message = "Failure on LOW side FETs/gatedriver detected."
                                break;
                            case 2000:
                                message = "No motor detected or failure on HIGH side FETs/gatedriver"
                                break;
                            case 3000:
                                var detected_esc = (DEVICE_types.find(x => x.id === DEVICEs[i].TLMValues[5]).name)
                                var expected_esc = (DEVICE_types.find(x => x.id === DEVICEs[i].TLMValues[6]).name)
                                message = "Firmware mismatch to hardware.<br><br>Expected HW: " + expected_esc + "<br>Detected HW: " + detected_esc;
                                break;

                            default:
                                message = "An unexpected error occurred. (" + DEVICEs[i].TLMValues[2] + ")";
                                break;

                        }

                        $(".ui-notification-container").notification("create", {
                            title: "Problem on OneWire ID " + i + " detected",
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

        displayTLMValues(displayTLM++);
        if (displayTLM == 8) {
            displayTLM = 0;
        }
        start_check++;
        if (wait_for_TLM_loops == 0) {
            if (++lastRequestedTLM > 7) lastRequestedTLM = 0;
            sentFastThrottleSignal();
        }
    } else { // prepare ESC's for fast Command
        if (waitForResponseID == 0) {
            while ((!(checkDeviceId in DEVICEs)) && checkDeviceId < 25) checkDeviceId++;

            if (checkDeviceId == 25) {
                devicesReady = 1;
                return;
            }
            if (DEVICE_types.find(x => x.id === DEVICEs[checkDeviceId].type).blOnly == true) {
                checkDeviceId++;
                return;
            }

            if (checkDEVICEsStats == 0) {
                send_OneWire_package(checkDeviceId, 0, [OW_OK]);
                waitForResponseID = checkDeviceId;
                waitForResponseType = 0;
                waitForResponseLength = 7;
                if (DEBUG) console.log("check with id: " + checkDeviceId + " ");
            } else {
                send_OneWire_package(checkDeviceId, 0, [OW_SET_FAST_COM_LENGTH, (Math.ceil((12 + (((maxDeviceId - minDeviceId) + 1) * 11)) / 8) + 1), minDeviceId, (maxDeviceId - minDeviceId) + 1]);
                waitForResponseID = checkDeviceId;
                waitForResponseType = 0;
                waitForResponseLength = 7;
                if (DEBUG) console.log("set fast throttle for DEVICE with id: " + checkDeviceId + " ");
            }
        } else {
            var responsePackage = checkForRespPackage();
            if (responsePackage) {
                timeoutDeviceIDs[checkDeviceId] = 0;
                if (checkDEVICEsStats == 0) {
                    if ((responsePackage[0] & 0x07) == OW_RESPONSE_IN_FW) {
                        DEVICEs[checkDeviceId].asBL = false;
                        checkDEVICEsStats++;
                    } else {
                        DEVICEs[checkDeviceId].asBL = true;
                        if (blProblem == 0) {
                            if (DEBUG) console.log("DEVICE with id: " + checkDeviceId + " remains in bootloader mode ->retry");
                            send_OneWire_package(checkDeviceId, 0, [OW_BL_START_FW]);
                            blProblem = 1;
                        } else {
                            if (DEBUG) console.log("DEVICE with id: " + checkDeviceId + " remains in bootloader mode ->stop");
                            serialBadError = 1;
                            checkDeviceId++;
                            blProblem = 0;
                        }
                    }
                } else {
                    if (responsePackage[5] == OW_OK) {
                        DEVICEs[checkDeviceId].readyForFastCommand = true;
                        checkDEVICEsStats = 0;
                        checkDeviceId++;
                    }
                }
            } else if (++timeoutDeviceIDs[checkDeviceId] == DEFAULT_TIMEOUT || timeoutDeviceIDs[checkDeviceId] == DEFAULT_TIMEOUT * 2 || timeoutDeviceIDs[checkDeviceId] == DEFAULT_TIMEOUT * 3) {
                sendBytes(LastSentData);
                if (DEBUG) console.log("no response, retrying");
            } else if (timeoutDeviceIDs[checkDeviceId] > DEFAULT_TIMEOUT * 3) {
                if (DEBUG) console.log("no response from DEVICE with id: " + checkDeviceId + " ->stop");
                serialBadError = 1;
                waitForResponseID = 0;
                checkDEVICEsStats = 0;
                checkDeviceId++;
            }
        }
    }
}

function displayTLMValues(tlmVal) {
    for (var i in DEVICEs) {

        if (DEVICE_types.find(x => x.id === DEVICEs[i].type).blOnly == true) break;
        DEVICEs[i].TLMValueElements[tlmVal].innerHTML = DEVICEs[i].TLMValues[tlmVal] * TLM_scales[tlmVal];


        GraphArr[i][tlmVal].unshift((DEVICEs[i].TLMValues[tlmVal] / TLM_Graph_Scales[tlmVal]));
        GraphArr[i][tlmVal].pop();

        if (tlmVal == 0) {
            DEVICEs[i].TLMCanvasCTX.clearRect(0, 0, TLMcanvasWidth, TLMcanvasHeight);
            for (var j = 0; j < 8; j++) {
                if (DEVICEs[i].settingsActive[j]) {
                    DEVICEs[i].TLMCanvasCTX.beginPath();
                    DEVICEs[i].TLMCanvasCTX.moveTo(0, TLMcanvasHeight - GraphArr[i][j][0]);
                    for (var k = 1; k < 121; k++) {
                        DEVICEs[i].TLMCanvasCTX.lineTo(k * 5, TLMcanvasHeight - GraphArr[i][j][k]);
                    }
                    DEVICEs[i].TLMCanvasCTX.strokeStyle = colorFromCSSClass("canvas_element_" + j);
                    DEVICEs[i].TLMCanvasCTX.stroke();
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
    if (!active && (settingId == 8 || (settingId == 9 && DEVICEs[ESCid].commandedThrottle < 0))) {
        DEVICEs[ESCid].ThrottleValue.value = 0;
        DEVICEs[ESCid].commandedThrottle = 0;
    }
    DEVICEs[ESCid].settingsActive[settingId] = active;
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

function initConfig() {
    change_Devices_status(1);
    settingsRead = 0;
    readDeviceIDs = [];
    readDeviceSettings = [];
    deviceIdIndex = 0;
    deviceSettingIndex = 0;
    checkDEVICEsStats = 0;
    for (var IDs in DEVICEs) {
        if (DEVICE_types.find(x => x.id === DEVICEs[IDs].type).blOnly != true) {
            readDeviceIDs.push(IDs);
            timeoutDeviceIDs[IDs] = 0;
        }
    }
    for (var Settings in DEVICEs[readDeviceIDs[0]].DeviceSettings) {
        readDeviceSettings.push(Settings);
    }
}

function ConfigLoop() {
    var blProblem = 0;
    if (!settingsRead) {
        if (waitForResponseID == 0) {

            if (deviceSettingIndex == readDeviceSettings.length) {
                deviceSettingIndex = 0;
                deviceIdIndex++;
                checkDEVICEsStats = 0;
            }
            if (deviceIdIndex == readDeviceIDs.length) {
                settingsRead = 1;
                document.getElementById("overview").innerHTML = "";
                displayDevices(document.getElementById("overview"));
                if (buttonsDisabled) enableButtons();
                return;
            }
            if ((DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].eever != 0 && DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].eever > DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[0].active) || DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].DeviceTypes.indexOf(DEVICEs[readDeviceIDs[deviceIdIndex]].type) == -1) {
                deviceSettingIndex++;
                checkDEVICEsStats = 0;
                return;
            }
            if (checkDEVICEsStats == 0) {
                send_OneWire_package(readDeviceIDs[deviceIdIndex], 0, [OW_OK]);
                waitForResponseID = readDeviceIDs[deviceIdIndex];
                waitForResponseType = 0;
                waitForResponseLength = 7;
                if (DEBUG) console.log("check with id: " + readDeviceIDs[deviceIdIndex] + " ");
            } else {
                send_OneWire_package(readDeviceIDs[deviceIdIndex], 0, [DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].getCommand]);
                waitForResponseID = readDeviceIDs[deviceIdIndex];
                waitForResponseType = 0;
                waitForResponseLength = 6 + DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount;
                if (DEBUG) console.log("requesting Setting " + DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].name + " with command " + DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].getCommand + " from DEVICE with id: " + readDeviceIDs[deviceIdIndex] + " ");
            }
        } else {
            var responsePackage = checkForRespPackage();
            if (responsePackage) {
                timeoutDeviceIDs[readDeviceIDs[deviceIdIndex]] = 0;
                if (checkDEVICEsStats == 0) {
                    if ((responsePackage[0] & 0x07) == OW_RESPONSE_IN_FW) {
                        DEVICEs[readDeviceIDs[deviceIdIndex]].asBL = false;
                        checkDEVICEsStats++;
                    } else {
                        DEVICEs[readDeviceIDs[deviceIdIndex]].asBL = true;
                        if (blProblem == 0) {
                            if (DEBUG) console.log("DEVICE with id: " + readDeviceIDs[deviceIdIndex] + " remains in bootloader mode ->retry");
                            send_OneWire_package(readDeviceIDs[deviceIdIndex], 0, [OW_BL_START_FW]);
                            blProblem = 1;
                        } else {
                            if (DEBUG) console.log("DEVICE with id: " + readDeviceIDs[deviceIdIndex] + " remains in bootloader mode ->stop");
                            serialBadError = 1;
                            checkDeviceId++;
                            blProblem = 0;
                        }
                    }
                } else {
                    if (DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 1) {
                        DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].active = responsePackage[5];
                    } else if (DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 2) {
                        DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].active = (responsePackage[5] << 8) | responsePackage[6];
                    } else if (DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 4) {
                        DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].active = (responsePackage[5] << 24) | (responsePackage[6] << 16) | (responsePackage[7] << 8) | responsePackage[8];
                    }
                    checkDEVICEsStats = 0;
                    if (DEBUG) console.log("Setting " + DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].name + " from DEVICE with id: " + readDeviceIDs[deviceIdIndex] + " is " + DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].active + " bytecound: " + DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount);
                    deviceSettingIndex++;
                }
            } else if (++timeoutDeviceIDs[readDeviceIDs[deviceIdIndex]] == DEFAULT_TIMEOUT || timeoutDeviceIDs[readDeviceIDs[deviceIdIndex]] == DEFAULT_TIMEOUT * 2 || timeoutDeviceIDs[readDeviceIDs[deviceIdIndex]] == DEFAULT_TIMEOUT * 3) {
                sendBytes(LastSentData);
                if (DEBUG) console.log("no response, retrying");
            } else if (timeoutDeviceIDs[readDeviceIDs[deviceIdIndex]] > DEFAULT_TIMEOUT * 3) {
                if (DEBUG) console.log("no response from DEVICE with id: " + readDeviceIDs[deviceIdIndex] + " ->stop");
                serialBadError = 1;
                waitForResponseID = 0;
                checkDEVICEsStats = 0;
                deviceIdIndex++;
            }
        }
        // save settings
    } else if (saveNewSettingsToId) {
        if (waitForResponseID == 0) {
            while (deviceSettingIndex < readDeviceSettings.length && DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].changed == false) deviceSettingIndex++;
            if (deviceSettingIndex >= readDeviceSettings.length) {
                if (DEBUG) console.log("allChanges saved");
                document.getElementById("device_save_id_" + saveNewSettingsToId).className = "settings_save_button_inactive ui-button";
                saveNewSettingsToId = 0;
                return;
            }

            if (checkDEVICEsStats == 0) {
                send_OneWire_package(saveNewSettingsToId, 0, [DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].getCommand]);
                waitForResponseID = saveNewSettingsToId;
                waitForResponseType = 0;
                waitForResponseLength = 7;
                if (DEBUG) console.log("GET Setting " + DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].name + " with command " + DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].getCommand + " from DEVICE with id: " + saveNewSettingsToId + " ");
            } else {
                if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 1) {
                    send_OneWire_package(saveNewSettingsToId, 0, [(DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].setCommand), newSettingsValues[readDeviceSettings[deviceSettingIndex]]]);
                } else if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 2) {
                    send_OneWire_package(saveNewSettingsToId, 0, [(DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].setCommand), (newSettingsValues[readDeviceSettings[deviceSettingIndex]] >> 8), (newSettingsValues[readDeviceSettings[deviceSettingIndex]] & 0xFF)]);
                } else if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 4) {
                    send_OneWire_package(saveNewSettingsToId, 0, [(DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].setCommand), (newSettingsValues[readDeviceSettings[deviceSettingIndex]] >> 24), (newSettingsValues[readDeviceSettings[deviceSettingIndex]] >> 16) & 0xFF, (newSettingsValues[readDeviceSettings[deviceSettingIndex]] >> 8) & 0xFF, (newSettingsValues[readDeviceSettings[deviceSettingIndex]] & 0xFF)]);
                }
                if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].getCommand == OW_GET_ID) {
                    waitForResponseID = newSettingsValues[readDeviceSettings[deviceSettingIndex]];
                } else {
                    waitForResponseID = saveNewSettingsToId;
                }
                waitForResponseType = 0;
                waitForResponseLength = 7;
                if (DEBUG) console.log("SET Setting " + DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].name + " with command " + (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].getCommand + 1) + " to:" + newSettingsValues[readDeviceSettings[deviceSettingIndex]] + " at DEVICE with id: " + saveNewSettingsToId + " ");
            }
        } else {
            var responsePackage = checkForRespPackage();
            if (responsePackage) {
                timeoutDeviceIDs[saveNewSettingsToId] = 0;
                if (checkDEVICEsStats == 0) {
                    var responsePayload = 0;
                    if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 1) {
                        responsePayload = responsePackage[5];
                    } else if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 2) {
                        responsePayload = (responsePackage[5] << 8) | responsePackage[6];
                    }
                    else if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 4) {
                        responsePayload = (responsePackage[5] << 24) | (responsePackage[6] << 16) | (responsePackage[7] << 8) | responsePackage[8];
                    }
                    if (responsePayload == DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].active) {
                        if (DEBUG) console.log("GET response correct");
                        checkDEVICEsStats++;
                    } else {
                        if (DEBUG) console.log("SET response not correct (" + responsePayload + ") instead of (" + DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].active + "). stop");
                        serialBadError = 1;
                        deviceSettingIndex++;
                    }
                    waitForResponseID = 0;
                } else {
                    if (responsePackage[5] == OW_OK) {
                        DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].changed = false;
                        DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].active = newSettingsValues[readDeviceSettings[deviceSettingIndex]];
                        checkDEVICEsStats = 0;
                        if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].getCommand == OW_GET_ID) {
                            $("#dialog").text("OneWire ID was changed. GUI must reset! please connect again.");
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
                        if (DEBUG) console.log("saved setting: " + DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].name);
                        deviceSettingIndex++;
                    } else {
                        if (DEBUG) console.log("error while saving..." + DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].name);
                        checkDEVICEsStats = 0;
                        deviceSettingIndex++;
                    }
                    waitForResponseID = 0;
                }
            } else if (++timeoutDeviceIDs[saveNewSettingsToId] == DEFAULT_TIMEOUT || timeoutDeviceIDs[saveNewSettingsToId] == DEFAULT_TIMEOUT * 2 || timeoutDeviceIDs[saveNewSettingsToId] == DEFAULT_TIMEOUT * 3) {
                sendBytes(LastSentData);
                if (DEBUG) console.log("no response, retrying");
            } else if (timeoutDeviceIDs[saveNewSettingsToId] > DEFAULT_TIMEOUT * 3) {
                if (DEBUG) console.log("no response from DEVICE with id: " + saveNewSettingsToId + " ->stop");
                serialBadError = 1;
                waitForResponseID = 0;
                checkDEVICEsStats = 0;
                deviceSettingIndex++;
            }
        }
    }
}

function checkChangedSettings(ID) {
    var changedSettings = false;
    newSettingsValues = {};
    for (var y in DEVICEs[ID].DeviceSettings) {
        if ((DEVICEs[ID].DeviceSettings[y].min != 0 || DEVICEs[ID].DeviceSettings[y].max != 0) && DEVICEs[ID].DeviceSettings[y].DeviceTypes.indexOf(DEVICEs[ID].type) != -1) {
            if (DEVICEs[ID].DeviceSettings[y].min == 0 && DEVICEs[ID].DeviceSettings[y].max == 1) { // just active or inactive
                if (document.getElementById(DEVICEs[ID].DeviceSettings[y].getCommand + "_setting_id_" + ID).checked) {
                    newSettingsValues[y] = 1;
                    document.getElementById(DEVICEs[ID].DeviceSettings[y].getCommand + "_setting_id_" + ID).parentElement.className = "setting_container setting_container_active";
                } else {
                    newSettingsValues[y] = 0;
                    document.getElementById(DEVICEs[ID].DeviceSettings[y].getCommand + "_setting_id_" + ID).parentElement.className = "setting_container setting_container_inactive";
                }
            } else { // value
                newSettingsValues[y] = parseInt(document.getElementById(DEVICEs[ID].DeviceSettings[y].getCommand + "_setting_id_" + ID).value);
                if (newSettingsValues[y] > DEVICEs[ID].DeviceSettings[y].max) newSettingsValues[y] = DEVICEs[ID].DeviceSettings[y].max;
                if (newSettingsValues[y] < DEVICEs[ID].DeviceSettings[y].min) newSettingsValues[y] = DEVICEs[ID].DeviceSettings[y].min;
                document.getElementById(DEVICEs[ID].DeviceSettings[y].getCommand + "_setting_id_" + ID).value = newSettingsValues[y];
            }
            if (newSettingsValues[y] != DEVICEs[ID].DeviceSettings[y].active) {
                DEVICEs[ID].DeviceSettings[y].changed = true;
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
    if (changedSettings) document.getElementById("device_save_id_" + ID).className = "settings_save_button_active ui-button";
    else document.getElementById("device_save_id_" + ID).className = "settings_save_button_inactive ui-button";
}

function saveSettingsOfId(ID) {
    //collect Settings-
    var changedSettings = checkChangedSettings(ID);
    if (DEVICEs[ID].DeviceSettings[99].changed) {
        var ID_is_free = 1;
        for (i = 0; i < readDeviceIDs.length; i++) {
            if (newSettingsValues[99] == readDeviceIDs[i]) ID_is_free = 0;
        }
        if (ID_is_free == 0) {
            $("#dialog").text("OneWire ID " + newSettingsValues[99] + " is already in use, please choose another one.");
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
    deviceSettingIndex = 0;
    checkDEVICEsStats = 0;
    for (var IDs in DEVICEs) timeoutDeviceIDs[IDs] = 0;
    if (changedSettings) {
        saveNewSettingsToId = ID; // make the loop save the settings
    }
    //OW_activate();
}