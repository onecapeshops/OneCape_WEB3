// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";
import "./OneCapeDAONFT.sol";

contract RaffleDraw is VRFConsumerBaseV2 {
  VRFCoordinatorV2Interface COORDINATOR;
  OneCapeDAONFT onecapeNFT;
  uint64 s_subscriptionId;
  address vrfCoordinator = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;
  bytes32 keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
  uint32 callbackGasLimit = 100000;
  uint16 requestConfirmations = 3;
  uint32 numWords =  1;

  uint256[] public s_randomWords;
  uint256 public s_requestId;
  uint256 public winnerNFTID;
  address s_owner;

  constructor(uint64 subscriptionId, address _onecapedaonft) VRFConsumerBaseV2(vrfCoordinator) {
    COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
    s_owner = msg.sender;
    s_subscriptionId = subscriptionId;
    onecapeNFT = OneCapeDAONFT(_onecapedaonft);
  }

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }

  // func to get OneCapeDAONFT in circulation
  function getOneCapeDAONFTCirc() public view returns (uint256) {
    return onecapeNFT.getTokenCirculations();
  }

    // func to get OneCapeDAONFT in circulation
  function getWinnerResult() public view returns (uint256) {
    return winnerNFTID;
  }

  // Assumes the subscription is funded sufficiently.
  function requestRandomWords() external onlyOwner {
    // Will revert if subscription is not set and funded.
    s_requestId = COORDINATOR.requestRandomWords(
      keyHash,
      s_subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      numWords
    );
  }
  
  function fulfillRandomWords(
    uint256, /* requestId */
    uint256[] memory randomWords
  ) internal override {
    // transform the result to a number between the circulating supply inclusively
    winnerNFTID = (randomWords[0] % onecapeNFT.getTokenCirculations()) + 1;
    s_randomWords = randomWords;
  }

}

