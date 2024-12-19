(() => {
  console.log("index");

  const subBytes = () => {

  }

  const shiftRows = (d) => {
    const result = [[], [], [], [],];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        result[r][c] = d[r][(c + r) % 4];
      }
    }
    return result;
  }

  console.log(shiftRows([
    [0,1,2,3,],
    [4,5,6,7,],
    [8,9,10,11],
    [12,13,14,15],
  ]));

  const mixColumns = () => {

  }

  const addRoundKey = () => {

  }

  const keyExpansion = () => {

  }

})();
