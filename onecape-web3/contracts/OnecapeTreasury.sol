// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Treasury is Ownable {
    uint256 public totalFunds;
    address public payee;

    constructor(address _payee) {
        totalFunds = 0;
        payee = _payee;
    }

      // Treasury Tokens
  function depositTokens(uint256 amount, address _address) external {
    totalFunds += amount;
    ERC20(_address).transferFrom(
      msg.sender,
      address(this),
      amount
    );
  }

  // Get Treasury pool balance
  function getTreasuryBalance(address _address)
    external
    view
    returns (uint256 balance)
  {
    uint256 balanceToken = 0;
    balanceToken = ERC20(_address).balanceOf(address(this));
    return balanceToken;
  }

  // Release Funds
  function releaseFunds(uint256 amount, address _address) public onlyOwner {
    uint256 balanceToken = 0;
    balanceToken = ERC20(_address).balanceOf(address(this));
    require(balanceToken >= amount, "Insufficent funds");
    totalFunds -= amount;
    ERC20(_address).transfer(msg.sender, amount);
  }

    function withdraw() external payable virtual {
    require(msg.sender == payee, "This function only called by owner");
    // This will transfer the remaining contract balance to the owner (contractOwner address).
    // Do not remove this otherwise you will not be able to withdraw the funds.
    // =============================================================================
    (bool os, ) = msg.sender.call{ value: address(this).balance }("");
    require(os);
    // =============================================================================
  }

}