import { ethers } from "hardhat";
import fs from "fs";

const ADDRESS_FILE = "../constants/contractAddress.json";
const ABI_FILE = "../constants/abi.json";

module.exports = async () => {
  const Raffle = await ethers.getContractFactory("Raffle");
  const currAdd = JSON.parse(fs.readFileSync(ADDRESS_FILE, "utf-8"));
  fs.writeFileSync(
    ABI_FILE,
    Raffle.interface.format(ethers.utils.FormatTypes.json) as string
  );
};

module.exports.tags = ["all", "frontend"];
