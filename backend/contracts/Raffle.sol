// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

error ENTRYFEE_LESS_ERROR();
error ERROR_PAYING_THE_MONEY();
error RAFFLE_NOT_OPEN();
error UPKEEPNOTNEEDED(uint256 currBal, uint256 numPlayers, uint256 raffleState);

contract Raffle is VRFConsumerBaseV2 {
    enum State {
        OPEN,
        CALCULATING
    }

    VRFCoordinatorV2Interface private immutable COORDINATOR;
    uint256 private immutable EntranceFee;
    address payable[] private Contestants;
    bytes32 private immutable Gaslane;
    uint64 private immutable SubscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable CallbackGasLimit;
    uint32 private constant NUM_WORDS = 1;
    uint256 private LastTimeStamp;
    uint256 private immutable Interval;

    address private Winner;
    State private s_State;

    event EnteredRaffle(address indexed contestant);
    event RequestRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address _vrfCoordinator,
        uint256 _EntranceFee,
        bytes32 _gasLane,
        uint64 _subscriptionId,
        uint32 _callbackGasLimit,
        uint256 _interval
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        EntranceFee = _EntranceFee;
        Gaslane = _gasLane;
        SubscriptionId = _subscriptionId;
        CallbackGasLimit = _callbackGasLimit;
        s_State = State.OPEN;
        LastTimeStamp = block.timestamp;
        Interval = _interval;
    }

    function getEntranceFee() public view returns (uint256) {
        return EntranceFee;
    }

    function checkUpkeep(bytes memory checkData)
        public
        returns (bool upkeepNeeded, bytes memory)
    {
        bool isOpen = State.OPEN == s_State;
        bool TimeStamp = (block.timestamp - LastTimeStamp) > Interval;
        bool hasPlayers = (Contestants.length > 0);
        bool hasBalance = address(this).balance > 0;
        bool upkeepNeeded = (isOpen && TimeStamp && hasPlayers && hasBalance);
    }

    function performUpkeep(bytes calldata) external {
        (bool upKeepNeed, ) = checkUpkeep("");
        if (!upKeepNeed)
            revert UPKEEPNOTNEEDED(
                address(this).balance,
                Contestants.length,
                uint256(s_State)
            );
        s_State = State.CALCULATING;
        uint256 requestId = COORDINATOR.requestRandomWords(
            Gaslane,
            SubscriptionId,
            REQUEST_CONFIRMATIONS,
            CallbackGasLimit,
            NUM_WORDS
        );

        emit RequestRaffleWinner(requestId);
    }

    function fulfillRandomWords(uint256, uint256[] memory randomWords)
        internal
        override
    {
        uint256 indexOfRandomWinner = randomWords[0] % Contestants.length;
        address payable _Winner = Contestants[indexOfRandomWinner];
        Winner = _Winner;
        s_State = State.OPEN;
        Contestants = new address payable[](0);
        LastTimeStamp = block.timestamp;
        (bool success, ) = _Winner.call{value: address(this).balance}("");
        if (!success) {
            revert ERROR_PAYING_THE_MONEY();
        }
        emit WinnerPicked(_Winner);
    }

    function EnterRaffle() public payable {
        if (msg.value < EntranceFee) revert ENTRYFEE_LESS_ERROR();
        if (s_State != State.OPEN) revert RAFFLE_NOT_OPEN();
        Contestants.push(payable(msg.sender));
        emit EnteredRaffle(msg.sender);
    }

    function GetContestant(uint256 i) public view returns (address) {
        return Contestants[i];
    }

    function GetWinner() public view returns (address) {
        return Winner;
    }

    function GetRaffleState() public view returns (State) {
        return s_State;
    }

    function GetnumWords() public pure returns (uint32) {
        return NUM_WORDS;
    }

    function GetNumberOfContestants() public view returns (uint256) {
        return Contestants.length;
    }

    function GetLatestTimestamp() public view returns (uint256) {
        return LastTimeStamp;
    }

    function GetRequestConfirmations() public view returns (uint16) {
        return REQUEST_CONFIRMATIONS;
    }
}
