const path = require('path');
const { body, validationResult } = require("express-validator");

const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../AppUtil.js');
const FabricCaServices = require("fabric-ca-client");
const { Gateway, Wallets } = require("fabric-network");
const ccp = buildCCPOrg1();
const caClient = buildCAClient(FabricCaServices, ccp, 'ca.org1.example.com');

exports.users_get = (req, res, next) => {
    return;
};

exports.users_create_post = async (req, res, next) => {
    console.log("POST /users called");
    console.log(req.body);
    const userId = req.body.signupId;
    const userPw = req.body.signupPw;
    const userRole = req.body.signupRole;
    try {
        const caInfo = ccp.certificateAuthorities["ca.org1.example.com"];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCaServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.canName);

        console.log("debug1");
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const identity = await wallet.get(userId);

        if (identity) {
            console.log(`An identiy for the ${userRole} ${userId} already exists in the wallet`);
            const res_str = `{"result":"failed", "msg":"An identity for the ${userRole} ${userId} already exists in the wallet"}`;
            res.json(JSON.parse(res_str));
            return;
        }
        console.log("debug2");
        if (userRole != 'admin') {
            const adminIdentity = await wallet.get("admin");
            if (!adminIdentity) {
                console.log('An identity for the admin user "admin" does not exist in the wallet');
                const res_str = `{"result":"failed", "msg":"An identity for the admin user ${userId} does not exists in the wallet"}`;
                res.json(JSON.parse(res_str));
                return;
            }
            console.log("debug3");
            const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, "admin");

            const secret = await ca.register({
                affiliation: "org1.department1",
                enrollmentID: userId,
                role: userRole,
            },
                adminUser);
            const enrollment = await ca.enroll({
                enrollmentID: userId,
                enrollmentSecret: secret,
            });

            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: "Org1MSP",
                type: "X.509",
            };
            await wallet.put(userId, x509Identity);
            console.log(`Successfully registered and enrolled ${userRole}user ${userId} and imported it into the wallet`);
            const res_str = `{"result":"Success", "msg":"Successfully enrolled ${userRole} ${userId} in the wallet"}`;
            res.status(200).json(JSON.parse(res_str));
        } else {
            const enrollment = await ca.enroll({ enrollmentID: userId, enrollmentSecret: userPw });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: "Org1MSP",
                type: "X.509",
            };
            await wallet.put(userId, x509Identity);

            console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
            const res_str = `{"result":"success", "msg":"Successfully enrolled ${userRole} ${userId} in the wallet"}`;
            res.status(200).json(JSON.parse(res_str));
        }
    } catch (error) {
        console.log(error);
        console.error(`Failed to enrol ${userRole}user ${userId}`);
        const res_str = `{"result":"failed","msg":"failed to enrol ${userRole}user - ${userId} : ${error}"}`;
        res.json(JSON.parse(res_str));
    }
    return;
};
exports.user_get = (req, res, next) => {
    return;
};