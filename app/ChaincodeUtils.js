const FabricCaServices = require("fabric-ca-client");
const { Gateway, Wallets } = require("fabric-network");
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('./AppUtil.js');
const mspOrg1 = 'Org1MSP';
const ccp = buildCCPOrg1();
const caClient = buildCAClient(FabricCaServices, ccp, 'ca.org1.example.com');
const walletPath = path.join(__dirname, 'wallet');

function TriggerChainCode(id, transaction, key, value) {
    const gateway = new Gateway();
    try {
        const wallet = await buildWallet(Wallets, walletPath);

        await gateway.connect(ccp, {
            wallet,
            identity: id,
            discovery: { enabled: true, asLocalhost: true }
        });
        const network = await gateway.getNetwork(CH_NAME);
        const contract = network.getContract(CC_NAME);
        if (value) {
            result = await contract.submitTransaction(transaction, key, value);
        } else {
            result = await contract.submitTransaction(transaction, key);
        }

    } catch (error) {
        let result = `{"result":"failed","message":"query bicycle failed"}`;
        console.log("/process/create end -- failed", error);
        return result;
    } finally {
        gateway.disconnect();
    }
    return result;
}