function dec2hex(n) {
    n = parseInt(n); var c = 'ABCDEF';
    var b = n / 16; var r = n % 16; b = b - (r / 16);
    b = ((b >= 0) && (b <= 9)) ? b : c.charAt(b - 10);
    return ((r >= 0) && (r <= 9)) ? b + '' + r : b + '' + c.charAt(r - 10);
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