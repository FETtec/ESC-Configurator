function usb_prepareOWmode() {
    var outputU8 = [];
    outputU8[0] = 0x4F; // request OW pmode
    outputU8[1] = 0x44;
    outputU8[2] = 0x6F;
    outputU8[3] = 0x4F;
    outputU8[4] = 0x57;
    outputU8[5] = 0x50;
    outputU8[6] = 0x54;
    return outputU8;
}

function usb_prepareReset() {
    var outputU8 = [];
    outputU8[0] = 0x4F; // request reset to BL
    outputU8[1] = 0x48;
    outputU8[2] = 0x52;
    outputU8[3] = 0x45;
    outputU8[4] = 0x53;
    outputU8[5] = 0x45;
    outputU8[6] = 0x54;
    return outputU8;
}