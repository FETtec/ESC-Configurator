"user strict";
// Begin const and local var

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

const OW_RESPONSE_IN_BL = 0x02;
const OW_RESPONSE_IN_FW = 0x03;

//OW_ESC commands
// all OW_GET_XXX are always readable.
// all OW_SET_XXX will only work ig the same OW_GET_XXX was requested again, just before SET. to make sure there will be no faulty change
// SET is always GET+1
const OW_RESET_TO_BL = 10;
const OW_THROTTLE = 11;
const OW_REQ_TLM = 12;
const OW_BEEP = 13;
const OW_SET_FAST_COM_LENGTH = 26;
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
const OW_GET_HALL_SENSOR_USAGE = 58;
const OW_SET_HALL_SENSOR_USAGE = 59;
const OW_GET_CURRENT_LIMIT = 60;
const OW_SET_CURRENT_LIMIT = 61;
const OW_GET_NO_ACTIVE_START = 62;
const OW_SET_NO_ACTIVE_START = 63;
const OW_SET_ANALOG_THROTTLE = 64;
const OW_GET_ANALOG_THROTTLE = 65;
const OW_SET_CELL_COUNT = 66;
const OW_GET_CELL_COUNT = 67;
const OW_SET_TURNOFF_VOLTAGE = 68;
const OW_GET_TURNOFF_VOLTAGE = 69;
const OW_SET_CELL_MAX_VOLTAGE = 70;
const OW_GET_CELL_MAX_VOLTAGE = 71;
const OW_SET_CM_PER_ERPM = 72;
const OW_GET_CM_PER_ERPM = 73;
const OW_SET_BRAKE_ACTIVE = 74;
const OW_GET_BRAKE_ACTIVE = 75;
const OW_SET_ANALOG_BRAKE = 76;
const OW_GET_ANALOG_BRAKE = 77;
const OW_SET_BEC_VOLTAGE = 78;
const OW_GET_BEC_VOLTAGE = 79;
const OW_SET_MAX_OUTPUT_CURRENT_LIMIT = 80;
const OW_GET_MAX_OUTPUT_CURRENT_LIMIT = 81;
const OW_SET_HALL_SENSORS_LEVELS = 82;
const OW_GET_HALL_SENSORS_LEVELS = 83;
const OW_SET_MASTER_ESC_MODE = 84;
const OW_GET_MASTER_ESC_MODE = 85;
const OW_SET_TRAPEZOIDAL_MODE = 86;
const OW_GET_TRAPEZOIDAL_MODE = 87;

const OW_SET_FIELD_WEAKENING = 88;
const OW_GET_FIELD_WEAKENING = 89;
const OW_SET_SOFT_START = 90;
const OW_GET_SOFT_START = 91;

const OW_SET_POWER_LIMIT = 92;
const OW_GET_POWER_LIMIT = 93;
const OW_SET_SPEED_LIMIT = 94;
const OW_GET_SPEED_LIMIT = 95;

const OW_SET_FRSKY_PHY_ID = 96;
const OW_GET_FRSKY_PHY_ID = 97;

const OW_SET_FRSKY_APP_ID_ADD = 98;
const OW_GET_FRSKY_APP_ID_ADD = 99;

const OW_SET_FRSKY_TIME_GAP = 100;
const OW_GET_FRSKY_TIME_GAP = 101;

const OW_FC_COMMANDS = 255;



// FC commands
const OW_FC_GET_PIDS = 0;
const OW_FC_SET_PIDS = 1;
const OW_FC_LEN_PIDS = 18;

const OW_FC_GET_EXPO = 2;
const OW_FC_SET_EXPO = 3;
const OW_FC_LEN_EXPO = 6;

const OW_FC_GET_RATE = 4;
const OW_FC_SET_RATE = 5;
const OW_FC_LEN_RATE = 6;

const OW_FC_GET_MIN_COMMAND = 6;
const OW_FC_SET_MIN_COMMAND = 7;
const OW_FC_LEN_MIN_COMMAND = 2;

const OW_FC_GET_PROP_YAW_DIRECTION = 8;
const OW_FC_SET_PROP_YAW_DIRECTION = 9;
const OW_FC_LEN_PROP_YAW_DIRECTION = 1;

const OW_FC_GET_TEST_SET = 10;
const OW_FC_SET_TEST_SET = 11;
const OW_FC_LEN_TEST_SET = 1;

// tell the FC to not send Signal pin data (for bootloader)
const OW_FC_SET_ESCS_NO_SIG = 12;


const OW_FC_GET_MSPD_SERIAL = 13;
const OW_FC_SET_MSPD_SERIAL = 14;
const OW_FC_LEN_MSPD_SERIAL = 1;

const OW_FC_GET_VTX_SERIAL = 15;
const OW_FC_SET_VTX_SERIAL = 16;
const OW_FC_LEN_VTX_SERIAL = 1;

const OW_FC_GET_BEC_OUTPUT = 17;
const OW_FC_SET_BEC_OUTPUT = 18;
const OW_FC_LEN_BEC_OUTPUT = 1;

const OW_FC_GET_CRAFT_TYPE = 19;
const OW_FC_SET_CRAFT_TYPE = 20;
const OW_FC_LEN_CRAFT_TYPE = 1;

const OW_FC_GET_ESC_PROTOCOL = 21;
const OW_FC_SET_ESC_PROTOCOL = 22;
const OW_FC_LEN_ESC_PROTOCOL = 1;

const OW_FC_GET_ESC_MAP14 = 23;
const OW_FC_SET_ESC_MAP14 = 24;
const OW_FC_LEN_ESC_MAP14 = 2;

const OW_FC_GET_ESC_MAP58 = 25;
const OW_FC_SET_ESC_MAP58 = 26;
const OW_FC_LEN_ESC_MAP58 = 2;


// Begin functions


function getFloatFromU8s(Div, val1, val2) {
    return ((val1 << 8) | val2) / Div;
}
function getI16Fromfloat(Multi, val) {
    return Math.round(val * Multi);
}



function send_OneWire_package(id, type, bytes, FCcommand = 0) {
    var B_length = bytes.length + 6;
    if (FCcommand) B_length++;
    DevicePackage = [0x01, id, type, ((type >> 8) & 0xFF), B_length];
    if (FCcommand) DevicePackage.push(OW_FC_COMMANDS);
    for (var i = 0; i < bytes.length; i++) DevicePackage.push(bytes[i]);
    DevicePackage.push(getCRC(DevicePackage, B_length - 1));
    sendBytes(DevicePackage);
    eventMessage("SND: " + DevicePackage, -2);
    //console.log("SND: " + DevicePackage, -2);
}

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
                eventMessage("valid package with " + getLength + "bytes received", -1);
            }
            responseIndex = 0;
            getLength = 5;
            waitForResponseID = 0;
            waitForResponseType = 0;
            waitForResponseLength = 0;
        }
    }
    if (responsePackage.length > 1) {
        eventMessage("RCV: " + responsePackage, -2);
        //console.log("RCV: " + responsePackage, -2);
        return responsePackage;
    }
    else return false;
}