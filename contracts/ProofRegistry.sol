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

    function() public payable { }

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

    function getIPFSHash(bytes32 _digest, uint8 _hashFunction, uint8 _size)
        internal
        pure
        returns (bytes32 hash)
    {
        return keccak256(abi.encodePacked(_digest, _hashFunction, _size));
    }

    constructor () public {
        owner = msg.sender;
    }


}