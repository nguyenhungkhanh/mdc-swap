import logoImage from "../assets/images/logo.png"
import bnbImage from "../assets/images/bnb.png";
import busdImage from "../assets/images/busd.png";
import usdtImage from "../assets/images/usdt.png";
import btcbImage from "../assets/images/btcb.png";
import ethImage from "../assets/images/eth.png";

export const defaultTokens: any = [
  {
    address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    symbol: "BNB",
    logo: bnbImage,
    decimals: 18,
  },
  {
    address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    symbol: "BUSD",
    logo: busdImage,
    decimals: 18,
  },
  {
    address: "0x55d398326f99059ff775485246999027b3197955",
    symbol: "USDT",
    logo: usdtImage,
    decimals: 18,
  },
  {
    address: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
    symbol: "BTCB",
    logo: btcbImage,
    decimals: 18,
  },
  {
    address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
    symbol: "ETH",
    logo: ethImage,
    decimals: 18,
  },
  {
    address: "0x5566af9836828e9f4d6616b5dffa366ed0d65fe6",
    symbol: "MetaDogeCat",
    logo: logoImage,
    decimals: 9,
  }
]