const { readFileSync, writeFileSync } = require("node:fs");
const { Buffer } = require("node:buffer");
const { iv, password, path } = require("./key");
const { gfMulBy2Map, gfMulBy3Map, gfMulBy1Map, toHex, T1, T2, T3, T4, TT1, TT2, TT3, TT4, sBox } = require("./base");

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

  const mixColumns0 = (i32) => {
    let c0 = (i32 >> 24) & 0xff;
    let c1 = (i32 >> 16) & 0xff;
    let c2 = (i32 >>  8) & 0xff;
    let c3 = (i32      ) & 0xff;
    c0 = sBox[c0];
    c1 = sBox[c1];
    c2 = sBox[c2];
    c3 = sBox[c3];
    const result0 = gfMulBy2Map[c0] ^ gfMulBy3Map[c1] ^ gfMulBy1Map[c2] ^ gfMulBy1Map[c3];
    const result1 = gfMulBy1Map[c0] ^ gfMulBy2Map[c1] ^ gfMulBy3Map[c2] ^ gfMulBy1Map[c3];
    const result2 = gfMulBy1Map[c0] ^ gfMulBy1Map[c1] ^ gfMulBy2Map[c2] ^ gfMulBy3Map[c3];
    const result3 = gfMulBy3Map[c0] ^ gfMulBy1Map[c1] ^ gfMulBy1Map[c2] ^ gfMulBy2Map[c3];
    return (result0 << 24) | (result1 << 16) | (result2 << 8) | result3;
  }

  const mixColumns1 = (i32) => {
    let c0 = (i32 >> 24) & 0xff;
    let c1 = (i32 >> 16) & 0xff;
    let c2 = (i32 >>  8) & 0xff;
    let c3 = (i32      ) & 0xff;
    c0 = sBox[c0];
    c1 = sBox[c1];
    c2 = sBox[c2];
    c3 = sBox[c3];
    let result = (
      (T1[c0]) ^ 
      (T2[c1]) ^ 
      (T3[c2]) ^ 
      (T4[c3])
    );
    return result;
  }

  const Nk = 4;
  const Nr = 10;
  const Rcon = [
    [],
    [0x01000000],
    [0x02000000],
    [0x04000000],
    [0x08000000],
    [0x10000000],
    [0x20000000],
    [0x40000000],
    [0x80000000],
    [0x1b000000],
    [0x36000000],
  ];

  const keyExpansion = (key) => {
    const addWord = (w1, w2) => {
      return w1 ^ w2;
    };
    const subWord = (w) => {
      return (
        sBox[(w >> 24) & 0xff] << 24 |
        sBox[(w >> 16) & 0xff] << 16 |
        sBox[(w >>  8) & 0xff] <<  8 |
        sBox[ w        & 0xff] 
      );
    };

    const rotWord = (w) => {
      return ((w << 8) & 0xffffff00) | ((w >> 24) & 0xff);
    };

    const printWord = (w) => {
      return toHex(w, 32);
    }

    const w = [];
    let i = 0;
    while (i <= Nk - 1) {
      w[i] = 
        (key[4 * i    ] << 24) | 
        (key[4 * i + 1] << 16) | 
        (key[4 * i + 2] <<  8) | 
        (key[4 * i + 3]);
      i++;
    }
    while (i <= 4 * Nr + 3) {
      let temp = w[i - 1];
      if (i % Nk == 0) {
        temp = rotWord(temp);
        temp = subWord(temp);
        temp = addWord(temp, Rcon[i / Nk]);
      } else if (Nk > 6 && i % Nk == 4) {
        temp = subWord(temp);
      }
      w[i] = addWord(w[i - Nk], temp);
      i++;
    }
    return w;
  };


  const mixColumns = (i32) => {
    const c0 = (i32 >> 24) & 0xff;
    const c1 = (i32 >> 16) & 0xff;
    const c2 = (i32 >>  8) & 0xff;
    const c3 = (i32      ) & 0xff;
    return (
      (TT1[c0]) ^ 
      (TT2[c1]) ^ 
      (TT3[c2]) ^ 
      (TT4[c3])
    );
  }

  const cipher = (input, w) => {
    let s = input;
    let round = 0;
    for (let i = 0; i < 4; i++) {
      s[i] ^= w[i];
    }
    let temp = new Int32Array(4);
    for (round = 1; round <= Nr - 1; round++) {
      for (let i = 0; i < 4; i++) {
        temp[i] = 
          TT1[(s[i          ] >> 24) & 0xff] ^
          TT2[(s[(i + 1) % 4] >> 16) & 0xff] ^
          TT3[(s[(i + 2) % 4] >>  8) & 0xff] ^
          TT4[ s[(i + 3) % 4]        & 0xff] ^ 
          w[round * 4 + i];
      }
      s = temp.slice();
    }

    for (let i = 0; i < 4; i++) {
      temp[i] = (
        (sBox[(s[ i]          >> 24) & 0xff] << 24) |
        (sBox[(s[(i + 1) % 4] >> 16) & 0xff] << 16) |
        (sBox[(s[(i + 2) % 4] >>  8) & 0xff] <<  8) |
        (sBox[(s[(i + 3) % 4]      ) & 0xff]      ) 
      ) ^ w[Nr * 4 + i];
    }
    return temp;
  };

  const arrayToState = (a) => {
    const result = new Int32Array(4);
    for (let i = 0; i < 4; i++) {
      result[i] = 
        a[i * 4    ] << 24 |
        a[i * 4 + 1] << 16 |
        a[i * 4 + 2] <<  8 |
        a[i * 4 + 3];
    }
    return result;
  };


  const invCfb = (pwdArray, ivArray, ptByteArray) => {
    const expansionKey = keyExpansion(pwdArray);
    const output = new Int8Array(ptByteArray.length);
    let en = cipher(arrayToState(ivArray), expansionKey);
    for (let i = 0; i < ptByteArray.length; i += 16) {
      let ptArray = ptByteArray.slice(i, i + 16);
      let ptI32Array = byteArrayToInt32(ptArray);
      for (let j = 0; j < 4; j++) {
        en[j] ^= ptI32Array[j];
      }

      for (let j = 0; j < 4; j++) {
        output[i + j * 4    ] = (en[j] >> 24) & 0xff;
        output[i + j * 4 + 1] = (en[j] >> 16) & 0xff;
        output[i + j * 4 + 2] = (en[j] >>  8) & 0xff;
        output[i + j * 4 + 3] = (en[j]      ) & 0xff;
      }
      en = cipher(ptI32Array, expansionKey);
    }
    return output;
  };


  console.log(toHex(mixColumns0(0x00010203), 32));
  console.log(toHex(mixColumns0(0x04050607), 32));
  console.log(toHex(mixColumns0(0x08090a0b), 32));
  console.log(toHex(mixColumns0(0x0c0d0e0f), 32));

  console.log("-------------");

  console.log(toHex(mixColumns1(0x00010203), 32));
  console.log(toHex(mixColumns1(0x04050607), 32));
  console.log(toHex(mixColumns1(0x08090a0b), 32));
  console.log(toHex(mixColumns1(0x0c0d0e0f), 32));

  console.log("-------------");
  console.log(toHex(mixColumns(0x00010203), 32));
  console.log(toHex(mixColumns(0x04050607), 32));
  console.log(toHex(mixColumns(0x08090a0b), 32));
  console.log(toHex(mixColumns(0x0c0d0e0f), 32));

  console.log("-------------");
  cipher(
    [
      0x3243f6a8, 
      0x885a308d, 
      0x313198a2,
      0xe0370734,
    ],
    keyExpansion([
      0x2b, 0x7e, 0x15, 0x16, 
      0x28, 0xae, 0xd2, 0xa6, 
      0xab, 0xf7, 0x15, 0x88,
      0x09, 0xcf, 0x4f, 0x3c,
    ])
  );

  const fileBuff = readFileSync(path);

  const textToArray = (t) => {
    const result = [];
    for (let i = 0; i < t.length; i++) {
      result[i] = t.charCodeAt(i);
    }
    return result;
  };
  let time1 = new Date();
  let output1 = invCfb(textToArray(password), textToArray(iv), fileBuff);
  let time2 = new Date();
  console.log(`invCfb take ${time2.getTime() - time1.getTime()}`)
  writeFileSync("./outp.jpg", Buffer.from(output1));

  console.log("end");
})();