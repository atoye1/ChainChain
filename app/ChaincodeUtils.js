const path = require('path');
const FabricCaServices = require("fabric-ca-client");
const { Gateway, Wallets } = require("fabric-network");
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('./AppUtil.js');
const mspOrg1 = 'Org1MSP';
const ccp = buildCCPOrg1();
const caClient = buildCAClient(FabricCaServices, ccp, 'ca.org1.example.com');
const walletPath = path.join(__dirname, 'wallet');
const CH_NAME = 'mychannel';
const CC_NAME = 'bicycleCC';

async function triggerCC(id, transaction, key, value) {
    const gateway = new Gateway();
    let result = "";
    try {
        const wallet = await buildWallet(Wallets, walletPath);

        await gateway.connect(ccp, {
            wallet,
            identity: id,
            discovery: { enabled: true, asLocalhost: true }
        });
        const network = await gateway.getNetwork(CH_NAME);
        const contract = network.getContract(CC_NAME);
        if (transaction.startsWith("Set")) {
            if (value) {
                result = await contract.submitTransaction(transaction, key, value);
            } else {
                result = await contract.submitTransaction(transaction, key);
            }
            result = { result: "success", transaction: transaction, Key: key, value: value };
        } else { // transactions such as Get, GetAll, History... etc
            if (value) {
                result = await contract.evaluateTransaction(transaction, key, value);
            } else {
                result = await contract.evaluateTransaction(transaction, key);
            }
            result = JSON.parse(result);
        }
    } catch (error) {
        console.log(error);
        result = { result: "fail", transaction: transaction, Key: key, value: value };
        return result;
    } finally {
        gateway.disconnect();
    }
    return result;
};

module.exports = triggerCC;