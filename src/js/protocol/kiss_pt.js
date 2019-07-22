function kissProtocol_preparePassthrough() {
    var outputU8 = [];
    outputU8[0] = 0x58; // request TLM path through
    outputU8[1] = 0;
    outputU8[2] = 0;
    return outputU8;
}