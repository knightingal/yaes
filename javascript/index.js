// TODO: 1. exchange the columen and row of state matrix
//       2. use int instead of byte array
const { readFileSync, writeFileSync } = require("node:fs");
const { Buffer } = require("node:buffer");
const { iv, password, path } = require("./key");
(() => {
  console.log("index");
  const sBox = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
  ];
  const invSBox = [
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
    0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
    0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
    0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
    0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
    0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
    0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
    0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
    0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
    0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
    0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
    0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
    0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
    0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
    0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
    0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d,
  ];

  const hexMap = [
    "0", "1", "2", "3", "4", "5", "6", "7", 
    "8", "9", "a", "b", "c", "d", "e", "f",
  ];

  const toHex = (n, length = 8, addHeader = false) => {
    // length may be 8, 16, 32
    let result = [];
    for (let i = 0; i < length / 4; i++) {
      if (n == 0) {
        result.unshift("0");
      } else {
        result.unshift(hexMap[n & 0xf]);
        n = n >> 4;
      }
    }
    return (addHeader ? "0x": "") + result.join(""); 
  }


  const subBytes = (s) => {
    const result = [[], [], [], []];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        result[r][c] = sBox[s[r][c]];
      }
    }
    return result;
  };

  const invSubBytes = (s) => {
    const result = [[], [], [], []];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        result[r][c] = invSBox[s[r][c]];
      }
    }
    return result;
  };

  console.log(
    subBytes([
      [0x53, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
  );

  const shiftRows = (s) => {
    const result = [[], [], [], []];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        result[r][c] = s[r][(c + r) % 4];
      }
    }
    return result;
  };

  const invShiftRows = (s) => {
    const result = [[], [], [], []];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        result[r][c] = s[r][(c - r + 4) % 4];
      }
    }
    return result;
  };

  console.log(
    shiftRows([
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
      [12, 13, 14, 15],
    ])
  );

  const gfMul = (d1, d2) => {
    const xTimes = (d) => {
      if ((d & 0b10000000) != 0) {
        return ((d & 0b01111111) << 1) ^ 0b00011011;
      } else {
        return (d & 0b01111111) << 1;
      }
    };

    let carry = d1;
    let result = 0;
    for (let i = 0; i < 8; i++) {
      if ((d2 & 1) != 0) {
        result = result ^ carry;
      }
      carry = xTimes(carry);
      d2 = d2 >> 1;
    }
    return result;
  };
  console.log(gfMul(0x57, 0x13));

  const gfMulBy2Map = [
    0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38,
    40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76,
    78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110,
    112, 114, 116, 118, 120, 122, 124, 126, 128, 130, 132, 134, 136, 138, 140,
    142, 144, 146, 148, 150, 152, 154, 156, 158, 160, 162, 164, 166, 168, 170,
    172, 174, 176, 178, 180, 182, 184, 186, 188, 190, 192, 194, 196, 198, 200,
    202, 204, 206, 208, 210, 212, 214, 216, 218, 220, 222, 224, 226, 228, 230,
    232, 234, 236, 238, 240, 242, 244, 246, 248, 250, 252, 254, 27, 25, 31, 29,
    19, 17, 23, 21, 11, 9, 15, 13, 3, 1, 7, 5, 59, 57, 63, 61, 51, 49, 55, 53,
    43, 41, 47, 45, 35, 33, 39, 37, 91, 89, 95, 93, 83, 81, 87, 85, 75, 73, 79,
    77, 67, 65, 71, 69, 123, 121, 127, 125, 115, 113, 119, 117, 107, 105, 111,
    109, 99, 97, 103, 101, 155, 153, 159, 157, 147, 145, 151, 149, 139, 137,
    143, 141, 131, 129, 135, 133, 187, 185, 191, 189, 179, 177, 183, 181, 171,
    169, 175, 173, 163, 161, 167, 165, 219, 217, 223, 221, 211, 209, 215, 213,
    203, 201, 207, 205, 195, 193, 199, 197, 251, 249, 255, 253, 243, 241, 247,
    245, 235, 233, 239, 237, 227, 225, 231, 229,
  ];

  const gfMulBy3Map = [
    0, 3, 6, 5, 12, 15, 10, 9, 24, 27, 30, 29, 20, 23, 18, 17, 48, 51, 54, 53,
    60, 63, 58, 57, 40, 43, 46, 45, 36, 39, 34, 33, 96, 99, 102, 101, 108, 111,
    106, 105, 120, 123, 126, 125, 116, 119, 114, 113, 80, 83, 86, 85, 92, 95,
    90, 89, 72, 75, 78, 77, 68, 71, 66, 65, 192, 195, 198, 197, 204, 207, 202,
    201, 216, 219, 222, 221, 212, 215, 210, 209, 240, 243, 246, 245, 252, 255,
    250, 249, 232, 235, 238, 237, 228, 231, 226, 225, 160, 163, 166, 165, 172,
    175, 170, 169, 184, 187, 190, 189, 180, 183, 178, 177, 144, 147, 150, 149,
    156, 159, 154, 153, 136, 139, 142, 141, 132, 135, 130, 129, 155, 152, 157,
    158, 151, 148, 145, 146, 131, 128, 133, 134, 143, 140, 137, 138, 171, 168,
    173, 174, 167, 164, 161, 162, 179, 176, 181, 182, 191, 188, 185, 186, 251,
    248, 253, 254, 247, 244, 241, 242, 227, 224, 229, 230, 239, 236, 233, 234,
    203, 200, 205, 206, 199, 196, 193, 194, 211, 208, 213, 214, 223, 220, 217,
    218, 91, 88, 93, 94, 87, 84, 81, 82, 67, 64, 69, 70, 79, 76, 73, 74, 107,
    104, 109, 110, 103, 100, 97, 98, 115, 112, 117, 118, 127, 124, 121, 122, 59,
    56, 61, 62, 55, 52, 49, 50, 35, 32, 37, 38, 47, 44, 41, 42, 11, 8, 13, 14,
    7, 4, 1, 2, 19, 16, 21, 22, 31, 28, 25, 26,
  ];

  const mixColumns = (s) => {
    const result = [[], [], [], []];
    for (let c = 0; c < 4; c++) {
      result[0][c] = gfMul(s[0][c], 2) ^ gfMul(s[1][c], 3) ^ s[2][c] ^ s[3][c];
      result[1][c] = s[0][c] ^ gfMul(s[1][c], 2) ^ gfMul(s[2][c], 3) ^ s[3][c];
      result[2][c] = s[0][c] ^ s[1][c] ^ gfMul(2, s[2][c]) ^ gfMul(3, s[3][c]);
      result[3][c] = gfMul(s[0][c], 3) ^ s[1][c] ^ s[2][c] ^ gfMul(2, s[3][c]);
    }
    return result;
  };

  const invMixColumns = (s) => {
    const result = [[], [], [], []];
    for (let c = 0; c < 4; c++) {
      result[0][c] =
        gfMul(s[0][c], 0x0e) ^
        gfMul(s[1][c], 0x0b) ^
        gfMul(s[2][c], 0x0d) ^
        gfMul(s[3][c], 0x09);
      result[1][c] =
        gfMul(s[0][c], 0x09) ^
        gfMul(s[1][c], 0x0e) ^
        gfMul(s[2][c], 0x0b) ^
        gfMul(s[3][c], 0x0d);
      result[2][c] =
        gfMul(s[0][c], 0x0d) ^
        gfMul(s[1][c], 0x09) ^
        gfMul(s[2][c], 0x0e) ^
        gfMul(s[3][c], 0x0b);
      result[3][c] =
        gfMul(s[0][c], 0x0b) ^
        gfMul(s[1][c], 0x0d) ^
        gfMul(s[2][c], 0x09) ^
        gfMul(s[3][c], 0x0e);
    }
    return result;
  };

  const addRoundKey = (s, w, round) => {
    const result = [[], [], [], []];
    for (let c = 0; c < 4; c++) {
      result[0][c] = s[0][c] ^ w[4 * round + c][0];
      result[1][c] = s[1][c] ^ w[4 * round + c][1];
      result[2][c] = s[2][c] ^ w[4 * round + c][2];
      result[3][c] = s[3][c] ^ w[4 * round + c][3];
    }
    return result;
  };

  const Nk = 4;
  const Nr = 10;
  const Rcon = [
    [],
    [0x01, 0, 0, 0],
    [0x02, 0, 0, 0],
    [0x04, 0, 0, 0],
    [0x08, 0, 0, 0],
    [0x10, 0, 0, 0],
    [0x20, 0, 0, 0],
    [0x40, 0, 0, 0],
    [0x80, 0, 0, 0],
    [0x1b, 0, 0, 0],
    [0x36, 0, 0, 0],
  ];

  const printWord = (w) => {
    let output = "";
    for (let c = 0; c < 4; c++) {
      if (w[c] <= 0xf) {
        output += "0";
      }
      output += w[c].toString(16) + " ";
    }

    return output;
  };
  const keyExpansion = (key) => {
    const addWord = (w1, w2) => {
      return [w1[0] ^ w2[0], w1[1] ^ w2[1], w1[2] ^ w2[2], w1[3] ^ w2[3]];
    };
    const subWord = (w) => {
      return [sBox[w[0]], sBox[w[1]], sBox[w[2]], sBox[w[3]]];
    };

    const rotWord = (w) => {
      return [w[1], w[2], w[3], w[0]];
    };

    const w = [];
    let i = 0;
    while (i <= Nk - 1) {
      w[i] = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
      console.log(`${i}: ${printWord(w[i])}`);
      i++;
    }
    while (i <= 4 * Nr + 3) {
      let temp = w[i - 1];
      console.log(`${i} temp: ${printWord(temp)}`);
      if (i % Nk == 0) {
        temp = rotWord(temp);
        console.log(`${i} temp after rot: ${printWord(temp)}`);
        temp = subWord(temp);
        console.log(`${i} temp after sub: ${printWord(temp)}`);
        console.log(`${i} rcon: ${printWord(Rcon[i / Nk])}`);
        temp = addWord(temp, Rcon[i / Nk]);
      } else if (Nk > 6 && i % Nk == 4) {
        temp = subWord(temp);
      }
      w[i] = addWord(w[i - Nk], temp);
      console.log(`${i}: ${printWord(w[i])}`);
      i++;
    }
    return w;
  };
  keyExpansion([
    0x2b, 0x7e, 0x15, 0x16, 
    0x28, 0xae, 0xd2, 0xa6, 
    0xab, 0xf7, 0x15, 0x88,
    0x09, 0xcf, 0x4f, 0x3c,
  ]);

  const printState = (s) => {
    let output = "";
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (s[r][c] <= 0xf) {
          output += "0";
        }
        output += s[r][c].toString(16) + " ";
      }
      output += "\n";
    }
    return output;
  };
  console.log(
    printState([
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
      [12, 13, 14, 15],
    ])
  );

  const cipher = (input, w) => {
    let state = input;
    // console.log("=========");
    // console.log(printState(state));
    let round = 0;
    state = addRoundKey(state, w, round);
    // console.log(`=========rount ${round + 1}`);
    // console.log(printState(state));
    for (round = 1; round <= Nr - 1; round++) {
      state = subBytes(state);
      state = shiftRows(state);
      state = mixColumns(state);
      state = addRoundKey(state, w, round);
      // console.log(`=========rount ${round + 1}`);
      // console.log(printState(state));
    }
    state = subBytes(state);
    state = shiftRows(state);
    state = addRoundKey(state, w, Nr);
    // console.log(`=========output`);
    // console.log(printState(state));
    return state;
  };

  const invCipher = (input, w) => {
    let state = input;
    console.log("=========");
    console.log(printState(state));
    let round = Nr;
    state = addRoundKey(state, w, round);
    console.log(`=========rount ${round}`);
    console.log(printState(state));
    for (round = Nr - 1; round >= 1; round--) {
      state = invShiftRows(state);
      console.log(`=========rount ${round}, after invshift`);
      console.log(printState(state));
      state = invSubBytes(state);
      console.log(`=========rount ${round}, after invsubbyte`);
      console.log(printState(state));
      state = addRoundKey(state, w, round);
      console.log(`=========rount ${round}, after addRoundkey`);
      console.log(printState(state));
      state = invMixColumns(state);
      console.log(`=========rount ${round}`);
      console.log(printState(state));
    }
    state = invShiftRows(state);
    state = invSubBytes(state);
    state = addRoundKey(state, w, 0);
    console.log(`=========output`);
    console.log(printState(state));
    return state;
  };

  const stateToArray = (s) => {
    let result = [];
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        result.push(s[r][c]);
      }
    }
    return result;
  };

  const arrayToState = (a) => {
    let result = [[], [], [], []];
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        result[r][c] = a[r + 4 * c];
      }
    }
    return result;
  };

  const printArray = (a) => {
    let result = "";
    for (let i = 0; i < a.length; i++) {
      if (a[i] <= 0xf) {
        result += "0";
      }
      result += a[i].toString(16) + " ";
    }
    return result;
  };

  let output = cipher(
    arrayToState([
      0x32, 0x43, 0xf6, 0xa8, 
      0x88, 0x5a, 0x30, 0x8d, 
      0x31, 0x31, 0x98, 0xa2,
      0xe0, 0x37, 0x07, 0x34,
      //   [[0x32, 0x88, 0x31, 0xe0],
      //   [0x43, 0x5a, 0x31, 0x37],
      //   [0xf6, 0x30, 0x98, 0x07],
      //   [0xa8, 0x8d, 0xa2, 0x34],]
    ]),
    keyExpansion([
      0x2b, 0x7e, 0x15, 0x16, 
      0x28, 0xae, 0xd2, 0xa6, 
      0xab, 0xf7, 0x15, 0x88,
      0x09, 0xcf, 0x4f, 0x3c,
    ])
  );

  console.log(printArray(stateToArray(output)));
  let source = invCipher(
    output,
    keyExpansion([
      0x2b, 0x7e, 0x15, 0x16, 
      0x28, 0xae, 0xd2, 0xa6, 
      0xab, 0xf7, 0x15, 0x88,
      0x09, 0xcf, 0x4f, 0x3c,
    ])
  );
  console.log(printArray(stateToArray(source)));

  const textToArray = (t) => {
    const result = [];
    for (let i = 0; i < t.length; i++) {
      result[i] = t.charCodeAt(i);
    }
    return result;
  };

  const arrayToText = (t) => {
    let result = "";
    for (let i = 0; i < t.length; i++) {
      result += String.fromCharCode(t[i]);
    }
    return result;
  };

  const textToArrayArray = (t) => {
    let result = [];
    while (true) {
      let st = t.substring(0, 16);
      if (st.length == 0) {
        break;
      }
      t = t.substring(16);

      result.push(textToArray(st));
    }
    return result;
  };

  const arrayToArrayArray = (t) => {
    let result = [];
    while (true) {
      if (t.length == 0) {
        break;
      }
      let st = t.slice(0, 16);
      t = t.slice(16);

      result.push(st);
    }
    return result;
  };

  const addArray = (a1, a2) => {
    let result = [];
    for (let i = 0; i < 16; i++) {
      result[i] = a1[i] ^ a2[i];
    }
    return result;
  };

  const cfb = (pwdArray, ivArray, ptArrayArray) => {
    let en = cipher(arrayToState(ivArray), keyExpansion(pwdArray));
    console.log(printState(en));
    let enArray = stateToArray(en);
    console.log(printArray(enArray));
    let resultMatrix = [];
    while (true) {
      let ptArray = ptArrayArray.shift();
      if (ptArray == undefined) {
        break;
      }
      ivArray = addArray(ptArray, enArray);
      resultMatrix.push(ivArray);
      en = cipher(arrayToState(ivArray), keyExpansion(pwdArray));
      enArray = stateToArray(en);
    }
    let result = [];
    resultMatrix.forEach((a) => {
      result = result.concat(a);
    });
    return result;
  };

  const invCfb = (pwdArray, ivArray, ptArrayArray) => {
    const expansionKey = keyExpansion(pwdArray);
    let en = cipher(arrayToState(ivArray), expansionKey);
    console.log(printState(en));
    let enArray = stateToArray(en);
    console.log(printArray(enArray));
    let resultMatrix = [];
    while (true) {
      let ptArray = ptArrayArray.shift();
      if (ptArray == undefined) {
        break;
      }
      ivArray = addArray(ptArray, enArray);
      resultMatrix.push(ivArray);
      en = cipher(arrayToState(ptArray), expansionKey);
      enArray = stateToArray(en);
    }
    let result = [];
    resultMatrix.forEach((a) => {
      result = result.concat(a);
    });
    return result;
  };

  let result = cfb(
    textToArray("passwordpassword"),
    textToArray("2021000120210001"),
    textToArrayArray("0123456789abcdef0123456789abcdef")
  );
  console.log(printArray(result));
  let tpResult = invCfb(
    textToArray("passwordpassword"),
    textToArray("2021000120210001"),
    arrayToArrayArray(result)
  );
  console.log(printArray(tpResult));
  console.log(arrayToText(tpResult));

  const fileBuff = readFileSync(path);
  let depArrayArray = arrayToArrayArray(fileBuff.subarray());
  let ouput = invCfb(textToArray(password), textToArray(iv), depArrayArray);
  writeFileSync("./outp.jpg", Buffer.from(ouput));

  console.log("end");
})();
