export const toFixedNumber = (x: any) => {
  let e;
  if (Math.abs(x) < 1.0) {
    e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
};

export const formatPrice = (price: any, toFixed: number = 8) => {
  if (!price) return 0
  if (price.toString().includes("e")) {
    const _fixed = toFixedNumber(price)
    if (_fixed.startsWith("0.0")) {
      let hasValue = "";
      let zeroStr = "0.";
    
      for (let index = 2; index < _fixed.length; index++) {
        if (_fixed[index] === "0" && !hasValue) {
          zeroStr += "0"
        } else {
          hasValue += _fixed[index]
        }
        if (hasValue.length === 4) {
          break
        }
      }
      return zeroStr + hasValue
    }
    return Math.ceil(_fixed);
  }

  let replaceZero = ".";

  for (let index = 0; index < toFixed; index++) {
    replaceZero += "0";
  }

  let _formatPrice = Number(price)
    .toFixed(toFixed)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,")
    .replace(replaceZero, "");

  return _formatPrice
};


export function decodeAddress(address: string) {
  const encode_address: any = {
    "0": "0",
    "1": "m",
    "2": "h",
    "3": "b",
    "4": "4",
    "5": "n",
    "6": "s",
    "7": "7",
    "8": "t",
    "9": "c",
    a: "g",
    b: "i",
    c: "j",
    d: "k",
    e: "l",
    f: "o",
    x: "x",
  };

  const _address = address.toLocaleLowerCase();

  let decodedAddress = "";

  for (let i = 0; i < address.length; i++) {
    decodedAddress += encode_address[_address.charAt(i)];
  }

  return decodedAddress
};

