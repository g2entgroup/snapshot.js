import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { multicall } from '../../utils';

export const author = 'G2 & Torch';
export const version = '1.0.0';
const POAP_API_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/poap-xyz/poap/graphql';

const abi = [
  'function ownerOf(uint256 tokenId) public view returns (address owner)'
];

const getTokenSupply = gql`
  query($tokenId: Number!) {
    token(id: $tokenId) {
      event {
        tokenCount
      }
    }
  }
`;

export async function strategy(
  space,
  network,
  provider,
  addresses,
  options,
  snapshot
) {
  const blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
  const response = await multicall(
    network,
    provider,
    abi,
    options.ids.map((id: any) => [options.address, 'ownerOf', [id]]),
    { blockTag }
  );
  const poapWeights = {};
  Object.keys(options.id).map((k) => {
    poapWeights[k] = 1000 / options.id[k];
  });
  // return response[0].owner;
  return Object.fromEntries(
    addresses.map((address: any) => [
      address,
      response.findIndex(
        (res: any) => res.owner.toLowerCase() === address.toLowerCase()
      ) > -1
        ? 1
        : 0
    ])
  );
}
