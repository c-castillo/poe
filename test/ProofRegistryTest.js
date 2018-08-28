const ProofRegistry = artifacts.require("./ProofRegistry");
const Destructible = artifacts.require("./Destructible.sol");

const FILE1 = {
  digest: "d0x59d175f553beaac7d173ffb1dda24707b2baabfbe43b9bc42f24d05769ced190",
  hashFunction: 18,
  size: 32
};

const FILE2 = {
  digest: "0x823553acdf4db247b9f8735c7e1d9325434f268b5aaf49207f52b19d619c9a53",
  hashFunction: 18,
  size: 32
};

contract("ProofRegistry", async accounts => {
  it.skip("should create a new PoE, with tags", async () => {
    const dInstance = await Destructible.deployed();
    const instance = await ProofRegistry.deployed();

    const created = await instance.createProof(
      FILE1.digest,
      FILE1.hashFunction,
      FILE1.size,
      "tag1,tag2"
    );
    assert.equal(created, true);
  });

  it("should try to create a PoE with an existing ipfs hash", () => {});

  it("should try to verify an invalid PoE", () => {});

  it("should verify a valid PoE", () => {});
});
