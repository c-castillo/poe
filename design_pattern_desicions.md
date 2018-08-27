## Design Pattern Decisions

- The first pattern that was implemented is the ability to `kill` the contract if the owner decides to shut down the app. The IPFS files in storage will remain the way they are but the Dapp won't be able to retrieve any information.

- The fallback function is marked `payable` just in case someone accidentally sends ether to the contract.

- One of the first implementations of the contract implemented the `kill` function reserved only to the owner of the contract. Since zeppelin's code is well tested and can be imported as a library, that custom implementation was dropped in favor of inheriting `Ownable` from zeppelin.

- Regarding the `file->tags` structure, the chosen implementation is less error-prone to a novice solidity developer and also more readable. It is not optimized in terms of block gas usage nor contract storage. An improvement for future versions is using a mapping to store the tags, or just store them off-chain and save the hash of it in the contract.