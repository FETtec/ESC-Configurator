function bfProtocol_preparePassthrough() {
    var outputU8 = [];
    var BF_CLI_string = "serialpassthrough esc_sensor 2000000 rxtx reset";
    for (var i = 0; i < BF_CLI_string.length; i++) {
        outputU8[i] = BF_CLI_string.charCodeAt(i);
    }
    outputU8.push(0x0A);
    return outputU8;
}