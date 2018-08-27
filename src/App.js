import React, { Component } from "react";
import ipfs from "./ipfs";
import proofRegistry from "./proofRegistry";
import { Button } from "reactstrap";
import Tags from "react-tagging-input";
import web3 from "./web3";
import { Tab, Tabs } from "react-bootstrap";

import "./App.css";

class App extends Component {
  state = {
    ipfsHash: null,
    buffer: "",
    ethAddress: "",
    transactionHash: "",
    txReceipt: "",
    tags: []
  };

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

  onClick = async () => {
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

  onSelectProofsTag = async () => {};

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
      proofRegistry.methods
        .createProof(this.state.ipfsHash, this.state.tags.toString())
        .send(
          {
            from: accounts[0]
          },
          (error, transactionHash) => {
            console.log(transactionHash);
            this.setState({ transactionHash });
          }
        );
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
          <Tabs defaultActiveKey={1} animation={false} id="tabs">
            <Tab eventKey={1} title="Upload proof" className="nav-item">
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
            </Tab>

            <Tab eventKey={2} title="My proofs">
              Tab 2 content
            </Tab>
          </Tabs>

          <hr />
        </div>
        <grid>
          <hr />
          <Button onClick={this.onClick}> Get Transaction Receipt </Button>
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
        </grid>
      </div>
    );
  }
}
export default App;
