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

  

  console.log("end");
})();