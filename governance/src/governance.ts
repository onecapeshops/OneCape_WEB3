import { BigInt } from "@graphprotocol/graph-ts"
import {
  Governance,
  DAOProposal
} from "../generated/Governance/Governance"
import { DAOProposalList } from "../generated/schema"

export function handleDAOProposal(event: DAOProposal): void {
  let proposal = DAOProposalList.load(event.params.proposalCount.toString());

  if(!proposal){
    proposal = new DAOProposalList(event.params.proposalCount.toString());
    proposal.id = event.params.proposalCount.toString();
    proposal.proposalID = event.params.proposalCount;
    proposal.calldataHash = event.params.calldataDetails;
  }

  proposal.description = event.params.description;
  proposal.proposer = event.params.proposer;
  proposal.save();


  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Governance.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.BALLOT_TYPEHASH(...)
  // - contract.COUNTING_MODE(...)
  // - contract.EXTENDED_BALLOT_TYPEHASH(...)
  // - contract.castVote(...)
  // - contract.castVoteBySig(...)
  // - contract.castVoteWithReason(...)
  // - contract.castVoteWithReasonAndParams(...)
  // - contract.castVoteWithReasonAndParamsBySig(...)
  // - contract.getVotes(...)
  // - contract.getVotesWithParams(...)
  // - contract.hasVoted(...)
  // - contract.hashProposal(...)
  // - contract.name(...)
  // - contract.onERC1155BatchReceived(...)
  // - contract.onERC1155Received(...)
  // - contract.onERC721Received(...)
  // - contract.proposalCount(...)
  // - contract.proposalDeadline(...)
  // - contract.proposalEta(...)
  // - contract.proposalSnapshot(...)
  // - contract.proposalThreshold(...)
  // - contract.proposalVotes(...)
  // - contract.propose(...)
  // - contract.queue(...)
  // - contract.quorum(...)
  // - contract.quorumDenominator(...)
  // - contract.quorumNumerator(...)
  // - contract.state(...)
  // - contract.supportsInterface(...)
  // - contract.timelock(...)
  // - contract.token(...)
  // - contract.version(...)
  // - contract.votingDelay(...)
  // - contract.votingDelay_(...)
  // - contract.votingPeriod(...)
  // - contract.votingPeriod_(...)
}
