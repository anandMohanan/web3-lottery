// import { ethers } from "hardhat";

import { ethers, network } from "hardhat";
import { verify } from "../utils/verify";
// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//   const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

//   const lockedAmount = ethers.utils.parseEther("1");

//   const Lock = await ethers.getContractFactory("Lock");
//   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//   await lock.deployed();

//   console.log(`Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`);
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

const main = async () => {
  const _vrfCoordinator = "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D";
  const _EntranceFee = ethers.utils.parseEther("0.01");
  const _gasLane =
    "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15";
  const _subscriptionId = "3823";
  const _callbackGasLimit = "500000";
  const _interval = "30";

  let args = [
    _vrfCoordinator,
    _EntranceFee,
    _gasLane,
    _subscriptionId,
    _callbackGasLimit,
    _interval,
  ];
  console.log("deploying");

  const Raffle = await ethers.getContractFactory("Raffle");
  const raffle = await Raffle.deploy(
    _vrfCoordinator,
    _EntranceFee,
    _gasLane,
    _subscriptionId,
    _callbackGasLimit,
    _interval
  );
  await raffle.deployed();
  console.log("Deployed");
  console.log("Verifying");
  await verify(raffle.address, args);
  console.log("Verified");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports.tags = ["all", "raffle"];
