import { multicall } from '../../utils';
import examplesFile from './examples.json';
import aboutFile from './README.md';

export const author = 'dimsome';
export const version = '0.1.0';
export const examples = examplesFile;
export const about = aboutFile;

const abi = [
  'function ownerOf(uint256 tokenId) public view returns (address owner)'
];

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
    options.tokenIds.map( (id: any) => [ options.address, 'ownerOf', [id] ]),
    { blockTag }
  );

  return Object.fromEntries(
    addresses.map( (address: any) => [
      address,
      response.findIndex((res: any) => res.owner.toLowerCase() === address.toLowerCase()) > -1 ? 1 : 0,
    ])
  );
}
