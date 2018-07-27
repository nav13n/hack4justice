var EvidenceContract = artifacts.require("./EvidenceProtection.sol");

module.exports = function(deployer) {
  deployer.deploy(EvidenceContract);
};
