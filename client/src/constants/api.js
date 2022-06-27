/* eslint-disable import/prefer-default-export */
import { gql } from 'apollo-boost';

export const TOKENS = gql`
  query Tokens {
    tokens {
      id
      tokenURI
      owner
      forSale
    }
  }
`;

export const MARKETPLACE = gql`
  query Marketplace($id: String!) {
    marketplace(id: $id) {
      id
      offeringId
      owner
      isSale
      amount
    }
  }
`;