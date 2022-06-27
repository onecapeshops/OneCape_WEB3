// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Staking {
  error NotOwnerError();
  address owner;
  uint256 public rewardRate;
  uint256 public totalStaked;
  uint256 public percentPerBlock;
  uint256 public duration;
  address public whitelistedToken;

  // map accounts to account balances
  mapping(address => uint256) public accountBalances;

  // map staker to total staking time
  mapping(address => uint256) public stakingTime;

  constructor(address _address) {
    owner = msg.sender;
    rewardRate = 1 ether;
    percentPerBlock = 1;
    duration = 1 days;
    whitelistedToken = _address;
  }

  // Compliance 
  modifier onlyOwner() {
    if (msg.sender != owner) {
      revert NotOwnerError();
    }
    _;
  }

  // Add Whitelist token
  function whitelistToken(address tokenAddress)
    external
    onlyOwner
  {
    whitelistedToken = tokenAddress;
  }

  // Tokenlock duration
  function setTokenStakeDuration(uint256 _dur) external onlyOwner {
    duration = _dur;
  }

  function getWhitelistedTokenAddresses()
    external
    virtual
    returns (address)
  {
    return whitelistedToken;
  }

  // Adjust Rate of Reward
  function setRewardRate(uint256 _reward) external onlyOwner {
    rewardRate = _reward;
  }

  // Stake Tokens
  function depositTokens(uint256 amount) external {
    accountBalances[msg.sender] += amount;
    if (stakingTime[msg.sender] == 0) {
      stakingTime[msg.sender] += block.timestamp;
    }
    totalStaked += amount;
    ERC20(whitelistedToken).transferFrom(
      msg.sender,
      address(this),
      amount
    );
  }

  // Get Stake pool balance
  function getPoolBalance()
    external
    view
    returns (uint256 balance)
  {
    uint256 balanceToken = 0;
    balanceToken = ERC20(whitelistedToken).balanceOf(address(this));
    return balanceToken;
  }

  // Unstake tokens
  function withdrawTokens(uint256 amount) external {
    require(accountBalances[msg.sender] >= amount, "Insufficent funds");
    require(
      block.timestamp >= (stakingTime[msg.sender] + duration),
      "Too early"
    );
    totalStaked -= amount;
    accountBalances[msg.sender] -= amount;
    if (accountBalances[msg.sender] == 0) {
      stakingTime[msg.sender] = 0;
    }

    ERC20(whitelistedToken).transfer(msg.sender, amount);
  }

  // Claim staking rewards
  function claimReward() external {
    uint256 earned = 0;
    require(accountBalances[msg.sender] >= 0, "Insufficent funds");
    require(
      ERC20(whitelistedToken).balanceOf(address(this)) >= 0,
      "Insufficent reward funds"
    );
    uint256 stakedAt = stakingTime[msg.sender];
    earned +=
      ((((accountBalances[msg.sender] / 1 ether) * rewardRate) *
        (block.timestamp - stakedAt)) / 10) /
      1 days;

    stakingTime[msg.sender] = block.timestamp;

    ERC20(whitelistedToken).transfer(msg.sender, earned);
  }

  // Check earning info
  function earningInfo(address _user)
    external
    view
    returns (uint256 info)
  {
    uint256 earned = 0;
    uint256 stakedAt = stakingTime[_user];
    earned +=
      (
        ((((accountBalances[_user] / 1 ether) * rewardRate) *
          (block.timestamp - stakedAt)) / 10)
      ) /
      1 days;
    return earned;
  }

  // Get account staked amount 
  function stakedAmount()
    external
    view
    returns (uint256 info)
  {
    return accountBalances[msg.sender];
  }



  function withdraw() external payable virtual {
    require(msg.sender == owner, "This function only called by owner");
    // This will transfer the remaining contract balance to the owner (contractOwner address).
    // Do not remove this otherwise you will not be able to withdraw the funds.
    // =============================================================================
    (bool os, ) = msg.sender.call{ value: address(this).balance }("");
    require(os);
    // =============================================================================
  }
}
