pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

import "zeppelin/contracts/lifecycle/Destructible.sol";


contract ProofRegistry is Destructible {

    mapping(address => Proof[]) private proofs;
    mapping(string => ExistingProof) private hashes;
    address public owner;

    struct Proof {
        string ipfsHash;
        string tags;
    }

    struct ExistingProof {
        address owner;
        uint8 exists;
    }

    constructor() public {
        owner = msg.sender;
    }

    function() public payable { }

    function createProof(string _ipfsHash, string _tags) public returns(bool) {
        require(hashes[_ipfsHash].exists != 1);
        proofs[msg.sender].push(Proof({ipfsHash: _ipfsHash, tags: _tags}));
        hashes[_ipfsHash] = ExistingProof({owner: msg.sender, exists: 1});
        return true;
    }

    function verifyProof(address _address, string _ipfsHash) public view returns(bool) {
        if (hashes[_ipfsHash].owner == _address) {
            return true;
        } else {
            return false;
        }
    }

    function getProofs() public view returns (string[], string[]) {
        string[] memory hashList = new string[](proofs[msg.sender].length);
        string[] memory tagList = new string[](proofs[msg.sender].length);

        for (uint i = 0; i < proofs[msg.sender].length; i++) {
            Proof storage _proof = proofs[msg.sender][i];
            hashList[i] = _proof.ipfsHash;
            tagList[i] = _proof.tags;
        }

        return (hashList, tagList);
    }

}