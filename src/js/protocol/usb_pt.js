function usb_prepareReset() {
    var outputU8 = [];
    outputU8[0] = 0x4F; // request TLM path through
    outputU8[1] = 0x48;
    outputU8[2] = 0x52;
    outputU8[3] = 0x45;
    outputU8[4] = 0x53;
    outputU8[5] = 0x45;
    outputU8[6] = 0x54;
    return outputU8;
}