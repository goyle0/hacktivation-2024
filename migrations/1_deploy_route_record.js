const RouteRecord = artifacts.require("RouteRecord");

module.exports = function (deployer) {
  deployer.deploy(RouteRecord);
};
