// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";


contract Governance is
  Governor,
  GovernorSettings,
  GovernorCountingSimple,
  GovernorVotes,
  GovernorVotesQuorumFraction,
  GovernorTimelockControl
{
  uint256 public votingDelay_;
  uint256 public votingPeriod_;
  uint256 public proposalCount;

  constructor(IVotes _token, TimelockController _timelock)
    Governor("Cape One DAO")
    GovernorSettings(
      1, /* 1 block */
      5, /* 5 block */
      0
    )
    GovernorVotes(_token)
    GovernorVotesQuorumFraction(4)
    GovernorTimelockControl(_timelock)
  {
    proposalCount = 1;
  }

  struct Proposal {
    uint256 proposalId;
    address proposer;
    bytes calldataDetails;
    string description;
    bool isCompleted;
    uint256 proposalTime;
  }

  mapping(uint256 => Proposal) public proposalList;

  event DAOProposal(
    uint256 proposalCount,
    address proposer,
    bytes calldataDetails,
    string description,
    uint256 proposalTime
  );

  // The following functions are overrides required by Solidity.

  function votingDelay()
    public
    view
    override(IGovernor, GovernorSettings)
    returns (uint256)
  {
    return super.votingDelay();
  }

  function votingPeriod()
    public
    view
    override(IGovernor, GovernorSettings)
    returns (uint256)
  {
    return super.votingPeriod();
  }

  // The following functions are overrides required by Solidity.

  function quorum(uint256 blockNumber)
    public
    view
    override(IGovernor, GovernorVotesQuorumFraction)
    returns (uint256)
  {
    return super.quorum(blockNumber);
  }

  // function getVotes(address account, uint256 blockNumber)
  //     public
  //     view
  //     override(IGovernor, GovernorVotes)
  //     returns (uint256)
  // {
  //     return super.getVotes(account, blockNumber);
  // }

  function state(uint256 proposalId)
    public
    view
    override(Governor, GovernorTimelockControl)
    returns (ProposalState)
  {
    return super.state(proposalId);
  }

  function propose(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    string memory description
  ) public override(Governor, IGovernor) returns (uint256) {
    Proposal memory newProposal = Proposal({
      proposalId: proposalCount,
      proposer: msg.sender,
      calldataDetails: calldatas[0],
      description: description,
      isCompleted: false,
      proposalTime: block.timestamp
    });
    proposalList[proposalCount] = newProposal;
    emit DAOProposal(proposalCount, msg.sender, calldatas[0], description, block.timestamp);
    proposalCount++;
    return super.propose(targets, values, calldatas, description);
  }

  function getProposalDetails(uint256 id)
    external
    view
    returns (Proposal memory)
  {
    return proposalList[id];
  }

  function proposalThreshold()
    public
    view
    override(Governor, GovernorSettings)
    returns (uint256)
  {
    return super.proposalThreshold();
  }

  function _execute(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
  ) internal override(Governor, GovernorTimelockControl) {
    super._execute(proposalId, targets, values, calldatas, descriptionHash);
  }

  function _cancel(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
  ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
    return super._cancel(targets, values, calldatas, descriptionHash);
  }

  function _executor()
    internal
    view
    override(Governor, GovernorTimelockControl)
    returns (address)
  {
    return super._executor();
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(Governor, GovernorTimelockControl)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
