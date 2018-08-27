import web3 from "./web3";
//Your contract address
const address = "0x6ff4136013a2100acda6511087d588024a0bfd04";

const abi = [
  {
    constant: false,
    inputs: [
      {
        name: "_ipfsHash",
        type: "string"
      },
      {
        name: "_tags",
        type: "string"
      }
    ],
    name: "createProof",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
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
  {
    constant: true,
    inputs: [],
    name: "getProofs",
    outputs: [
      {
        name: "",
        type: "string[]"
      },
      {
        name: "",
        type: "string[]"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_address",
        type: "address"
      },
      {
        name: "_ipfsHash",
        type: "string"
      }
    ],
    name: "verifyProof",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];
export default new web3.eth.Contract(abi, address);
