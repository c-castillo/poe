pragma solidity 0.4.24;

import "zeppelin/contracts/lifecycle/Destructible.sol";


contract ProofRegistry is Destructible {

    mapping(address => Proof[]) public proofs;
    mapping(bytes32 => ExistingProof) private hashes;
    address public owner;

    struct Proof {
        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
        string tags;
    }

    struct ExistingProof {
        address owner;
        uint8 exists;
    }

    // Fallback function. It is marked as payable to avoid REVERT
    // if accidentally some ether is sent
    function() public payable { }

    // createProof updates two contract variables
    // proofs is the proof registry itself,
    // whereas hashes is used to verify ownership of
    // a given ipfs hash
    function createProof(bytes32 _digest, uint8 _hashFunction, uint8 _size, string _tags)
        public
        returns (bool success)
    {
        bytes32 _ipfsHash = getIPFSHash(_digest, _hashFunction, _size);
        require(hashes[_ipfsHash].exists != 1);
        proofs[msg.sender].push(Proof(_digest, _hashFunction, _size, _tags));
        hashes[_ipfsHash] = ExistingProof({owner: msg.sender, exists: 1});
        return true;
    }

    // cerifyProof is a contract function that was not implemented in the Dapp
    // it was meant to quickly verify the ownership of a given ipfsHash
    // the creator of the content can create a http uri to prove ownership of the content
    function verifyProof(address _address, bytes32 _digest, uint8 _hashFunction, uint8 _size)
        public
        view
        returns(bool)
    {
        bytes32 _ipfsHash = getIPFSHash(_digest, _hashFunction, _size);
        if (hashes[_ipfsHash].owner == _address) {
            return true;
        } else {
            return false;
        }
    }

    //getNumberOfProofs is used to get an integer.
    // An iterator using this result will query directly the proofs variable
    function getNumberOfProofs()
        public
        view
        returns (uint)
    {
        return proofs[msg.sender].length;
    }

    // Getting the IPFS hash using the parts. It is pure since it doesn't
    // interact with the contract state
    function getIPFSHash(bytes32 _digest, uint8 _hashFunction, uint8 _size)
        internal
        pure
        returns (bytes32 hash)
    {
        return keccak256(abi.encodePacked(_digest, _hashFunction, _size));
    }

    // Constructor, this is required to make the contract Destructible
    constructor () public {
        owner = msg.sender;
    }


}