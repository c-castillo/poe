import web3 from "./web3";

// We use the contract address that is returned by truffle deploy
// The Contract ABI is obtained using the getABI.js script

const address = "0xa65757d5c29c28a5afcd436011ea430fe8b5dc8c";
const abi = [
  {
    constant: true,
    inputs: [{ name: "", type: "address" }, { name: "", type: "uint256" }],
    name: "proofs",
    outputs: [
      { name: "digest", type: "bytes32" },
      { name: "hashFunction", type: "uint8" },
      { name: "size", type: "uint8" },
      { name: "tags", type: "string" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "destroy",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_recipient", type: "address" }],
    name: "destroyAndSend",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "previousOwner", type: "address" },
      { indexed: true, name: "newOwner", type: "address" }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    constant: false,
    inputs: [
      { name: "_digest", type: "bytes32" },
      { name: "_hashFunction", type: "uint8" },
      { name: "_size", type: "uint8" },
      { name: "_tags", type: "string" }
    ],
    name: "createProof",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_address", type: "address" },
      { name: "_digest", type: "bytes32" },
      { name: "_hashFunction", type: "uint8" },
      { name: "_size", type: "uint8" }
    ],
    name: "verifyProof",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getNumberOfProofs",
    outputs: [{ name: "index", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];
export default new web3.eth.Contract(abi, address);
