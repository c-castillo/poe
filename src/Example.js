import React from "react";
import web3 from "./web3";
import Tags from "react-tagging-input";
import ipfs from "./ipfs";
import {
  getBytes32FromMultiash,
  getMultihashFromContractResponse
} from "./multihash";
import proofRegistry from "./proofRegistry";

import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button,
  Row,
  Col
} from "reactstrap";
import classnames from "classnames";

import "./App.css";
import ProofDiv from "./ProofDiv";

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: "1",
      ipfsHash: null,
      buffer: "",
      ethAddress: "",
      transactionHash: "",
      txReceipt: "",
      myProofs: [],
      tags: []
    };

    this.onLoad();
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  //Take file input from user
  captureFile = event => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader);
  };

  //Convert the file to buffer to store on IPFS
  convertToBuffer = async reader => {
    const buffer = await Buffer.from(reader.result);
    this.setState({ buffer });
  };

  onClickGetTxReceipt = async () => {
    try {
      this.setState({ blockNumber: "waiting.." });
      this.setState({ gasUsed: "waiting..." });
      await web3.eth.getTransactionReceipt(
        this.state.transactionHash,
        (err, txReceipt) => {
          console.log(err, txReceipt);
          this.setState({ txReceipt });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  onTagAdded = async tag => {
    this.setState({
      tags: [...this.state.tags, tag]
    });
  };

  onTagRemoved = async (tag, index) => {
    this.setState({
      tags: this.state.tags.filter((tag, i) => i !== index)
    });
  };

  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    const ethAddress = await proofRegistry.options.address;
    this.setState({ ethAddress });
    //save document to IPFS,return its hash#, and set hash# to state
    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log(err, ipfsHash);
      //setState by setting ipfsHash to ipfsHash[0].hash
      this.setState({ ipfsHash: ipfsHash[0].hash });
      // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract
      //return the transaction hash from the ethereum contract
      const { digest, hashFunction, size } = getBytes32FromMultiash(
        ipfsHash[0].hash
      );
      proofRegistry.methods
        .createProof(digest, hashFunction, size, this.state.tags.join(";"))
        .send(
          {
            from: accounts[0]
          },
          (error, transactionHash) => {
            this.setState({ transactionHash });
          }
        );
      this.state.myProofs.push({
        hash: ipfsHash[0].hash,
        tags: "#" + this.state.tags.join(" #")
      });
    });
  };

  onLoad = async () => {
    const accounts = await web3.eth.getAccounts();
    proofRegistry.methods.proofs(accounts[0], 0).call({}, (error, _myProof) => {
      let ipfsHash = getMultihashFromContractResponse(_myProof);
      this.state.myProofs.push({ hash: ipfsHash, tags: _myProof.tags });
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header primary">
          <h1>Proof of Existence dApp</h1>
        </header>
        <hr />

        <div class="container">
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "1"
                })}
                onClick={() => {
                  this.toggle("1");
                }}
              >
                Upload a proof
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "2"
                })}
                onClick={() => {
                  this.toggle("2");
                }}
              >
                My proofs
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col sm="12">
                  <form onSubmit={this.onSubmit}>
                    <div class="form-group row">
                      <label for="file" class="col-sm-2 col-form-label">
                        Select File
                      </label>
                      <div class="col-sm-10">
                        <input
                          type="file"
                          className="form-control"
                          onChange={this.captureFile}
                        />
                      </div>
                    </div>

                    <div class="form-group row">
                      <label for="tags" class="col-sm-2 col-form-label">
                        Tags
                      </label>
                      <div class="col-sm-10">
                        <Tags
                          tags={this.state.tags}
                          placeholder="Add a tag"
                          onAdded={this.onTagAdded.bind(this)}
                          onRemoved={this.onTagRemoved.bind(this)}
                        />
                      </div>
                    </div>

                    <Button type="submit" class="btn btn-primary">
                      Submit
                    </Button>
                  </form>
                  <hr />
                  <Button onClick={this.onClickGetTxReceipt}>
                    {" "}
                    Get Transaction Receipt{" "}
                  </Button>
                  <hr />
                  <table bordered="true" responsive="true">
                    <thead>
                      <tr>
                        <th>Tx Receipt Category</th>
                        <th> </th>
                        <th>Values</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>IPFS Hash stored on Ethereum</td>
                        <td> : </td>
                        <td>{this.state.ipfsHash}</td>
                      </tr>
                      <tr>
                        <td>Ethereum Contract Address</td>
                        <td> : </td>
                        <td>{this.state.ethAddress}</td>
                      </tr>
                      <tr>
                        <td>Tx # </td>
                        <td> : </td>
                        <td>{this.state.transactionHash}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2" onClick={this.onOpenMyProofs}>
              <Row>
                <Col sm="12">
                  <ProofDiv items={this.state.myProofs} id="proofList" />
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </div>
      </div>
    );
  }
}
