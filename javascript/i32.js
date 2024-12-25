const { gfMulBy2Map, gfMulBy3Map, gfMulBy1Map, toHex } = require("./base");

(() => {
  console.log("start");
  const byteArrayToInt32 = (ba) => {
    const result = new Int32Array(ba.length / 4);
    for (let i = 0; i < result.length; i++) {
      result[i] = 
        (ba[i * 4    ] << 24) |
        (ba[i * 4 + 1] << 16) |
        (ba[i * 4 + 2] <<  8) |
         ba[i * 4 + 3];
    }
    return result;
  };

  const mixColumns = (i32) => {
    const result0 = gfMulBy2Map[(i32 >> 24) & 0xff] ^ gfMulBy3Map[(i32 >> 16) & 0xff] ^ gfMulBy1Map[(i32 >> 8) & 0xff] ^ gfMulBy1Map[i32 & 0xff];
    const result1 = gfMulBy1Map[(i32 >> 24) & 0xff] ^ gfMulBy2Map[(i32 >> 16) & 0xff] ^ gfMulBy3Map[(i32 >> 8) & 0xff] ^ gfMulBy1Map[i32 & 0xff];
    const result2 = gfMulBy1Map[(i32 >> 24) & 0xff] ^ gfMulBy1Map[(i32 >> 16) & 0xff] ^ gfMulBy2Map[(i32 >> 8) & 0xff] ^ gfMulBy3Map[i32 & 0xff];
    const result3 = gfMulBy3Map[(i32 >> 24) & 0xff] ^ gfMulBy1Map[(i32 >> 16) & 0xff] ^ gfMulBy1Map[(i32 >> 8) & 0xff] ^ gfMulBy2Map[i32 & 0xff];
    return (result0 << 24) | (result1 << 16) | (result2 << 8) | result3;
  }

  console.log(toHex(mixColumns(0x00010203), 32));
  console.log(toHex(mixColumns(0x04050607), 32));
  console.log(toHex(mixColumns(0x08090a0b), 32));
  console.log(toHex(mixColumns(0x0c0d0e0f), 32));

  console.log("end");
})();