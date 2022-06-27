/* eslint-disable no-undef */
import { createClient } from 'urql'

const GRAPHQL_ENDPOINT = "https://api.thegraph.com/subgraphs/id/QmZPxh25cojDUNm2o3dBFTz15ARqFE7hWgz11A9H3Y8egS"

const client = createClient({
  url: GRAPHQL_ENDPOINT,
});

export default client;
