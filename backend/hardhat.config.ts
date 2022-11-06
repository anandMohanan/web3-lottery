import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
require("dotenv").config();

const ACCOUNT_KEY = process.env.KEY || "kjhdjsa";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: process.env.URL,
      accounts: [ACCOUNT_KEY],
    },
  },
  solidity: "0.8.17",
  etherscan: {
    apiKey: process.env.ES_API,
  },
};

export default config;
