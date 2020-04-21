function dec2hex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}

function hex2dec(n) {
    if (!/^[0-9A-Fa-f]{1,10}$/.test(n)) return '#NUM!';
    var decimal = parseInt(n, 16);
    return (decimal >= 549755813888) ? decimal - 1099511627776 : decimal;
}

function update_crc8(crc, crc_seed) {
    crc_u = crc;
    crc_u ^= crc_seed;
    for (i = 0; i < 8; i++) {
        crc_u = (crc_u & 0x80) ? 0x7 ^ (crc_u << 1) : (crc_u << 1);
        if (crc_u > 256) crc_u -= 256;
    }
    return (crc_u);
}

function getCRC(ByteArray, count) {
    var crc = 0;
    for (var i = 0; i < count; i++) crc = update_crc8(ByteArray[i], crc);
    return crc;
}