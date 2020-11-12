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

// Begin functions

function send_OneWire_package(id, type, bytes) {
    var B_length = bytes.length + 6;
    DevicePackage = [0x01, id, type, ((type >> 8) & 0xFF), B_length];
    for (var i = 0; i < bytes.length; i++) DevicePackage.push(bytes[i]);
    DevicePackage.push(getCRC(DevicePackage, B_length - 1));
    sendBytes(DevicePackage);
    eventMessage("SND: " + DevicePackage, -2)
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
        eventMessage("RCV: " + responsePackage, -2)
        return responsePackage;
    }
    else return false;
}