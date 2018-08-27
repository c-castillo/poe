var Destructible = artifacts.require(
  "zeppelin/contracts/lifecycle/Destructible"
);
var ProofRegistry = artifacts.require("./ProofRegistry.sol");
var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  deployer.deploy(Destructible, { overwrite: false }).then(function() {
    return deployer.deploy(ProofRegistry);
  });
  deployer.deploy(Migrations);
};
