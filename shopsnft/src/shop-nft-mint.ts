import {
  BoughtNFT,
  DelistSale,
  ListNFT,
  Mint,
  PutNFTForSale,
  Transfer,
  UpdateNFTSalePrice
} from "../generated/ShopNFTMint/ShopNFTMint"
import { Token, Listing } from "../generated/schema"

export function handleMint(event: Mint): void {
  let token = Token.load(event.params.tokenId.toString());

  if(!token){
    token = new Token(event.params.tokenId.toString());
    token.id = event.params.tokenId.toString();
    token.tokenURI = event.params.uri.toString();
    token.forSale = event.params.forSale;
  }

  token.updatedAtTimestamp = event.params.mintTime;
  token.owner = event.params.tokenOwner;
  token.save();
}

export function handleListNFT(event: ListNFT): void {
  let sale = Listing.load(event.params.offeringId.toString());
  let token = Token.load(event.params.tokenID.toString());
  if(!sale){
    sale = new Listing(event.params.offeringId.toString());
    sale.id = event.params.tokenID.toString();
    sale.listingId = event.params.offeringId;
    sale.isSale = event.params.isSale;
    sale.isClosed = event.params.isClosed;
    sale.price = event.params.amount;
    sale.seller = null;
    sale.updatedTimeStamp = event.params.updatedTimeStamp;
    sale.owner = event.params.owner;
  }
  if(!token){
    token = new Token(event.params.tokenID.toString());
    token.id = event.params.tokenID.toString();
  }

  token.forSale = true;
  token.save();
  sale.save();
}

export function handleDelistSale(event: DelistSale): void {
  let sale = Listing.load(event.params.listingId.toString());
  let token = Token.load(event.params.tokenID.toString());
  if(!sale){
    sale = new Listing(event.params.listingId.toString());
    sale.id = event.params.tokenID.toString();
    sale.listingId = event.params.listingId;
  }

  if(!token){
    token = new Token(event.params.tokenID.toString());
    token.id = event.params.tokenID.toString();
  }

  token.forSale = false;
  sale.updatedTimeStamp = event.params.updatedTimeStamp;
  sale.isSale = false;
  sale.isClosed = true;

  token.save();
  sale.save();
}

export function handleUpdateNFTSalePrice(event: UpdateNFTSalePrice): void {
  let sale = Listing.load(event.params.listingId.toString());
  
  if(!sale){
    sale = new Listing(event.params.listingId.toString());
    sale.id = event.params.tokenID.toString();
    sale.listingId = event.params.listingId;
  }
  sale.price = event.params.amount;
  sale.updatedTimeStamp = event.params.updatedTimeStamp;
  sale.save();
}

export function handleBoughtNFT(event: BoughtNFT): void {
  let sale = Listing.load(event.params.listingId.toString());
  let token = Token.load(event.params.tokenID.toString());

  if(!sale){
    sale = new Listing(event.params.listingId.toString());
    sale.id = event.params.tokenID.toString();
    sale.listingId = event.params.listingId;
    sale.price = event.params.amount;
  }

  if(!token){
    token = new Token(event.params.tokenID.toString());
    token.id = event.params.tokenID.toString();
  }

  token.forSale = false;
  token.owner = event.params.buyer;
  sale.updatedTimeStamp = event.params.updatedTimeStamp;
  sale.owner = event.params.buyer;
  sale.isSale = false;
  sale.isClosed = true;

  token.save();
  sale.save();
}

export function handlePutNFTForSale(event: PutNFTForSale): void {}

export function handleTransfer(event: Transfer): void {
  let token = Token.load(event.params.id.toString());

  if(!token){
    token = new Token(event.params.id.toString());
    token.id = event.params.id.toString();
  }
  token.updatedAtTimestamp = event.params.transferTime;
  token.owner = event.params.to;
  token.forSale = false;
  token.save();
}


