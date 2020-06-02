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