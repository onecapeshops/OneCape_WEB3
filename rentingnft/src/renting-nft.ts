import { BigInt } from "@graphprotocol/graph-ts"
import {
  RentNFTEvent,
  getNFTAsRentEvent,
  withdrawRentedNFTEvent
} from "../generated/RentingNFT/RentingNFT"
import { RentBook } from "../generated/schema"

export function handleRentNFTEvent(event: RentNFTEvent): void {
  let rent = RentBook.load(event.params.rentAssetID.toString());

  if(!rent){
    rent = new RentBook(event.params.rentAssetID.toString());
    rent.id = event.params.rentAssetID.toString();
    rent.tokenID =event.params.tokenID;
    rent.owner = event.params.owner;
    rent.rentedTo = "";
    rent.amount = event.params.amount;
    rent.deadline = event.params.deadline;
    rent.rentAssetID = event.params.rentAssetID;
    rent.noOfDays = event.params.noOfDays;
    rent.isClosed = false;
    rent.isRentPayed = false;
  }

  rent.createdTimestamp = event.params.createdTimestamp;
  rent.save();
}

export function handlegetNFTAsRentEvent(event: getNFTAsRentEvent): void {
  let rent = RentBook.load(event.params.rentAssetID.toString());

  if(!rent){
    rent = new RentBook(event.params.rentAssetID.toString());
    rent.id = event.params.rentAssetID.toString();
  }
  rent.rentedTo = event.params.rentedTo.toString();
  rent.deadline = event.params.deadlineDate;
  rent.createdTimestamp = event.params.currentTimeStamp;
  rent.isRentPayed = true;
  rent.save();
}

export function handlewithdrawRentedNFTEvent(
  event: withdrawRentedNFTEvent
): void {
  let rent = RentBook.load(event.params.rentAssetID.toString());

  if(!rent){
    rent = new RentBook(event.params.rentAssetID.toString());
    rent.id = event.params.rentAssetID.toString();
  }
  rent.isClosed = true;
  rent.createdTimestamp = event.params.createdTimestamp;
  rent.save();
}
