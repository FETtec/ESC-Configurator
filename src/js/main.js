"user strict";

const DEBUG = 0;
const SERIALDEBUG = 0; /* show send/receive */

const APIKEY = "";
const USEAPI = 0;

const MAX_TRY = 1;
const DEFAULT_TIMEOUT = 215;

const TLMcanvasWidth = 600;
const TLMcanvasHeight = 142;

const KISS_PT = 0;
const BF_PT = 1;
const USB_UART = 2;
const VCP = 3;

var DEVICE_types = [
    { id: 0, name: "none", filename: '', blOnly: false, activation: false },
    { id: 1, name: "FETtec ESC 35A", filename: 'FETTEC_35A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: false, telemetryCapable: true },
    { id: 2, name: "FETtec ESC 50A", filename: 'FETTEC_50A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: false, telemetryCapable: true },
    { id: 3, name: "FETtec ESC 7A", filename: 'FETTEC_7A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: false, telemetryCapable: true },
    { id: 4, name: "FETtec PRO ESC 80A", filename: 'FETTEC_PRO_80A_ESC_G4_', start_addr: 3800, fw_maxsize: 88, blOnly: false, activation: false, telemetryCapable: true },
    { id: 5, name: "FETtec PRO ESC 60A", filename: 'FETTEC_PRO_60A_ESC_S32K_', start_addr: 4000, fw_maxsize: 470, blOnly: false, activation: false, telemetryCapable: true },
    { id: 6, name: "FETtec ESC 45A", filename: 'FETTEC_45A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: false, telemetryCapable: true },
    { id: 7, name: "FETtec ESC 45A HV", filename: 'FETTEC_45A_HV_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: false, telemetryCapable: true },
    { id: 8, name: "FETtec ESC 15A", filename: 'FETTEC_15A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: true, telemetryCapable: true },
    { id: 9, name: "FETtec PRO ESC 45A", filename: 'FETTEC_PRO_45A_ESC_G4_', start_addr: 3800, fw_maxsize: 88, blOnly: false, activation: false, telemetryCapable: true },
    { id: 10, name: "FETtec ESC 35A AIO", filename: 'FETTEC_35A_AIO_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: true, telemetryCapable: true },
    { id: 64, name: "ESC 15A", filename: 'ESC_DEF_GD_15A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: true, telemetryCapable: true },
    { id: 65, name: "ESC 15A", filename: 'ESC_ADV_GD_15A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: true, telemetryCapable: true },
    //    { id: 66, name: "ESC 15A", filename: '' },
    //    { id: 67, name: "ESC 15A", filename: '' },
    { id: 68, name: "ESC 25A", filename: 'ESC_DEF_GD_25A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: true, telemetryCapable: true },
    { id: 69, name: "ESC 25A", filename: 'ESC_ADV_GD_25A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: true, telemetryCapable: true },
    //    { id: 70, name: "ESC 25A", filename: '' },
    //    { id: 71, name: "ESC 25A", filename: '' },
    { id: 72, name: "ESC 35A", filename: 'ESC_DEF_GD_35A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: true, telemetryCapable: true },
    { id: 73, name: "ESC 35A", filename: 'ESC_ADV_GD_35A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: true, telemetryCapable: true },
    { id: 74, name: "ESC 35A", filename: 'ESC_DEF_GD_35A_ESC_G4_', start_addr: 3800, fw_maxsize: 88, blOnly: false, activation: true, telemetryCapable: true },
    { id: 75, name: "ESC 35A", filename: 'ESC_ADV_GD_35A_ESC_G4_', start_addr: 3800, fw_maxsize: 88, blOnly: false, activation: true, telemetryCapable: true },
    //    { id: 76, name: "ESC 35A", filename: '' },
    //    { id: 77, name: "ESC 35A", filename: '' },
    { id: 78, name: "ESC 45A", filename: 'ESC_DEF_GD_45A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: true, telemetryCapable: true },
    { id: 79, name: "ESC 45A", filename: 'ESC_ADV_GD_45A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: true, telemetryCapable: true },
    { id: 80, name: "ESC 45A", filename: 'ESC_DEF_GD_45A_ESC_G4_', start_addr: 3800, fw_maxsize: 88, blOnly: false, activation: true, telemetryCapable: true },
    { id: 81, name: "ESC 45A", filename: 'ESC_ADV_GD_45A_ESC_G4_', start_addr: 3800, fw_maxsize: 88, blOnly: false, activation: true, telemetryCapable: true },
    { id: 82, name: "ESC 45A", filename: 'ESC_DEF_GD_45A_ESC_S32K_', start_addr: 4000, fw_maxsize: 470, blOnly: false, activation: true, telemetryCapable: true },
    { id: 83, name: "ESC 45A", filename: 'ESC_ADV_GD_45A_ESC_S32K_', start_addr: 4000, fw_maxsize: 470, blOnly: false, activation: true, telemetryCapable: true },
    //    { id: 84, name: "ESC 45A", filename: '' },
    //    { id: 85, name: "ESC 45A", filename: '' },
    { id: 86, name: "ESC 55A", filename: 'ESC_DEF_GD_55A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: true, telemetryCapable: true },
    { id: 87, name: "ESC 55A", filename: 'ESC_ADV_GD_55A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: true, telemetryCapable: true },
    { id: 88, name: "ESC 55A", filename: 'ESC_DEF_GD_55A_ESC_G4_', start_addr: 3800, fw_maxsize: 88, blOnly: false, activation: true, telemetryCapable: true },
    { id: 89, name: "ESC 55A", filename: 'ESC_ADV_GD_55A_ESC_G4_', start_addr: 3800, fw_maxsize: 88, blOnly: false, activation: true, telemetryCapable: true },
    { id: 90, name: "ESC 55A", filename: 'ESC_DEF_GD_55A_ESC_S32K_', start_addr: 4000, fw_maxsize: 470, blOnly: false, activation: true, telemetryCapable: true },
    { id: 91, name: "ESC 55A", filename: 'ESC_ADV_GD_55A_ESC_S32K_', start_addr: 4000, fw_maxsize: 470, blOnly: false, activation: true, telemetryCapable: true },
    //    { id: 92, name: "ESC 55A", filename: '' },
    //    { id: 93, name: "ESC 55A", filename: '' },
    { id: 94, name: "ESC 65A", filename: 'ESC_DEF_GD_65A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: true, telemetryCapable: true },
    { id: 95, name: "ESC 65A", filename: 'ESC_ADV_GD_65A_ESC_G0_', start_addr: 1800, fw_maxsize: 41, blOnly: false, activation: true, telemetryCapable: true },
    { id: 96, name: "ESC 65A", filename: 'ESC_DEF_GD_65A_ESC_G4_', start_addr: 3800, fw_maxsize: 88, blOnly: false, activation: true, telemetryCapable: true },
    { id: 97, name: "ESC 65A", filename: 'ESC_ADV_GD_65A_ESC_G4_', start_addr: 3800, fw_maxsize: 88, blOnly: false, activation: true, telemetryCapable: true },
    { id: 98, name: "ESC 65A", filename: 'ESC_DEF_GD_65A_ESC_S32K_', start_addr: 4000, fw_maxsize: 470, blOnly: false, activation: true, telemetryCapable: true },
    { id: 99, name: "ESC 65A", filename: 'ESC_ADV_GD_65A_ESC_S32K_', start_addr: 4000, fw_maxsize: 470, blOnly: false, activation: true, telemetryCapable: true },
    //    { id: 100, name: "ESC 65A", filename: '' },
    //    { id: 101, name: "ESC 65A", filename: '' },
    { id: 102, name: "ESC 80A", filename: 'ESC_DEF_GD_80A_ESC_G4_', start_addr: 3800, fw_maxsize: 88, blOnly: false, activation: true, telemetryCapable: true },
    { id: 103, name: "ESC 80A", filename: 'ESC_ADV_GD_80A_ESC_G4_', start_addr: 3800, fw_maxsize: 88, blOnly: false, activation: true, telemetryCapable: true },
    { id: 104, name: "ESC 80A", filename: 'ESC_DEF_GD_80A_ESC_S32K_', start_addr: 4000, fw_maxsize: 470, blOnly: false, activation: true, telemetryCapable: true },
    { id: 105, name: "ESC 80A", filename: 'ESC_ADV_GD_80A_ESC_S32K_', start_addr: 4000, fw_maxsize: 470, blOnly: false, activation: true, telemetryCapable: true },
    //    { id: 106, name: "ESC 80A", filename: '' },
    //    { id: 107, name: "ESC 80A", filename: '' },
    { id: 108, name: "ESC 100A", filename: 'ESC_DEF_GD_100A_ESC_G4_', start_addr: 3800, fw_maxsize: 88, blOnly: false, activation: true, telemetryCapable: true },
    { id: 109, name: "ESC 100A", filename: 'ESC_DEF_GD_100A_ESC_G4_', start_addr: 3800, fw_maxsize: 88, blOnly: false, activation: true, telemetryCapable: true },
    { id: 110, name: "ESC 100A", filename: 'ESC_DEF_GD_100A_ESC_S32K_', start_addr: 4000, fw_maxsize: 470, blOnly: false, activation: true, telemetryCapable: true },
    { id: 111, name: "ESC 100A", filename: 'ESC_DEF_GD_100A_ESC_S32K_', start_addr: 4000, fw_maxsize: 470, blOnly: false, activation: true, telemetryCapable: true },
    //    { id: 112, name: "ESC 100A", filename: '' },
    //    { id: 113, name: "ESC 100A", filename: '' },
    { id: 114, name: "WING ESC 40A", filename: 'ESC_DEF_GD_WING_40A_ESC_G4', start_addr: 3800, fw_maxsize: 88, blOnly: false, activation: true },
    { id: 127, name: "FETtec F3 MINI-FC", filename: 'FETTEC_MINI_FC-', start_addr: 3800, fw_maxsize: 240, blOnly: true, activation: false, telemetryCapable: false },
    { id: 128, name: "FETtec G4 FC", filename: 'FETTEC_FC_G4', start_addr: 3800, fw_maxsize: 496, blOnly: false, activation: false, telemetryCapable: false },
    { id: 129, name: "FETtec G0 OSD", filename: ['RG_OSD_G0', 'FETTEC_OSD_FW'], start_addr: 1000, fw_maxsize: 124, blOnly: true, activation: false, telemetryCapable: false }];

const Serial_Options = [
    { id: 0, name: 'KISS FC Passthrough', connect_bitrate: 115200, disabled: false, selected: "selected" },
    { id: 1, name: 'Betaflight Passthrough', connect_bitrate: 115200, disabled: false, selected: false },
    { id: 2, name: 'USB UART', connect_bitrate: 2000000, disabled: false, selected: false },
    { id: 3, name: 'USB', connect_bitrate: 2000000, disabled: false, selected: false }
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
    this.activationkey = [];
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
        0: { getCommand: OW_GET_EEVER, setCommand: null, name: "EEPROM version", type: "hidden", min: 0, max: 0, value: 0, changed: false, eever: 0, byteCount: 1, DeviceTypes: onAllDevices, CommandType: 0 }, // must always be 0
        40: { getCommand: OW_GET_ROTATION_DIRECTION, setCommand: OW_SET_ROTATION_DIRECTION, name: "Reverse motor direction", feature: "standard", type: "checkbox", min: 0, max: 1, value: 0, changed: false, eever: 16, byteCount: 1, DeviceTypes: onAllESCs, CommandType: 0 },
        41: { getCommand: OW_GET_USE_SIN_START, setCommand: OW_SET_USE_SIN_START, name: "Slow start", feature: "standard", type: "checkbox", min: 0, max: 1, value: 0, changed: false, eever: 16, byteCount: 1, DeviceTypes: onAllESCs, CommandType: 0 },
        42: { getCommand: OW_GET_SOFT_START, setCommand: OW_SET_SOFT_START, name: "Soft start", feature: "standard", type: "checkbox", min: 0, max: 1, value: 0, changed: false, eever: 41, byteCount: 1, DeviceTypes: onAllESCs, CommandType: 0 },
        43: { getCommand: OW_GET_ESC_BEEP, setCommand: OW_SET_ESC_BEEP, name: "ESC beeps", feature: "standard", type: "checkbox", min: 0, max: 1, value: 0, changed: false, eever: 18, byteCount: 1, DeviceTypes: onAllESCs, CommandType: 0 },
        44: { getCommand: OW_GET_PWM_MIN, setCommand: OW_SET_PWM_MIN, name: "PWM Min.", type: "slider", feature: "advanced", min: 1000, max: 1400, value: 0, changed: false, eever: 17, byteCount: 2, DeviceTypes: onAllESCs, CommandType: 0 },
        45: { getCommand: OW_GET_PWM_MAX, setCommand: OW_SET_PWM_MAX, name: "PWM Max.", type: "slider", feature: "advanced", min: 1600, max: 2000, value: 0, changed: false, eever: 17, byteCount: 2, DeviceTypes: onAllESCs, CommandType: 0 },
        46: { getCommand: OW_GET_SOFT_BRAKE, setCommand: OW_SET_SOFT_BRAKE, name: "Soft brake", feature: "advanced", type: "checkbox", min: 0, max: 1, value: 0, changed: false, eever: 23, byteCount: 1, DeviceTypes: onAllESCs, CommandType: 0 },
        47: { getCommand: OW_GET_3D_MODE, setCommand: OW_SET_3D_MODE, name: "3D Mode", feature: "standard", type: "checkbox", min: 0, max: 1, value: 0, changed: false, eever: 1, byteCount: 1, DeviceTypes: onAllESCs, CommandType: 0 },
        48: { getCommand: OW_GET_CURRENT_CALIB, setCommand: OW_SET_CURRENT_CALIB, name: "Current calibration (%)", feature: "advanced", type: "value", min: 75, max: 125, value: 0, changed: false, eever: 18, byteCount: 1, DeviceTypes: onAllESCs, CommandType: 0 },
        /*
                49: { getCommand: OW_GET_LINEAR_THRUST, setCommand: OW_SET_LINEAR_THRUST, name: "Linear Thrust", feature: "advanced", type: "checkbox", min: 0, max: 1, value: 0, changed: false, eever: 16, byteCount: 1, DeviceTypes: onAllESCs, CommandType: 0  },
        */
        50: { getCommand: OW_GET_LOW_RAMP, setCommand: OW_SET_LOW_RAMP, name: "Low slew rate", feature: "advanced", type: "value", min: 1, max: 1000, value: 1, changed: false, eever: 22, byteCount: 2, DeviceTypes: [4, 5, 9], CommandType: 0 },
        51: { getCommand: OW_GET_HIGH_RAMP, setCommand: OW_SET_HIGH_RAMP, name: "High slew rate", feature: "advanced", type: "value", min: 1, max: 1000, value: 1, changed: false, eever: 22, byteCount: 2, DeviceTypes: [4, 5, 9], CommandType: 0 },
        /*
                52: { getCommand: OW_GET_LED_COLOR, setCommand: OW_SET_LED_COLOR, name: "Color", feature: "standard", type: "readonly", min: 0, max: 0xFFFFFFFF, value: 1, changed: false, eever: 22, byteCount: 4, DeviceTypes: onAllESCs, CommandType: 0  },
        */
        53: { getCommand: OW_GET_HALL_SENSOR_USAGE, setCommand: OW_SET_HALL_SENSOR_USAGE, name: "Hall Sensors", feature: "advanced", type: "checkbox", min: 0, max: 1, value: 0, changed: false, eever: 27, byteCount: 1, DeviceTypes: [4, 5, 9], CommandType: 0 },
        54: { getCommand: OW_GET_CURRENT_LIMIT, setCommand: OW_SET_CURRENT_LIMIT, name: "Current limit", feature: "advanced", type: "value", min: 100, max: 12000, value: 0, changed: false, eever: 27, byteCount: 2, DeviceTypes: [4, 5, 9], CommandType: 0 },
        55: { getCommand: OW_GET_NO_ACTIVE_START, setCommand: OW_SET_NO_ACTIVE_START, name: "No Active Start", feature: "advanced", type: "checkbox", min: 0, max: 1, value: 0, changed: false, eever: 27, byteCount: 1, DeviceTypes: [4, 5, 9], CommandType: 0 },
        56: { getCommand: OW_GET_ANALOG_THROTTLE, setCommand: OW_SET_ANALOG_THROTTLE, name: "Analog Throttle", feature: "advanced", type: "checkbox", min: 0, max: 1, value: 0, changed: false, eever: 33, byteCount: 1, DeviceTypes: [4, 9], CommandType: 0 },
        57: { getCommand: OW_GET_CELL_COUNT, setCommand: OW_SET_CELL_COUNT, name: "Battery Cell count", feature: "advanced", type: "value", min: 1, max: 255, value: 0, changed: false, eever: 33, byteCount: 1, DeviceTypes: [4, 5, 9], CommandType: 0 },
        58: { getCommand: OW_GET_TURNOFF_VOLTAGE, setCommand: OW_SET_TURNOFF_VOLTAGE, name: "Turn Off Cell Voltage", feature: "advanced", type: "value", min: 0, max: 1000, value: 0, changed: false, eever: 33, byteCount: 2, DeviceTypes: [4, 5, 9], CommandType: 0 },
        59: { getCommand: OW_GET_CELL_MAX_VOLTAGE, setCommand: OW_SET_CELL_MAX_VOLTAGE, name: "Max Cell Voltage", feature: "advanced", type: "value", min: 0, max: 1000, value: 0, changed: false, eever: 33, byteCount: 2, DeviceTypes: [4, 5, 9], CommandType: 0 },
        60: { getCommand: OW_GET_CM_PER_ERPM, setCommand: OW_SET_CM_PER_ERPM, name: "mm per Erpm", feature: "advanced", type: "value", min: 0, max: 10000, value: 0, changed: false, eever: 33, byteCount: 2, DeviceTypes: [4, 9], CommandType: 0 },
        61: { getCommand: OW_GET_BRAKE_ACTIVE, setCommand: OW_SET_BRAKE_ACTIVE, name: "Motor brake", feature: "advanced", type: "checkbox", min: 0, max: 1, value: 0, changed: false, eever: 33, byteCount: 1, DeviceTypes: [4, 5, 9], CommandType: 0 },
        62: { getCommand: OW_GET_ANALOG_BRAKE, setCommand: OW_SET_ANALOG_BRAKE, name: "Use analog brake signal", feature: "advanced", type: "checkbox", min: 0, max: 1, value: 0, changed: false, eever: 33, byteCount: 1, DeviceTypes: [4, 9], CommandType: 0 },
        63: { getCommand: OW_GET_BEC_VOLTAGE, setCommand: OW_SET_BEC_VOLTAGE, name: "BEC output Voltage", feature: "advanced", type: "value", min: 0, max: 2000, value: 0, changed: false, eever: 33, byteCount: 2, DeviceTypes: [4, 9], CommandType: 0 },
        64: { getCommand: OW_GET_MAX_OUTPUT_CURRENT_LIMIT, setCommand: OW_SET_MAX_OUTPUT_CURRENT_LIMIT, name: "Motor Current Limit", feature: "advanced", type: "value", min: 200, max: 14000, value: 0, changed: false, eever: 33, byteCount: 2, DeviceTypes: [4, 9], CommandType: 0 },
        65: { getCommand: OW_GET_HALL_SENSORS_LEVELS, setCommand: OW_SET_HALL_SENSORS_LEVELS, name: "Hall Sensor Output Levels", feature: "advanced", type: "value", min: 0, max: 255, value: 0, changed: false, eever: 35, byteCount: 1, DeviceTypes: [4, 5, 9], CommandType: 0 },
        66: { getCommand: OW_GET_ACTIVATION, setCommand: OW_GET_ACTIVATION, name: "Activated", feature: "advanced", type: "readonly", min: 0, max: 1, value: 0, changed: false, eever: 25, byteCount: 1, DeviceTypes: onAllESCs, CommandType: 0 },
        67: { getCommand: OW_GET_MASTER_ESC_MODE, setCommand: OW_SET_MASTER_ESC_MODE, name: "Dual Mode Master", feature: "advanced", type: "checkbox", min: 0, max: 1, active: 0, changed: false, eever: 36, byteCount: 1, DeviceTypes: [4, 9], CommandType: 0 },
        68: { getCommand: OW_GET_TRAPEZOIDAL_MODE, setCommand: OW_SET_TRAPEZOIDAL_MODE, name: "Trapeziodal commutation", feature: "advanced", type: "checkbox", min: 0, max: 1, active: 0, changed: false, eever: 37, byteCount: 1, DeviceTypes: onAllESCs, CommandType: 0 },
        69: { getCommand: OW_GET_FIELD_WEAKENING, setCommand: OW_SET_FIELD_WEAKENING, name: "Field Weakening", feature: "advanced", type: "value", min: 0, max: 10, value: 0, changed: false, eever: 41, byteCount: 1, DeviceTypes: [4, 5, 9], CommandType: 0 },

        70: { getCommand: OW_GET_POWER_LIMIT, setCommand: OW_SET_POWER_LIMIT, name: "Watt limit", feature: "advanced", type: "value", min: 0, max: 60000, active: 0, changed: false, eever: 42, byteCount: 2, DeviceTypes: [4, 5, 9], CommandType: 0 },
        71: { getCommand: OW_GET_SPEED_LIMIT, setCommand: OW_SET_SPEED_LIMIT, name: "km/h limit", feature: "advanced", type: "value", min: 0, max: 1000, active: 0, changed: false, eever: 42, byteCount: 2, DeviceTypes: [4, 5, 9], CommandType: 0 },

        72: { getCommand: OW_GET_FRSKY_PHY_ID, setCommand: OW_SET_FRSKY_PHY_ID, name: "Fport2 Phy. ID", feature: "advanced", type: "value", min: 0, max: 255, active: 0, changed: false, eever: 43, byteCount: 1, DeviceTypes: [4, 9, 114], CommandType: 0 },
        73: { getCommand: OW_GET_FRSKY_APP_ID_ADD, setCommand: OW_SET_FRSKY_APP_ID_ADD, name: "Fport2 Sensor ID offset", feature: "advanced", type: "value", min: 0, max: 20, active: 0, changed: false, eever: 43, byteCount: 1, DeviceTypes: [4, 9, 114], CommandType: 0 },
        74: { getCommand: OW_GET_FRSKY_TIME_GAP, setCommand: OW_SET_FRSKY_TIME_GAP, name: "Fport2 Time Gap", feature: "advanced", type: "value", min: 0, max: 255, active: 0, changed: false, eever: 43, byteCount: 1, DeviceTypes: [4, 9, 114], CommandType: 0 },

        75: { getCommand: OW_FC_GET_PIDS, setCommand: OW_FC_SET_PIDS, name: "PID settings<float>|Roll|Pitch|Yaw|P: -100|I: -1000|D: -100", feature: "advanced", type: "3colTable", min: 0, max: 50, active: 0, changed: false, eever: 1, byteCount: OW_FC_LEN_PIDS, DeviceTypes: [128], CommandType: OW_FC_COMMANDS },
        76: { getCommand: OW_FC_GET_EXPO, setCommand: OW_FC_SET_EXPO, name: "RC Expo<float>|Roll|Pitch|Yaw", feature: "advanced", type: "3colTable", min: 0, max: 2, active: 0, changed: false, eever: 1, byteCount: OW_FC_LEN_EXPO, DeviceTypes: [128], CommandType: OW_FC_COMMANDS },
        77: { getCommand: OW_FC_GET_RATE, setCommand: OW_FC_SET_RATE, name: "RC Rate|Roll|Pitch|Yaw", feature: "advanced", type: "3colTable", min: 0, max: 1900, active: 0, changed: false, eever: 1, byteCount: OW_FC_LEN_RATE, DeviceTypes: [128], CommandType: OW_FC_COMMANDS },
        78: { getCommand: OW_FC_GET_MIN_COMMAND, setCommand: OW_FC_SET_MIN_COMMAND, name: "Motor min Command", feature: "advanced", type: "value", min: 20, max: 200, active: 0, changed: false, eever: 1, byteCount: OW_FC_LEN_MIN_COMMAND, DeviceTypes: [128], CommandType: OW_FC_COMMANDS },
        79: { getCommand: OW_FC_GET_PROP_YAW_DIRECTION, setCommand: OW_FC_SET_PROP_YAW_DIRECTION, name: "Props in", feature: "advanced", type: "checkbox", min: 0, max: 1, active: 0, changed: false, eever: 1, byteCount: OW_FC_LEN_PROP_YAW_DIRECTION, DeviceTypes: [128], CommandType: OW_FC_COMMANDS },
        80: { getCommand: OW_FC_GET_TEST_SET, setCommand: OW_FC_SET_TEST_SET, name: "Test set", feature: "advanced", type: "value", min: 0, max: 255, active: 0, changed: false, eever: 1, byteCount: OW_FC_LEN_TEST_SET, DeviceTypes: [128], CommandType: OW_FC_COMMANDS },
        81: { getCommand: OW_FC_GET_MSPD_SERIAL, setCommand: OW_FC_SET_MSPD_SERIAL, name: "MSP display:|Disabled|Serial 1|Serial 3|Serial 4", feature: "advanced", type: "dropdown", min: 0, max: 3, active: 0, changed: false, eever: 5, byteCount: OW_FC_LEN_MSPD_SERIAL, DeviceTypes: [128], CommandType: OW_FC_COMMANDS },
        82: { getCommand: OW_FC_GET_VTX_SERIAL, setCommand: OW_FC_SET_VTX_SERIAL, name: "Analog VTX:|Disabled|Serial 1|Serial 3|Serial 4", feature: "advanced", type: "dropdown", min: 0, max: 3, active: 0, changed: false, eever: 5, byteCount: OW_FC_LEN_VTX_SERIAL, DeviceTypes: [128], CommandType: OW_FC_COMMANDS },
        83: { getCommand: OW_FC_GET_BEC_OUTPUT, setCommand: OW_FC_SET_BEC_OUTPUT, name: "BEC voltage:|5V|16V", feature: "advanced", type: "dropdown", min: 0, max: 2, active: 0, changed: false, eever: 5, byteCount: OW_FC_LEN_BEC_OUTPUT, DeviceTypes: [128], CommandType: OW_FC_COMMANDS },
        84: { getCommand: OW_FC_GET_CRAFT_TYPE, setCommand: OW_FC_SET_CRAFT_TYPE, name: "Craft type:|Quad X|Hexa Y|Hexa X|Octo flat X|Octo X8", feature: "advanced", type: "dropdown", min: 0, max: 4, active: 0, changed: false, eever: 5, byteCount: OW_FC_LEN_CRAFT_TYPE, DeviceTypes: [128], CommandType: OW_FC_COMMANDS },
        85: { getCommand: OW_FC_GET_ESC_PROTOCOL, setCommand: OW_FC_SET_ESC_PROTOCOL, name: "ESC protocol:|S2M+OW|PWM|S2M|ONEWIRE|DS600|DS1200|DS2400", feature: "advanced", type: "dropdown", min: 0, max: 7, active: 0, changed: false, eever: 5, byteCount: OW_FC_LEN_ESC_PROTOCOL, DeviceTypes: [128], CommandType: OW_FC_COMMANDS },
        86: { getCommand: OW_FC_GET_ESC_MAP14, setCommand: OW_FC_SET_ESC_MAP14, name: "ESC Mapping 1-4", feature: "advanced", type: "value", min: 1111, max: 8888, active: 0, changed: false, eever: 1, byteCount: OW_FC_LEN_ESC_MAP14, DeviceTypes: [128], CommandType: OW_FC_COMMANDS },
        87: { getCommand: OW_FC_GET_ESC_MAP58, setCommand: OW_FC_SET_ESC_MAP14, name: "ESC Mapping 5-8", feature: "advanced", type: "value", min: 1111, max: 8888, active: 0, changed: false, eever: 1, byteCount: OW_FC_LEN_ESC_MAP58, DeviceTypes: [128], CommandType: OW_FC_COMMANDS },

        199: { getCommand: OW_GET_ID, setCommand: OW_SET_ID, name: "OneWire ID", feature: "advanced", type: "value", min: 1, max: 24, value: 0, changed: false, eever: 16, byteCount: 1, DeviceTypes: onAllESCs, CommandType: 0 } // must always be 199 and the last one
    };
}

// helper to prevent single arrays in all settings

var actDeviceFlashPage = 0;
var actDeviceFlashStat = 0;
var activationActive = 0;
var activationRequired = 0;
var keycollectActive = 0;
var addressCounter = 0
var afterFlashedDisplay = 0;
var buttonsDisabled = 0;
var bytesCount = 1;
var checkDEVICEsStats = 0;
var checkDeviceId = 0;
var communicationErrorWarningDone = 0;
var connectionType = KISS_PT;
var connection_attempts = 0;
var loopDeviceId = 0;
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
var firmwareSizeExceeded = 0;
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
var reconnectTry = 0;
var refreshVersion = 0;
var rescanDone = 0;
var checkActivation = 0;
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
var switchLoopDeviceId = 0;
var switchProblem = 0;
var switchStatus = 0;
var thrCommandFirstByte = 0;
var throttleWarningDone = 0;
var toolbar = 0;
var timeout_delay = DEFAULT_TIMEOUT;
var use_bit_rate = 2000000;
var waitForResponseID = 0;
var waitForResponseLength = 0;
var waitForResponseType = 0;
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
var onAllDevices = [];
for (var i in DEVICE_types) {
    if (DEVICE_types[i].id != 128) onAllESCs.push(DEVICE_types[i].id);
    onAllDevices.push(DEVICE_types[i].id);
}

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
    hexSize: 0,
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

/* init */

onload = function () {

    $(".ui-notification-container").notification({
        stack: "above"
    });

    Gen_Menu_Buttons(-1, true);
    Gen_Types_Dropdown(Serial_Options);

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
        }
    });

    loopInterval = setInterval(function () { Internal_Loop(); }, 50);

    /* Check for latest version */
    var versionCheck = checkGithubRelease('https://api.github.com/repos/FETtec/ESC-Configurator/releases', chrome.runtime.getManifest().version);

    setTimeout(function () {
        if (Object.keys(versionCheck).length > 0) {
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

    $('#con_area').append('<button id="rescan_button">ReScan</button>');
    $('#rescan_button').button().click(function () {
        ReScanForDevices();
        return
    });
    $("#rescan_button").attr('disabled', true);
    $("#rescan_button").addClass("ui-state-disabled");

    /* Debug output */
    if (DEBUG) {
        $('#con_area').append('<button id="debug_button">Debug</button>');
        $('#debug_button').button().click(function () {
            // Return debug to console
            //console.log('DEVICEs[]');
            //console.dir(DEVICEs);
            //console.log('SerialConnection[]');
            //console.dir(SerialConnection);
            //console.log('Version: ' + chrome.runtime.getManifest().version);
            //console.log('Update details');
            //console.dir(versionCheck);
            //console.log("DEBUG");
            //ReScanForDevices();
            return
        });
    }
}

onclose = function () {
    chrome.serial.disconnect(connection.connectionId, function () { });
}

/* port handling */

function UpdateSerialSection(status) {
    if (status === "connect") {
        $("#con_port").attr('disabled', true);
        $("#con_type").attr('disabled', true);
        $("#rescan_button").attr('disabled', false);
        $("#rescan_button").removeClass("ui-state-disabled");

        $("#con_button").text("Disconnect");
    } else if (status === "disconnect") {
        $("#con_port").attr('disabled', false);
        $("#con_type").attr('disabled', false);
        $("rescan_button").attr('disabled', false);
        $("#rescan_button").attr('disabled', true);
        $("#rescan_button").addClass("ui-state-disabled");

        $("#con_button").text("Connect");

    }

    $('#con_type').selectmenu("refresh");
    $('#con_port').selectmenu("refresh");
}

function GenSerialDropdown(ports) {
    $('#con_port').empty()
    for (var i in ports) {
        if (ports[i].path.toLowerCase().indexOf("/dev/tty.") === -1) // ignore cu. interfaces
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
            disabled: array[i].disabled,
            selected: array[i].selected
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
        $("#rescan_button").attr('disabled', true);
        $("#rescan_button").addClass("ui-state-disabled");

    } else {
        $("#con_button").attr('disabled', false);
        $("#con_button").removeClass("ui-state-disabled");
        $("#rescan_button").attr('disabled', false);
        $("#rescan_button").removeClass("ui-state-disabled");
    }
}

function OpenPort(port) {
    UpdateSerialSection("connect");
    $("#rescan_button").attr('disabled', true);
    $("#rescan_button").addClass("ui-state-disabled");
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
            eventMessage("Entered BF CLI", -1);
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
            eventMessage("Serial Connection error -> retry", 0);
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
    eventMessage("changed Baud to: " + newBaud);
    $("#rescan_button").attr('disabled', true);
    $("#rescan_button").addClass("ui-state-disabled");
}

function disconnect(rescan = 1) {
    if (rescan) {
        selectedMenu = 0;
        activationActive = 0;
        keycollectActive = 0;
        activationRequired = 0;
        bytesCount = 1;
        connection_attempts = 0;
        loopDeviceId = 0;

        sentTestPackage = 0;
        SerialConnection.pass_through = 0;
        SerialConnection.pass_through_fails = 0;
        SerialConnection.connected = false;
        interval_Speedup_Done = 0;
        ptStatus = 0;
        waitLoops = 0;
        is_USB_only_bootloader = 0;

        scanDone = 0;
        scanID = 1;
        devicesDisplayed = 0;

        DEVICEs = [];
        timeoutDeviceIDs = [];

        firmwareUpdaterInitDone = 0;
        FW_update.hexString = [];
        FW_update.binaryString = [];
        FW_update.preparedPages = [];
        FW_update.pagesCount = 0;
        FW_update.hexSize = 0;
        FW_update.startAddr = null;
        FW_update.WhitePilotLogoPos = null;
        FW_update.BlackPilotLogoPos = null;
        FW_update.WhitePilotLogoArr = [];
        FW_update.BlackPilotLogoArr = [];
        FW_update.WhiteStartLogoPos = null;
        FW_update.BlackStartLogoPos = null;
        FW_update.WhiteStartLogoArr = [];
        FW_update.BlackStartLogoArr = [];

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
        $("#rescan_button").attr('disabled', true);
        $("#rescan_button").addClass("ui-state-disabled");
    }
    if (typeof SerialConnection.connection.connectionId !== 'undefined')
        chrome.serial.disconnect(SerialConnection.connection.connectionId, function () { });
}

function keyCollect_activate() {
    keycollectActive = 1;
    loopDeviceId = 0;
}

function Activation_activate() {
    if (activationRequired == 1) {
        activationActive = 1;
        loopDeviceId = 0;
    }
}

function keycollectLoop() {
    while ((!(loopDeviceId in DEVICEs) || !DEVICEs[loopDeviceId].selected) && loopDeviceId < 25) loopDeviceId++;
    if (loopDeviceId == 25) {
        eventMessage("Key collect completed")
        keycollectActive = 0;
        Activation_activate();
        return;
    } else if (DEVICE_types.find(x => x.id === DEVICEs[loopDeviceId].type).blOnly == true || DEVICE_types.find(x => x.id === DEVICEs[loopDeviceId].type).activation == false) {
        eventMessage("Device " + loopDeviceId + " is blOnly or already activated next.");
        loopDeviceId++;
    } else {
        if (DEVICEs[loopDeviceId].activated == 1) {
            eventMessage("Device " + loopDeviceId + " already actiated skip key collection.")
        } else {
            if (activationRequired == 0) activationRequired = 1;
            if (DEVICEs[loopDeviceId].activationkey != null && DEVICEs[loopDeviceId].activationkey.length != null && DEVICEs[loopDeviceId].activationkey.length > 0 && DEVICEs[loopDeviceId].activationkey[0] >= 0) {
                eventMessage("Key for device " + loopDeviceId + " already collected.")
            } else {
                eventMessage("Key collect for device " + loopDeviceId)
                var tmpSN = "";
                var tmpEPROM = DEVICEs[loopDeviceId].DeviceSettings[0].value;
                var tmpID = loopDeviceId;
                for (var y = 0; y < 12; y++)
                    tmpSN += String(dec2hex(DEVICEs[loopDeviceId].SN[y]));
                DEVICEs[loopDeviceId].activationkey = [-2, -2, -2, -2]; // -2 means to be collected
                var tmpURL = "https://licensing.fettec.net/activation.php?id=" + tmpSN + "&ver=" + tmpEPROM;
                if (USEAPI) tmpURL += "&api=" + APIKEY + "&type=" + DEVICEs[loopDeviceId].type;
                eventMessage("URL =  " + tmpURL)
                $.ajax({
                    url: tmpURL,
                    type: 'GET',
                    crossDomain: true,
                    success: function (data) {
                        eventMessage("Collect key '" + data + "' for SN: " + tmpSN);
                        DEVICEs[tmpID].activationkey = data.split(",");
                        if (data == "0,0,0,0") {
                            $(".ui-notification-container").notification("create", {
                                title: "Unable to activate device ID " + tmpID,
                                content: "SN: " + tmpSN + " not in Database.",
                            },
                                {
                                    sticky: true
                                }
                            );
                        }
                    },
                    error: function (data) {
                        eventMessage("ERROR on collect key")
                        $(".ui-notification-container").notification("create", {
                            title: "Unable to activate",
                            content: "Activation require internet connection.",
                        });
                        DEVICEs[tmpID].activationkey = [-1, -1, -1, -1] // -1 connectivty
                    }
                });
                waitLoops = 120;
            }
        }
        loopDeviceId++;
    }
}
function activationLoop() {
    if (waitForResponseID == 0) {
        while ((!(loopDeviceId in DEVICEs) || !DEVICEs[loopDeviceId].selected) && loopDeviceId < 25) loopDeviceId++;
        if (loopDeviceId == 25) {
            activationActive = 0;
            activationRequired = 0;
            return;
        } else if (DEVICE_types.find(x => x.id === DEVICEs[loopDeviceId].type).blOnly == true || DEVICE_types.find(x => x.id === DEVICEs[loopDeviceId].type).activation == false) {
            eventMessage("Device " + loopDeviceId + " is blOnly next.");
            loopDeviceId++;
        } else {
            if (switchStatus == 0) {
                eventMessage("DEVICE " + loopDeviceId + " send OK_OK cmd");
                send_OneWire_package(loopDeviceId, 0, [OW_OK]);
                waitForResponseID = loopDeviceId;
                waitForResponseType = 0;
                waitForResponseLength = 7;
            } else if (switchStatus == 1) {
                eventMessage("DEVICE " + loopDeviceId + " send OW_GET_ACTIVATION cmd");
                send_OneWire_package(loopDeviceId, 0, [OW_GET_ACTIVATION]);
                waitForResponseID = loopDeviceId;
                waitForResponseType = 0;
                waitForResponseLength = 7;
            } else if (switchStatus == 2) {
                eventMessage("DEVICE " + loopDeviceId + " send OW_SET_ACTIVATION cmd '" + DEVICEs[loopDeviceId].activationkey.join() + "'");
                send_OneWire_package(loopDeviceId, 0, [OW_SET_ACTIVATION, DEVICEs[loopDeviceId].activationkey[0], DEVICEs[loopDeviceId].activationkey[1], DEVICEs[loopDeviceId].activationkey[2], DEVICEs[loopDeviceId].activationkey[3]]);
                waitForResponseID = loopDeviceId;
                waitForResponseType = 0;
                waitForResponseLength = 7;
            } else if (switchStatus == 3) {
                eventMessage("DEVICE " + loopDeviceId + " send OW_GET_ACTIVATION cmd");
                send_OneWire_package(loopDeviceId, 0, [OW_GET_ACTIVATION]);
                waitForResponseID = loopDeviceId;
                waitForResponseType = 0;
                waitForResponseLength = 7;
            }
        }
    } else {
        var responsePackage = checkForRespPackage();
        if (responsePackage) {
            timeoutDeviceIDs[loopDeviceId] = 0;
            if (switchStatus == 0) {
                if (responsePackage[0] == OW_RESPONSE_IN_FW) {
                    switchStatus++;
                    waitForResponseID = 0;
                    eventMessage("DEVICE " + loopDeviceId + " is in firmware");
                } else {
                    if (switchProblem == 0) {
                        eventMessage("DEVICE " + loopDeviceId + " send OW_BL_START_FW cmd");
                        send_OneWire_package(loopDeviceId, 0, [OW_BL_START_FW]);
                        if (connectionType == VCP && loopDeviceId == 23) {
                            eventMessage("starting reconnect procedure 1");
                            ReconnectOnSend(0);
                        }
                        switchProblem++;
                        waitLoops = 20;
                    } else if (switchProblem < 4) {
                        eventMessage("ESC with id: " + loopDeviceId + " don't switches ->retry -> activationLoop");
                        send_OneWire_package(loopDeviceId, 0, [OW_BL_START_FW]);
                        if (connectionType == VCP && loopDeviceId == 23) {
                            eventMessage("starting reconnect procedure 1");
                            ReconnectOnSend(0);
                        }
                        switchProblem++;
                        waitLoops = 20;
                    } else {
                        eventMessage("DEVICE with id: " + loopDeviceId + " don't switches ->stop -> activationLoop");
                        //serialBadError = 1;
                        //switchProblem = 0;
                        switchStatus = 0;
                        loopDeviceId++;
                    }
                }
            } else if (switchStatus == 1) {
                DEVICEs[loopDeviceId].activated = (responsePackage[5]);
                eventMessage("DEVICE " + loopDeviceId + " response is " + DEVICEs[loopDeviceId].activated);
                if (responsePackage[5] == 1) {
                    eventMessage("DEVICE " + loopDeviceId + " is already activated. Next.");
                    switchStatus = 0;
                    loopDeviceId++;
                } else {
                    switchStatus++;
                }
            } else if (switchStatus == 2) {
                if (responsePackage[5] == OW_OK) {
                    eventMessage("DEVICE " + loopDeviceId + " response OK.");
                } else {
                    eventMessage("DEVICE " + loopDeviceId + " activation wrong response: " + responsePackage[5]);
                    $(".ui-notification-container").notification("create", {
                        title: "Unable to activate device " + loopDeviceId,
                        content: "Activation failed. Serial number not in database.",
                    },
                        {
                            sticky: true
                        }
                    );
                }
                switchStatus++;
            } else if (switchStatus == 3) {
                DEVICEs[loopDeviceId].activated = (responsePackage[5]);
                eventMessage("DEVICE " + loopDeviceId + " response is " + DEVICEs[loopDeviceId].activated);
                switchStatus = 0;
                loopDeviceId++;
            }
        } else if (++timeoutDeviceIDs[loopDeviceId] == timeout_delay || timeoutDeviceIDs[loopDeviceId] == timeout_delay * 2 || timeoutDeviceIDs[loopDeviceId] == timeout_delay * 3) {
            sendBytes(LastSentData);
            eventMessage("no response, retrying");
        } else if (timeoutDeviceIDs[loopDeviceId] > timeout_delay * 3) {
            eventMessage("no response from DEVICE with id: " + loopDeviceId + " ->stop");
            serialBadError = 1;
            waitForResponseID = 0;
            loopDeviceId++;
        }
    }
}

/* a slow loop to check com ports and stuff */

function Internal_Loop() {
    if (noLoop) return;
    if (waitLoops > 0) {
        waitLoops--;
        return;
    }

    if (serialBadError && communicationErrorWarningDone == 0) {
        communicationErrorWarningDone = 1;
        eventMessage("Many serial comm errors");
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
                        eventMessage("Requested KISS passthrough via " + getPT);
                        waitLoops = 40;
                        break;
                    case BF_PT:
                        SerialConnection.RX_tail = SerialConnection.RX_head;
                        var getPT = bfProtocol_preparePassthrough();
                        timeout_delay = DEFAULT_TIMEOUT * 3;
                        sendBytes(getPT);
                        eventMessage("Requested BF passthrough");
                        waitLoops = 40;
                        break
                    case USB_UART:
                        eventMessage("UART connected");
                        break;
                    case VCP:
                        // TODO is this really needed?
                        SerialConnection.RX_tail = 0;
                        SerialConnection.RX_head = 0;
                        var getPT = usb_prepareOWmode();
                        if (connection_attempts == 0) {
                            sendBytes(getPT);
                            eventMessage("FETtec request onewire mode");
                        } else {
                            var hiArr = [1, 23, 0, 0, 7, 0, 89];
                            sendBytes(hiArr);
                            eventMessage("FETtec check if onewire mode is already active");
                        }
                        waitLoops = 10;
                        break;
                }
                do_not_Update_Progress_Bar = 0;
                ptStatus = 2;
            } else if (ptStatus == 2 && connection_attempts <= MAX_TRY) {
                connection_attempts++;
                switch (connectionType) {
                    case KISS_PT:
                        if (SerialAvailable() < 2) {
                            eventMessage("no response from KISS FC, retry");
                            ptStatus = 1;
                            do_not_Update_Progress_Bar = 1;
                        } else {
                            var testByte = readBytes(2);
                            if (testByte[0] == 88 && testByte[1] == 1) {
                                changeBaud(921600);
                                eventMessage("passthrough active!");
                                waitLoops = 20;
                                ptStatus = 3;
                            } else {
                                eventMessage("wrong response from KISS FC, retry");
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
                                        eventMessage("passthrough active!");
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
                        break;
                    case VCP:
                        if (SerialAvailable() < 2) {
                            if (connection_attempts == 1) {
                                eventMessage("no response from FETtec FC, retry");
                                ptStatus = 1;
                            } else {
                                ptStatus = 3;
                                eventMessage("no response from FETtec FC, switch to bootloader");
                            }
                            do_not_Update_Progress_Bar = 1;
                        } else {
                            var testByte = readBytes(7);
                            if ((testByte[0] == 0x4F && testByte[1] == 0x4B) || (testByte[0] == 3 && testByte[1] == 23)) {
                                eventMessage("FETtec onewire mode!");
                                waitLoops = 20;
                                ptStatus = 0;
                                noLoop = 0;
                                DEVICE_types.find(x => x.id === 128).blOnly = false;
                                return;
                            } else {
                                eventMessage("wrong response from FETtec FC, retry");
                                ptStatus = 1;
                                do_not_Update_Progress_Bar = 1;
                            }
                        }
                        break;
                }
            } else if (connection_attempts >= MAX_TRY && ptStatus != 4) {
                noLoop = 1;
                if (connectionType != VCP) {
                    eventMessage("Connection to FC failed");
                    $("#dialog").text("Unable to active FC passthrough mode. Maybe the FC is already in passthrough mode, or the FC FW version don't supports it.");
                    $("#dialog").dialog({
                        modal: true,
                        buttons: {
                            Try: function () {
                                $(this).dialog("close");
                                switch (connectionType) {
                                    case KISS_PT:
                                        changeBaud(921600);
                                        eventMessage("passthrough active!");
                                        waitLoops = 20;
                                        ptStatus = 3;
                                        break;
                                    case BF_PT:
                                        changeBaud(115200);
                                        eventMessage("passthrough active!");
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
                } else {
                    noLoop = 0;
                    var getPT = usb_prepareReset();
                    var sixEmptyBytes = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
                    sendBytes(sixEmptyBytes);
                    sendBytes(getPT);
                    ReconnectOnSend(0);
                    eventMessage("VCP requested reset ");
                    waitLoops = 40;
                    DEVICE_types.find(x => x.id === 128).blOnly = true;
                    ptStatus = 3;
                }
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
            change_Devices_status(1, 1, 0, 1);
            firmwareUpdaterInitDone = 1;
        } else if (rescanDone == 1) {
            //initFWUpdater();
            rescanDone = 0;
        }
    }
    if (SerialConnection.connected == 1) {
        if (devicesToBL) {
            check_ESCs_In_BL();
        } else {
            if (FW_update.FlashProcessActive == 1) {
                change_Devices_status(0);
                FW_update.FlashProcessActive = 2;
            }
            if (FW_update.FlashProcessActive == 3) {
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
            if (keycollectActive == 1) {
                keycollectLoop();
            }
        }
    }
}

/* Switch from Bootloader to Firmware and back */


function change_Devices_status(stat, enableButtonsIfDone = 0, refreshVersionIfDone = 0, checkActivationIfDone = 0) {
    disableButtons();
    switchLoopDeviceId = 0;
    switchProblem = 0;
    enableButtonsAfterSwitch = enableButtonsIfDone;
    refreshVersion = refreshVersionIfDone;
    checkActivation = checkActivationIfDone;
    if (stat == 0) {
        expectedHeader = OW_RESPONSE_IN_BL;
        switchCommand = OW_RESET_TO_BL;
        eventMessage("changing status to Bootloader");
    } else {
        expectedHeader = OW_RESPONSE_IN_FW;
        switchCommand = OW_BL_START_FW;
        eventMessage("changing status to Firmware");
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
        while ((!(switchLoopDeviceId in DEVICEs) || !DEVICEs[switchLoopDeviceId].selected) && switchLoopDeviceId < 25) switchLoopDeviceId++;
        if (switchLoopDeviceId == 23 && expectedHeader == OW_RESPONSE_IN_FW) {
            var getPT = usb_prepareOWmode();
            sendBytes(getPT);
        }
        if (switchLoopDeviceId == 25) {
            devicesToBL = 0;
            if (FW_update.FlashProcessActive == 2) FW_update.FlashProcessActive = 3;
            if (refreshVersion) {
                refreshVersion = 0;
                document.getElementById("overview").innerHTML = "";
                displayDevices(document.getElementById("overview"));
            }
            if (checkActivation) {
                checkActivation = 0;
                eventMessage("All devices in Firmware ready for activation")
                keyCollect_activate();
            }
            if (enableButtonsAfterSwitch) {
                enableButtons();
                enableButtonsAfterSwitch = 0;
            }
            return;
        }

        if ((DEVICE_types.find(x => x.id === DEVICEs[switchLoopDeviceId].type)).blOnly == true) {
            switchStatus = 0;
            switchLoopDeviceId++;
            return;
        }

        if (switchStatus == 0) {
            send_OneWire_package(switchLoopDeviceId, 0, [OW_OK]);
            waitForResponseID = switchLoopDeviceId;
            waitForResponseType = 0;
            waitForResponseLength = 7;
            eventMessage("check with id: " + switchLoopDeviceId + " ");
        } else if (switchStatus == 1) {
            if (refreshVersion) {
                send_OneWire_package(switchLoopDeviceId, 0, [OW_REQ_SW_VER]);
                waitForResponseID = switchLoopDeviceId;
                waitForResponseType = 0;
                waitForResponseLength = 8;
                eventMessage("check FW version with id: " + switchLoopDeviceId + " ");
            } else {
                switchStatus++;
            }
        } else if (switchStatus == 2) {
            if (checkActivation) {
                send_OneWire_package(switchLoopDeviceId, 0, [OW_GET_EEVER]);
                waitForResponseID = switchLoopDeviceId;
                waitForResponseType = 0;
                waitForResponseLength = 7;
                eventMessage("check EEPROM VERSION of id: " + switchLoopDeviceId + " ");
            } else {
                switchStatus++;
            }
        } else if (switchStatus == 3) {
            if (checkActivation) {
                send_OneWire_package(switchLoopDeviceId, 0, [OW_GET_ACTIVATION]);
                waitForResponseID = switchLoopDeviceId;
                waitForResponseType = 0;
                waitForResponseLength = 7;
                eventMessage("check Activation of id: " + switchLoopDeviceId + " ");
            } else {
                switchStatus = 0;
                switchLoopDeviceId++;
            }
        }


    } else {
        var responsePackage = checkForRespPackage();
        if (responsePackage) {
            timeoutDeviceIDs[switchLoopDeviceId] = 0;
            if (switchStatus == 0) {
                if (responsePackage[0] == expectedHeader) {
                    if (expectedHeader == OW_RESPONSE_IN_BL) DEVICEs[switchLoopDeviceId].asBL = true;
                    else DEVICEs[switchLoopDeviceId].asBL = false;
                    eventMessage("DEVICE with id: " + switchLoopDeviceId + " is ready");
                    switchStatus++;
                } else {
                    if (expectedHeader != OW_RESPONSE_IN_BL) DEVICEs[switchLoopDeviceId].asBL = false;
                    else DEVICEs[switchLoopDeviceId].asBL = true;
                    if (switchProblem == 0) {
                        if (DEVICE_types.find(x => x.id === DEVICEs[switchLoopDeviceId].type).blOnly == true) return
                        eventMessage("switching DEVICE with id: " + switchLoopDeviceId);
                        send_OneWire_package(switchLoopDeviceId, 0, [switchCommand]);
                        if (connectionType == VCP && switchLoopDeviceId == 23) {
                            eventMessage("starting reconnect procedure 1");
                            ReconnectOnSend(0);
                        }
                        switchProblem++;
                        waitLoops = 20;
                    } else if (switchProblem < 4) {
                        eventMessage("DEVICE with id: " + switchLoopDeviceId + " don't switches ->retry ->check_ESCs_In_BL");
                        send_OneWire_package(switchLoopDeviceId, 0, [switchCommand]);
                        if (connectionType == VCP && switchLoopDeviceId == 23) {
                            eventMessage("starting reconnect procedure 1");
                            ReconnectOnSend(0);
                        }
                        switchProblem++;
                        waitLoops = 20;
                    } else {
                        eventMessage("DEVICE with id: " + switchLoopDeviceId + " don't switches ->stop ->check_ESCs_In_BL");
                        if (expectedHeader == OW_RESPONSE_IN_FW) {
                            // geht nix
                            eventMessage("zur FW failt ->check_ESCs_In_BL");
                        } else {
                            serialBadError = 1; // f�hrt zum fehler wenn das device keine FW starten kann und deshalb im BL steckt    
                            eventMessage("zum BL failt ->check_ESCs_In_BL");
                        }
                        switchLoopDeviceId++;
                        switchProblem = 0;
                    }
                }
            } else if (switchStatus == 1) {
                DEVICEs[switchLoopDeviceId].version = (responsePackage[5] / 10);
                DEVICEs[switchLoopDeviceId].subversion = (responsePackage[6] / 100);
                eventMessage("DEVICE with id: " + switchLoopDeviceId + " software version is: " + DEVICEs[switchLoopDeviceId].version + "." + DEVICEs[switchLoopDeviceId].subversion);
                switchStatus++;
            } else if (switchStatus == 2) {
                DEVICEs[switchLoopDeviceId].DeviceSettings[0].value = responsePackage[5];

                if (responsePackage[5] >= 25) { // TODO fix this (refer to EEPROM)
                    eventMessage("DEVICE with id: " + switchLoopDeviceId + " eeprom version status is: " + responsePackage[5] + " check for activation");
                    switchStatus++;
                } else {
                    eventMessage("DEVICE with id: " + switchLoopDeviceId + " eeprom version status is: " + responsePackage[5] + " activation not supported");
                    DEVICEs[switchLoopDeviceId].activated = 1;
                    switchStatus = 0;
                    switchLoopDeviceId++;
                }
            }
            else if (switchStatus == 3) {
                DEVICEs[switchLoopDeviceId].activated = responsePackage[5];
                eventMessage("DEVICE with id: " + switchLoopDeviceId + " activation status is: " + DEVICEs[switchLoopDeviceId].activated);
                switchStatus = 0;
                switchLoopDeviceId++;
            }
        } else if (++timeoutDeviceIDs[switchLoopDeviceId] == timeout_delay || timeoutDeviceIDs[switchLoopDeviceId] == timeout_delay * 3 || timeoutDeviceIDs[switchLoopDeviceId] == timeout_delay * 5) {
            sendBytes(LastSentData);
            eventMessage("no response, retrying");
        } else if (timeoutDeviceIDs[switchLoopDeviceId] > timeout_delay * 5) {
            eventMessage("no response from DEVICE with id: " + switchLoopDeviceId + " ->stop");
            serialBadError = 1; // f�hrt zum fehler wenn das device keine FW starten kann und deshalb im BL steckt    
            waitForResponseID = 0;
            switchLoopDeviceId++;
        }
    }
}

/* Display handling */

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
                if (DEVICE_types.find(x => x.id === DEVICEs[i].type).telemetryCapable == false) break;
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
            DEVICEs[i].DeviceSettings[0].value = 0;
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
                if (typeof DEVICEs[23] !== 'undefined') {
                    send_OneWire_package(23, 0, [OW_FC_SET_ESCS_NO_SIG, 1], OW_FC_COMMANDS);
                }
                if (FW_update.FlashProcessActive == 0) {
                    initFWUpdater();
                    change_Devices_status(1, 1, 0);
                }
                break;
            case 1:
                if (typeof DEVICEs[23] !== 'undefined') {
                    send_OneWire_package(23, 0, [OW_FC_SET_ESCS_NO_SIG, 1], OW_FC_COMMANDS);
                }
                initConfig();
                break;
            case 2:
                if (typeof DEVICEs[23] !== 'undefined') {
                    send_OneWire_package(23, 0, [OW_FC_SET_ESCS_NO_SIG, 0], OW_FC_COMMANDS);
                }
                initTools();
                break;
        }

    }
}
/* DEVICE communication */


function ReScanForDevices() {
    scanDone = 0;
    scanID = 1;
    devicesDisplayed = 0;
    DEVICEs = [];
    timeoutDeviceIDs = [];
    //var currentMenu = selectedMenu;
    $('#overview').empty();
    $('#toolbar').empty();
    $("#progressbar").show();
    $("#rescan_button").attr('disabled', true);
    $("#rescan_button").addClass("ui-state-disabled");
    //ChangeDisplay(99);
    ScanForDevices();
    rescanDone = 1;
    /*
    console.log(currentMenu);
    switch (currentMenu) {
        case 0:
            initFWUpdater();
            break;
        case 1:
            initConfig();
    }
    */
    //ChangeDisplay(currentMenu);

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
            eventMessage("scan for ID: " + scanID);
        } else if (scanStep == 1) { //get Type
            timeoutDeviceIDs[scanID] = 0;
            send_OneWire_package(scanID, 0, [OW_REQ_TYPE]);
            waitForResponseID = scanID;
            waitForResponseType = 0;
            waitForResponseLength = 7;
            eventMessage("request version of DEVICE with ID: " + scanID);
        } else if (scanStep == 2) { //get version
            timeoutDeviceIDs[scanID] = 0;
            send_OneWire_package(scanID, 0, [OW_REQ_SW_VER]);
            waitForResponseID = scanID;
            waitForResponseType = 0;
            waitForResponseLength = 8;
            eventMessage("request type of DEVICE with ID: " + scanID);
        } else if (scanStep == 3) { //get SN
            timeoutDeviceIDs[scanID] = 0;
            send_OneWire_package(scanID, 0, [OW_REQ_SN]);
            waitForResponseID = scanID;
            waitForResponseType = 0;
            waitForResponseLength = 18;
            eventMessage("request Serialnumber of DEVICE with ID: " + scanID);
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
                    eventMessage("found ID: " + DEVICEs[scanID].id + ", is a bootloader: " + DEVICEs[scanID].asBL);
                    scanStep = 1;
                    ScanForDevices();
                } else if (scanStep == 1) {

                    DEVICEs[scanID].type = responsePackage[5];
                    if (DEVICEs[scanID].type == 128) {
                        /*
                      trifft  ja nichtmehr zu
                                    is_USB_only_bootloader = 1;
                                    eventMessage("Board type is USB bootloader only!");
                        */
                    }

                    eventMessage("DEVICE with id: " + scanID + " is from type: " + DEVICEs[scanID].type);
                    scanStep = 2;
                    ScanForDevices();
                } else if (scanStep == 2) {

                    DEVICEs[scanID].version = (responsePackage[5] / 10);
                    DEVICEs[scanID].subversion = (responsePackage[6] / 100);

                    eventMessage("DEVICE with id: " + scanID + " software version is: " + DEVICEs[scanID].version + "." + DEVICEs[scanID].subversion);
                    scanStep = 3;
                    ScanForDevices();
                } else if (scanStep == 3) {

                    for (var i = 0; i < 12; i++) DEVICEs[scanID].SN[i] = responsePackage[i + 5];

                    eventMessage("DEVICE with id: " + scanID + " serialnumber is: ", DEVICEs[scanID].SN);

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
                eventMessage("no response from DEVICE with id: " + scanID + " ->retry");
            } else if (timeoutDeviceIDs[scanID] > 15) {
                timeoutDeviceIDs[scanID] = 0;
                eventMessage("no response from DEVICE with id: " + scanID + " ->stop");
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

/* Display ESC's */

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
            /*            $('#SN2').on('click', function (e) {
                            copyTextToClipboard(MCUid);
                            $('#SN2text').text($.i18n("text.serial-clipboard"));
                            setTimeout(function () {
                                $('#SN2text').text("");
                            }, 1000);
                        });
            */
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
            /* Settings  */
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

                if (DEVICEs[i].DeviceSettings[y].DeviceTypes.indexOf(DEVICEs[i].type) == -1) {
                    eventMessage(" Ignore DeviceID: " + i + " - CmdID: " + y);
                } else {
                    // Type decision
                    switch (DEVICEs[i].DeviceSettings[y].type) {
                        case "checkbox":
                            var DeviceSetting = document.createElement('div');
                            DeviceSetting.className = "setting_container";
                            if (DEVICEs[i].DeviceSettings[y].eever > DEVICEs[i].DeviceSettings[0].value) DeviceSetting.style.display = "none";

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
                            if (DEVICEs[i].DeviceSettings[y].value) {
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
                            if (DEVICEs[i].DeviceSettings[y].eever > DEVICEs[i].DeviceSettings[0].value) DeviceSetting.style.display = "none";
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
                            settingSlider.value = DEVICEs[i].DeviceSettings[y].value;
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
                            settingNumber.value = DEVICEs[i].DeviceSettings[y].value;
                            settingNumber.id = DEVICEs[i].DeviceSettings[y].getCommand + "_setting_id_value_" + i;
                            DeviceSetting.appendChild(settingNumber);

                            break
                        case "colorpick":
                            break
                        case "value":
                            var DeviceSetting = document.createElement('div');
                            DeviceSetting.className = "setting_container";
                            if (DEVICEs[i].DeviceSettings[y].eever > DEVICEs[i].DeviceSettings[0].value) DeviceSetting.style.display = "none";
                            DeviceSettingText = document.createElement('div')
                            DeviceSettingText.className = "setting_text";
                            DeviceSettingText.innerHTML = DEVICEs[i].DeviceSettings[y].name + " ";
                            DeviceSetting.appendChild(DeviceSettingText);
                            DeviceInfoDiv.appendChild(DeviceSetting);
                            settingNumber = document.createElement('input');
                            settingNumber.type = "number";
                            settingNumber.style.width = ((DEVICEs[i].DeviceSettings[y].max.toString(10).length * 12) + 5) + "px";
                            settingNumber.className = "settings_numberBox"; //  ui-corner-all
                            settingNumber.value = DEVICEs[i].DeviceSettings[y].value;
                            settingNumber.id = DEVICEs[i].DeviceSettings[y].getCommand + "_setting_id_" + i;
                            settingNumber.onchange = function () {
                                SettingsChanged(this.id);
                            }
                            DeviceSetting.appendChild(settingNumber);
                            break
                        case "hidden":
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
                            settingNumber.value = DEVICEs[i].DeviceSettings[y].value;
                            settingNumber.id = DEVICEs[i].DeviceSettings[y].getCommand + "_setting_id_" + i;
                            DeviceSetting.appendChild(settingNumber);
                            break;
                        case "readonly":
                            var DeviceSetting = document.createElement('div');
                            DeviceSetting.className = "setting_container";
                            //DeviceSetting.style.display = "none";
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
                            settingNumber.value = DEVICEs[i].DeviceSettings[y].value;
                            settingNumber.id = DEVICEs[i].DeviceSettings[y].getCommand + "_setting_id_" + i;
                            DeviceSetting.appendChild(settingNumber);
                            break;
                        case "3colTable":
                            //get table config
                            var realNameSplit = DEVICEs[i].DeviceSettings[y].name.split("|");
                            var columNames = [realNameSplit[1], realNameSplit[2], realNameSplit[3]];
                            var rowNames = ["", "", "", "",];
                            var rowStep = [0.01, 0.01, 0.01, 0.01];
                            for (j = 4; j < realNameSplit.length; j++) {
                                var rowNameSplit = realNameSplit[j].split("-");
                                if (rowNameSplit[0] != realNameSplit[j]) {
                                    rowStep[j - 4] = 1 / parseInt(rowNameSplit[1]);
                                    rowNames[j - 4] = rowNameSplit[0];
                                } else rowNames[j - 4] = realNameSplit[j];
                            }
                            var realName = realNameSplit[0].replace(/<float>/, '');
                            var useFloat = (realName != realNameSplit[0]);

                            var DeviceSetting = document.createElement('div');
                            DeviceSetting.className = "setting_container";
                            if (DEVICEs[i].DeviceSettings[y].eever > DEVICEs[i].DeviceSettings[0].value) DeviceSetting.style.display = "none";
                            DeviceSettingText = document.createElement('div')
                            DeviceSettingText.className = "setting_text";
                            DeviceSettingText.innerHTML = realName + " ";
                            DeviceSetting.appendChild(DeviceSettingText);
                            DeviceInfoDiv.appendChild(DeviceSetting);
                            settingsTable = document.createElement('table');
                            settingsTable.id = DEVICEs[i].DeviceSettings[y].getCommand + "_setting_id_" + i;
                            var TableCounter = DEVICEs[i].DeviceSettings[y].byteCount / 2;
                            tr = document.createElement('tr');
                            if (TableCounter > 3) {
                                td = document.createElement('td');
                                tr.appendChild(td);
                            }
                            td = document.createElement('td');
                            td.innerHTML = columNames[0];
                            tr.appendChild(td);
                            td = document.createElement('td');
                            td.innerHTML = columNames[1];
                            tr.appendChild(td);
                            td = document.createElement('td');
                            td.innerHTML = columNames[2];
                            tr.appendChild(td);
                            settingsTable.appendChild(tr);

                            DeviceSetting.style.height = 40 + (23 * ((TableCounter / 3) - 1)) + "px";

                            for (j = 0; j < TableCounter; j++) {
                                if (j == 0 || j == 3 || j == 6) {
                                    tr = document.createElement('tr');
                                    if (TableCounter > 3) {
                                        var RowName = rowNames[0];
                                        if (j == 3) RowName = rowNames[1];
                                        if (j == 6) RowName = rowNames[2];
                                        td = document.createElement('td');
                                        td.innerHTML = RowName;
                                        tr.appendChild(td);
                                    }
                                }
                                td = document.createElement('td');
                                settingNumber = document.createElement('input');
                                settingNumber.type = "number";
                                if (useFloat) {
                                    if (j < 3) settingNumber.step = "" + rowStep[0] + "";
                                    else if (j < 6) settingNumber.step = "" + rowStep[1] + "";
                                    else if (j < 9) settingNumber.step = "" + rowStep[2] + "";
                                    else if (j < 12) settingNumber.step = "" + rowStep[3] + "";
                                }
                                settingNumber.style.width = "50px";
                                settingNumber.className = "settings_numberBox"; //  ui-corner-all
                                if (Array.isArray(DEVICEs[i].DeviceSettings[y].value)) {
                                    if (useFloat) settingNumber.value = getFloatFromU8s(1000, DEVICEs[i].DeviceSettings[y].value[0 + (j * 2)], DEVICEs[i].DeviceSettings[y].value[1 + (j * 2)]);
                                    else settingNumber.value = (DEVICEs[i].DeviceSettings[y].value[0 + (j * 2)] << 8) | DEVICEs[i].DeviceSettings[y].value[1 + (j * 2)];
                                }
                                settingNumber.id = DEVICEs[i].DeviceSettings[y].getCommand + "_setting_id_" + i + "_" + j;
                                settingNumber.onchange = function () {
                                    SettingsChanged(this.parentElement.parentElement.parentElement.id);
                                }
                                td.appendChild(settingNumber);
                                tr.appendChild(td);
                                if (j == 0 || j == 3 || j == 6) settingsTable.appendChild(tr);
                            }
                            DeviceSetting.appendChild(settingsTable);
                            break;
                        case "dropdown":
                            var DeviceSetting = document.createElement('div');
                            var optionsSplit = DEVICEs[i].DeviceSettings[y].name.split("|");
                            DeviceSetting.className = "setting_container";
                            if (DEVICEs[i].DeviceSettings[y].eever > DEVICEs[i].DeviceSettings[0].value) DeviceSetting.style.display = "none";
                            DeviceSettingText = document.createElement('div');
                            DeviceSettingText.className = "setting_text";
                            DeviceSettingText.innerHTML = optionsSplit[0] + " ";
                            DeviceSetting.appendChild(DeviceSettingText);
                            DeviceInfoDiv.appendChild(DeviceSetting);
                            settingNumber = document.createElement('select');
                            settingNumber.className = "settings_numberBox";
                            settingNumber.id = DEVICEs[i].DeviceSettings[y].getCommand + "_setting_id_" + i;
                            settingNumber.onchange = function () {
                                SettingsChanged(this.id);
                            }
                            for (var j = 1; j < optionsSplit.length; j++) {
                                var optionEle = document.createElement('option');
                                optionEle.innerHTML = optionsSplit[j];
                                optionEle.value = j - 1;
                                if (optionEle.value == DEVICEs[i].DeviceSettings[y].value) {
                                    optionEle.selected = "SELECTED";
                                }
                                settingNumber.appendChild(optionEle);
                            }
                            DeviceSetting.appendChild(settingNumber);
                            break
                        default:
                    }
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
            /* Tools */
            if (DEVICE_types.find(x => x.id === DEVICEs[i].type).blOnly == true) break;
            if (DEVICE_types.find(x => x.id === DEVICEs[i].type).telemetryCapable == false) break;
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

/* FW update / hex file handling  */

function initFWUpdater() {
    $("#toolbar").append(
        $('<div/>').attr({ id: 'localFW', class: 'fileContainer' }).button().click(function () {
            eventMessage("LOCAL File Selected");
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
        eventMessage('reading file: ' + FW_update.loadedFileName);
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
                eventMessage("check for remote firmware");
                loadGithubReleases("https://api.github.com/repos/FETtec/Firmware/releases", function (data) {
                    if ($('#remoteFWSelect').length == 0) {
                        $("#toolbar").append($('<select/>').attr({ id: 'remoteFWSelect' }));
                    }
                    $('#remoteFWSelect').empty()
                    $('#remoteFWSelect').append($("<option/>", {
                        value: null,
                        text: "---"
                    }));
                    $.each(data, function (index, release) {
                        eventMessage("Processing releases: " + release.name);
                        $.each(release.assets, function (index2, asset) {
                            eventMessage("Processing firmware: " + asset.name);
                            var tmpTypes = []
                            $.each(DEVICEs, function (index, device) {
                                if (device !== undefined) {
                                    if (tmpTypes.includes(device.type)) {
                                    } else {
                                        tmpTypes.push(device.type)
                                        if (asset.name.endsWith(".hex") && findstartswith(DEVICE_types.find(x => x.id === device.type).filename, asset.name)) {
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
                                    eventMessage("Loaded remote DEVICE hex file " + fw_url + " Filename:" + FW_update.loadedFileName);
                                    self.pages = parseHexFile(data);
                                    PrepareUpdate();
                                },
                                error: function (data) {
                                    eventMessage("ERROR on download file " + fw_url)
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
            if (findstartswith(DEVICE_types.find(x => x.id === device.type).filename, FW_update.loadedFileName)) {
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


    if (searchStartLogo(FW_update.binaryString) == 1) { // Logo
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
        loopDeviceId = 0;
        firmwareSizeExceeded = 0;
        FW_update.FlashProcessActive = 1;
        afterFlashedDisplay = 0;
        disableButtons();
    }
}

function FlashProcessLoop() {
    while ((!(loopDeviceId in DEVICEs) || !DEVICEs[loopDeviceId].selected) && loopDeviceId < 25) loopDeviceId++;
    if (loopDeviceId != 25) {
        if ((DEVICE_types.find(x => x.id === DEVICEs[loopDeviceId].type).fw_maxsize * 1024) <= FW_update.hexSize) {
            eventMessage("DEVICE with ID: " + loopDeviceId + " has less space as Firmware... Jump to the next")
            firmwareSizeExceeded = 1;
            actDeviceFlashStat = 0;
            actDeviceFlashPage = 0;
            DEVICEs[loopDeviceId].asBL = false;
            loopDeviceId++;
        } else
            if (waitForResponseID == 0) {
                if (actDeviceFlashStat < 2) {
                    if (actDeviceFlashStat == 0) {
                        eventMessage("Starting to flash DEVICE with ID: " + loopDeviceId + "...");
                        if (!DEVICEs[loopDeviceId].asBL) {
                            send_OneWire_package(loopDeviceId, 0, [OW_RESET_TO_BL]);
                            eventMessage("reset DEVICE with ID: " + loopDeviceId + " to bootloader");
                        }
                        actDeviceFlashStat = 1;
                    } else {
                        send_OneWire_package(loopDeviceId, 0, [OW_OK]);
                        waitForResponseID = loopDeviceId;
                        waitForResponseType = 0;
                        waitForResponseLength = 7;
                        eventMessage("check if DEVICE with ID: " + loopDeviceId + " is in bootloader mode");
                    }
                } else if (actDeviceFlashStat == 2) {
                    send_OneWire_package(loopDeviceId, 0, [OW_BL_PAGES_TO_FLASH, (FW_update.pagesCount & 0xFF), (FW_update.pagesCount >> 8)]);
                    actDeviceFlashPage = FW_update.pagesCount;
                    waitForResponseID = loopDeviceId;
                    waitForResponseType = 0;
                    waitForResponseLength = 7;
                    extraDelay = 1;
                    if (connectionType == VCP) waitLoops = 500;
                    eventMessage("sent to DEVICE with ID: " + loopDeviceId + " the block count that need to be flashed & erase flash command. ");
                } else if (actDeviceFlashStat == 3) {
                    if (actDeviceFlashPage > 0) {
                        send_OneWire_package(loopDeviceId, actDeviceFlashPage, FW_update.preparedPages[actDeviceFlashPage - 1]);
                        eventMessage("sent to DEVICE with ID: " + loopDeviceId + " flash block number: " + actDeviceFlashPage);
                        waitForResponseID = loopDeviceId;
                        waitForResponseType = actDeviceFlashPage;
                        waitForResponseLength = 134;
                        $("#Device_Info_progress_bar_" + loopDeviceId).progressbar({
                            value: Math.round((99 - (99 / FW_update.pagesCount * actDeviceFlashPage)))
                        });
                    } else {
                        $("#Device_Info_progress_bar_" + loopDeviceId).progressbar({
                            value: 100
                        });
                        eventMessage("DEVICE with ID: " + loopDeviceId + " update done");
                        actDeviceFlashStat = 0;
                        actDeviceFlashPage = 0;
                        DEVICEs[loopDeviceId].asBL = false;
                        loopDeviceId++;
                    }
                } else if (actDeviceFlashStat == 4) {
                    send_OneWire_package(loopDeviceId, 0, [OW_BL_PAGE_CORRECT]);
                    waitForResponseID = loopDeviceId;
                    waitForResponseType = 0;
                    waitForResponseLength = 7;
                    eventMessage("verification done, sended write command");
                }
            } else {
                var responsePackage = checkForRespPackage();
                if (responsePackage) {
                    if (responsePackage[1] == loopDeviceId) {
                        timeoutDeviceIDs[loopDeviceId] = 0;
                        if (actDeviceFlashStat == 1) {
                            if (responsePackage[0] == OW_RESPONSE_IN_BL) {
                                DEVICEs[loopDeviceId].asBL = true;
                                eventMessage("DEVICE with ID: " + loopDeviceId + " is in bootloader mode");
                                actDeviceFlashStat = 2;
                            } else {
                                eventMessage("DEVICE with ID: " + loopDeviceId + " don't moves to bootloader!");
                                send_OneWire_package(loopDeviceId, 0, [OW_RESET_TO_BL]);
                                eventMessage("reset DEVICE with ID: " + loopDeviceId + " to bootloader");
                            }
                        } else if (actDeviceFlashStat == 2) {
                            if (responsePackage[5] == 0) {
                                eventMessage("DEVICE with ID: " + loopDeviceId + " confirmed flash erase");
                                actDeviceFlashStat = 3;
                                extraDelay = is_USB_only_bootloader;
                            } else {
                                eventMessage("DEVICE with ID: " + loopDeviceId + " reported error: " + responsePackage[5]);
                            }
                        } else if (actDeviceFlashStat == 3) {
                            eventMessage("received from DEVICE with ID: " + loopDeviceId + " block number: " + actDeviceFlashPage + " for verification.");
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
                                eventMessage("verification failed");
                            }
                        } else if (actDeviceFlashStat == 4) {
                            if (responsePackage[5] == 0) {
                                eventMessage("page written.");
                                actDeviceFlashPage--;
                                actDeviceFlashStat = 3;
                                FlashProcessLoop();
                            } else {
                                eventMessage("page could not be written. error: " + responsePackage[5]);
                                // unable to write block 255 (require BL Update)
                                if (actDeviceFlashPage == 255 && responsePackage[5] == 2) {
                                    eventMessage("Bootloader not supporting more than 255 pages ");
                                    $("#dialog").text("This DEVICE doesn't have the latest bootloader and can't support this firmware. Please flash the available bootloader update. Once completed please flash again this version.");
                                    loopDeviceId = 0;
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
                                timeoutDeviceIDs[loopDeviceId] = 0;
                                actDeviceFlashStat = 2;
                                waitForResponseID = 0;
                                eventMessage("restarting flash process for DEVICE with ID :" + loopDeviceId);
                            }
                        }
                    }
                } else if (++timeoutDeviceIDs[loopDeviceId] == timeout_delay + (350 * extraDelay) || timeoutDeviceIDs[loopDeviceId] == (timeout_delay * 2) + (500 * extraDelay) || timeoutDeviceIDs[loopDeviceId] == (timeout_delay * 3) + (650 * extraDelay)) {
                    sendBytes(LastSentData);
                    eventMessage("no response, retrying");
                } else if (timeoutDeviceIDs[loopDeviceId] > (timeout_delay * 3) + (800 * extraDelay)) {
                    send_OneWire_package(loopDeviceId, 0xFFFF, [loopDeviceId + 10, loopDeviceId + 20]);
                    timeoutDeviceIDs[loopDeviceId] = 0;
                    actDeviceFlashStat = 2;
                    waitForResponseID = 0;
                    eventMessage("restarting flash process for DEVICE with ID :" + loopDeviceId);
                }
            }
    } else {
        if (afterFlashedDisplay == 0) {
            if (is_USB_only_bootloader == 0) {
                change_Devices_status(1, 0, 1);
            } else {
                if (firmwareSizeExceeded == 1) {
                    $("#dialog").text("Firmware file is bigger than available space. Flashing has been stopped.");
                    $("#dialog").dialog({
                        modal: true,
                        buttons: {
                            Ok: function () {
                                $(this).dialog("close");
                            }
                        }
                    });
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
                }
                enableButtons();
                ChangeDisplay(0);
            }
            afterFlashedDisplay = 1;
        } else if (afterFlashedDisplay < 50) afterFlashedDisplay++;
        else if (afterFlashedDisplay == 50) {
            if (is_USB_only_bootloader == 0) change_Devices_status(0);
            afterFlashedDisplay = 51;
        } else if (afterFlashedDisplay == 51) {
            eventMessage('flash process done!');
            if (firmwareSizeExceeded == 1) {
                $("#dialog").text("Firmware file is bigger than available space. Flashing has been stopped.");
                $("#dialog").dialog({
                    modal: true,
                    buttons: {
                        Ok: function () {
                            $(this).dialog("close");
                        }
                    }
                });
            } else {
                $("#dialog").text("Firmware update done! For health and safety always remove all propellers! Please check motor direction.");
                $("#dialog").dialog({
                    modal: true,
                    buttons: {
                        Ok: function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
            loopDeviceId = 0;
            FW_update.FlashProcessActive = 0;
            FW_update.fileUploadInput.disabled = false;
            FW_update.startUpdateInput.disabled = false;
            if (is_USB_only_bootloader == 0) {
                change_Devices_status(1, 1, 1, 1);
            }
            $('#toolbar').empty();
            initFWUpdater(); //lets reset the
        }
    }
}

/* Tools */

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

        if (DEVICE_types.find(x => x.id === DEVICEs[i].type).blOnly != true && i != 23) {
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
                    if (lastRequestedTLM == 2 && DEVICEs[i].TLMValues[lastRequestedTLM] > 0x7FFF) DEVICEs[i].TLMValues[lastRequestedTLM] -= 0xFFFF;
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
            if (DEVICE_types.find(x => x.id === DEVICEs[checkDeviceId].type).telemetryCapable == false) {
                checkDeviceId++;
                return;
            }

            if (checkDEVICEsStats == 0) {
                send_OneWire_package(checkDeviceId, 0, [OW_OK]);
                waitForResponseID = checkDeviceId;
                waitForResponseType = 0;
                waitForResponseLength = 7;
                eventMessage("check with id: " + checkDeviceId + " ");
            } else {
                send_OneWire_package(checkDeviceId, 0, [OW_SET_FAST_COM_LENGTH, (Math.ceil((12 + (((maxDeviceId - minDeviceId) + 1) * 11)) / 8) + 1), minDeviceId, (maxDeviceId - minDeviceId) + 1]);
                waitForResponseID = checkDeviceId;
                waitForResponseType = 0;
                waitForResponseLength = 7;
                eventMessage("set fast throttle for DEVICE with id: " + checkDeviceId + " ");
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
                            eventMessage("DEVICE with id: " + checkDeviceId + " remains in bootloader mode ->retry");
                            send_OneWire_package(checkDeviceId, 0, [OW_BL_START_FW]);
                            blProblem = 1;
                        } else {
                            eventMessage("DEVICE with id: " + checkDeviceId + " remains in bootloader mode ->stop");
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
            } else if (++timeoutDeviceIDs[checkDeviceId] == timeout_delay || timeoutDeviceIDs[checkDeviceId] == timeout_delay * 2 || timeoutDeviceIDs[checkDeviceId] == timeout_delay * 3) {
                sendBytes(LastSentData);
                eventMessage("no response, retrying");
            } else if (timeoutDeviceIDs[checkDeviceId] > timeout_delay * 3) {
                eventMessage("no response from DEVICE with id: " + checkDeviceId + " ->stop");
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
        if (DEVICE_types.find(x => x.id === DEVICEs[i].type).telemetryCapable == false) break;
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

/* ConfigurationLoop */

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
            if ((DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].eever != 0 && DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].eever > DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[0].value) || DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].DeviceTypes.indexOf(DEVICEs[readDeviceIDs[deviceIdIndex]].type) == -1) {
                deviceSettingIndex++;
                checkDEVICEsStats = 0;
                return;
            }
            if (checkDEVICEsStats == 0) {
                send_OneWire_package(readDeviceIDs[deviceIdIndex], 0, [OW_OK]);
                waitForResponseID = readDeviceIDs[deviceIdIndex];
                waitForResponseType = 0;
                waitForResponseLength = 7;
                eventMessage("check with id: " + readDeviceIDs[deviceIdIndex] + " ");
            } else {
                send_OneWire_package(readDeviceIDs[deviceIdIndex], 0, [DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].getCommand], DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].CommandType);
                waitForResponseID = readDeviceIDs[deviceIdIndex];
                waitForResponseType = 0;
                waitForResponseLength = 6 + DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount;
                eventMessage("requesting Setting " + DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].name + " with command " + DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].getCommand + " from DEVICE with id: " + readDeviceIDs[deviceIdIndex] + " ");
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
                            eventMessage("DEVICE with id: " + readDeviceIDs[deviceIdIndex] + " remains in bootloader mode ->retry");
                            send_OneWire_package(readDeviceIDs[deviceIdIndex], 0, [OW_BL_START_FW]);
                            blProblem = 1;
                        } else {
                            eventMessage("DEVICE with id: " + readDeviceIDs[deviceIdIndex] + " remains in bootloader mode ->stop");
                            serialBadError = 1;
                            //checkDeviceId++;
                            blProblem = 0;
                        }
                    }
                } else {
                    var firstBytePos = 5;
                    // FC commands haben ein 0xFF als "normales" command
                    if (DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].CommandType) firstBytePos++;

                    if (DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 1) {
                        DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].value = responsePackage[firstBytePos];
                    } else if (DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 2) {
                        DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].value = (responsePackage[firstBytePos] << 8) | responsePackage[firstBytePos + 1];
                    } else if (DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 4) {
                        DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].value = (responsePackage[firstBytePos] << 24) | (responsePackage[firstBytePos + 1] << 16) | (responsePackage[firstBytePos + 2] << 8) | responsePackage[firstBytePos + 3];
                    } else {
                        DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].value = [];
                        for (i = firstBytePos; i < firstBytePos + DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount; i++) DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].value.push(responsePackage[i]);
                    }
                    checkDEVICEsStats = 0;
                    eventMessage("Setting " + DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].name + " from DEVICE with id: " + readDeviceIDs[deviceIdIndex] + " is " + DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].value + " bytecound: " + DEVICEs[readDeviceIDs[deviceIdIndex]].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount);
                    deviceSettingIndex++;
                }
            } else if (++timeoutDeviceIDs[readDeviceIDs[deviceIdIndex]] == timeout_delay || timeoutDeviceIDs[readDeviceIDs[deviceIdIndex]] == timeout_delay * 2 || timeoutDeviceIDs[readDeviceIDs[deviceIdIndex]] == timeout_delay * 3) {
                sendBytes(LastSentData);
                eventMessage("no response, retrying");
            } else if (timeoutDeviceIDs[readDeviceIDs[deviceIdIndex]] > timeout_delay * 3) {
                eventMessage("no response from DEVICE with id: " + readDeviceIDs[deviceIdIndex] + " ->stop");
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
                eventMessage("allChanges saved");
                document.getElementById("device_save_id_" + saveNewSettingsToId).className = "settings_save_button_inactive ui-button";
                saveNewSettingsToId = 0;
                return;
            }

            if (checkDEVICEsStats == 0) {
                send_OneWire_package(saveNewSettingsToId, 0, [DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].getCommand], DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].CommandType);
                waitForResponseID = saveNewSettingsToId;
                waitForResponseType = 0;
                waitForResponseLength = 6 + DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount;
                eventMessage("GET Setting " + DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].name + " with command " + DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].getCommand + " from DEVICE with id: " + saveNewSettingsToId + " ");
            } else {
                if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 1) {
                    send_OneWire_package(saveNewSettingsToId, 0, [(DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].setCommand), newSettingsValues[readDeviceSettings[deviceSettingIndex]]], DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].CommandType);
                } else if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 2) {
                    send_OneWire_package(saveNewSettingsToId, 0, [(DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].setCommand), (newSettingsValues[readDeviceSettings[deviceSettingIndex]] >> 8), (newSettingsValues[readDeviceSettings[deviceSettingIndex]] & 0xFF)], DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].CommandType);
                } else if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 4) {
                    send_OneWire_package(saveNewSettingsToId, 0, [(DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].setCommand), (newSettingsValues[readDeviceSettings[deviceSettingIndex]] >> 24), (newSettingsValues[readDeviceSettings[deviceSettingIndex]] >> 16) & 0xFF, (newSettingsValues[readDeviceSettings[deviceSettingIndex]] >> 8) & 0xFF, (newSettingsValues[readDeviceSettings[deviceSettingIndex]] & 0xFF)], DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].CommandType);
                } else {
                    var sendArr = [(DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].setCommand)];
                    for (i = 0; i < DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].value.length; i++) sendArr.push(newSettingsValues[readDeviceSettings[deviceSettingIndex]][i]);
                    send_OneWire_package(saveNewSettingsToId, 0, sendArr, DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].CommandType);
                }
                if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].getCommand == OW_GET_ID) {
                    waitForResponseID = newSettingsValues[readDeviceSettings[deviceSettingIndex]];
                } else {
                    waitForResponseID = saveNewSettingsToId;
                }
                waitForResponseType = 0;
                waitForResponseLength = 7;
                eventMessage("SET Setting " + DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].name + " with command " + (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].getCommand + 1) + " to:" + newSettingsValues[readDeviceSettings[deviceSettingIndex]] + " at DEVICE with id: " + saveNewSettingsToId + " ");
            }
        } else {
            var firstBytePos = 5;
            // FC commands haben ein 0xFF als "normales" command
            if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].CommandType) firstBytePos++;
            var responsePackage = checkForRespPackage();
            if (responsePackage) {
                timeoutDeviceIDs[saveNewSettingsToId] = 0;
                if (checkDEVICEsStats == 0) {
                    var responsePayload = 0;
                    if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 1) {
                        responsePayload = responsePackage[firstBytePos];
                    } else if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 2) {
                        responsePayload = (responsePackage[firstBytePos] << 8) | responsePackage[firstBytePos + 1];
                    }
                    else if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount == 4) {
                        responsePayload = (responsePackage[firstBytePos] << 24) | (responsePackage[firstBytePos + 1] << 16) | (responsePackage[firstBytePos + 2] << 8) | responsePackage[firstBytePos + 3];
                    } else {
                        responsePayload = [];
                        for (i = 0; i < DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].byteCount; i++) responsePayload.push(responsePackage[firstBytePos + i]);
                    }
                    if ((responsePayload == DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].value) || DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].type == "3colTable") {
                        eventMessage("GET response correct");
                        checkDEVICEsStats++;
                    } else {
                        eventMessage("SET response not correct (" + responsePayload + ") instead of (" + DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].value + "). stop");
                        serialBadError = 1;
                        deviceSettingIndex++;
                    }
                    waitForResponseID = 0;
                } else {
                    if (responsePackage[5] == OW_OK) {
                        DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].changed = false;
                        DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].value = newSettingsValues[readDeviceSettings[deviceSettingIndex]];
                        checkDEVICEsStats = 0;
                        if (DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].getCommand == OW_GET_ID) {
                            /*
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
                            */

                            ReScanForDevices();
                            settingsRead = 0;
                            readDeviceIDs = [];
                            readDeviceSettings = [];
                            deviceIdIndex = 0;
                            deviceSettingIndex = 0;
                            checkDEVICEsStats = 0;
                            saveNewSettingsToId = 0;
                            //ConfigLoop();

                            return;
                        }
                        eventMessage("saved setting: " + DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].name);
                        deviceSettingIndex++;
                    } else {
                        eventMessage("error while saving..." + DEVICEs[saveNewSettingsToId].DeviceSettings[readDeviceSettings[deviceSettingIndex]].name);
                        checkDEVICEsStats = 0;
                        deviceSettingIndex++;
                    }
                    waitForResponseID = 0;
                }
            } else if (++timeoutDeviceIDs[saveNewSettingsToId] == timeout_delay || timeoutDeviceIDs[saveNewSettingsToId] == timeout_delay * 2 || timeoutDeviceIDs[saveNewSettingsToId] == timeout_delay * 3) {
                sendBytes(LastSentData);
                eventMessage("no response, retrying");
            } else if (timeoutDeviceIDs[saveNewSettingsToId] > timeout_delay * 3) {
                eventMessage("no response from DEVICE with id: " + saveNewSettingsToId + " ->stop");
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
        if ((DEVICEs[ID].DeviceSettings[y].min != 0 || DEVICEs[ID].DeviceSettings[y].max != 0) && DEVICEs[ID].DeviceSettings[y].DeviceTypes.includes(DEVICEs[ID].type)) {
            if (DEVICEs[ID].DeviceSettings[y].min == 0 && DEVICEs[ID].DeviceSettings[y].max == 1) { // just active or inactive
                if (document.getElementById(DEVICEs[ID].DeviceSettings[y].getCommand + "_setting_id_" + ID).checked) {
                    newSettingsValues[y] = 1;
                    document.getElementById(DEVICEs[ID].DeviceSettings[y].getCommand + "_setting_id_" + ID).parentElement.className = "setting_container setting_container_active";
                } else {
                    newSettingsValues[y] = 0;
                    document.getElementById(DEVICEs[ID].DeviceSettings[y].getCommand + "_setting_id_" + ID).parentElement.className = "setting_container setting_container_inactive";
                }
            } else if (DEVICEs[ID].DeviceSettings[y].type == "3colTable") { // array
                var ArrCount = DEVICEs[ID].DeviceSettings[y].byteCount / 2;
                var ByteArray = [];
                for (i = 0; i < ArrCount; i++) {
                    if (DEVICEs[ID].DeviceSettings[y].name.includes("<float>")) {
                        var fieldValue = getI16Fromfloat(1000, document.getElementById(DEVICEs[ID].DeviceSettings[y].getCommand + "_setting_id_" + ID + "_" + i).value);
                    } else {
                        var fieldValue = parseInt(document.getElementById(DEVICEs[ID].DeviceSettings[y].getCommand + "_setting_id_" + ID + "_" + i).value);
                    }
                    ByteArray.push((fieldValue >> 8) & 0xFF);
                    ByteArray.push(fieldValue & 0xFF);
                }
                var ArrayChanged = false;
                for (i = 0; i < ByteArray.length; i++) {
                    if (ByteArray[i] != DEVICEs[ID].DeviceSettings[y].value[i]) ArrayChanged = true;
                }
                if (ArrayChanged) {
                    changedSettings = true;
                    DEVICEs[ID].DeviceSettings[y].changed = true;
                    newSettingsValues[y] = ByteArray;
                }

            } else { /* value */
                newSettingsValues[y] = parseInt(document.getElementById(DEVICEs[ID].DeviceSettings[y].getCommand + "_setting_id_" + ID).value);
                if (newSettingsValues[y] > DEVICEs[ID].DeviceSettings[y].max) newSettingsValues[y] = DEVICEs[ID].DeviceSettings[y].max;
                if (newSettingsValues[y] < DEVICEs[ID].DeviceSettings[y].min) newSettingsValues[y] = DEVICEs[ID].DeviceSettings[y].min;
                document.getElementById(DEVICEs[ID].DeviceSettings[y].getCommand + "_setting_id_" + ID).value = newSettingsValues[y];
            }
            if (newSettingsValues[y] != DEVICEs[ID].DeviceSettings[y].value && DEVICEs[ID].DeviceSettings[y].type != "3colTable") {
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
    /* collect Settings-  */
    var changedSettings = checkChangedSettings(ID);
    if (DEVICEs[ID].DeviceSettings[199].changed && ID < 23) {
        var ID_is_free = 1;
        for (i = 0; i < readDeviceIDs.length; i++) {
            if (newSettingsValues[199] == readDeviceIDs[i]) ID_is_free = 0;
        }
        if (ID_is_free == 0) {
            $("#dialog").text("OneWire ID " + newSettingsValues[199] + " is already in use, please choose another one.");
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
        saveNewSettingsToId = ID;
    }
}