'use strict';

// Import Modules
const express = require('express');
const path = require('path');
const port = "3000";

let serveIndex = require('serve-index');

// Import Fabric Modules

const FabricCaServices = require("fabric-ca-client");
const { Gateway, Wallets } = require("fabric-network");
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('./AppUtil.js');
const mspOrg1 = 'Org1MSP';

const walletPath = path.join(__dirname, 'wallet');

const triggerCC = require("./ChaincodeUtils.js");

// Get express object
let app = express();

// Set envs
app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
const currentId = 'admin';

// express settings
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '/')));
app.use(express.static(__dirname + "/"));
app.use('/static', serveIndex(__dirname + '/'));

app.get('/bicycle', async (req, res) => {
    console.log("get /bicycle called");
    const key = req.query.bicycleIdQuery;
    const value = "";
    console.log(key);

    let result_CC = await triggerCC(currentId, "Get", key, value);
    console.log(result_CC);
    // result_CC = JSON.parse(result_CC);

    if (result_CC.result == "fail") {
        console.log(`GET /bicycle end --fail, ${result_CC}`);
    } else {
        console.log(`GET /bicycle end --success, ${result_CC}`);
    }
    // var obj = JSON.parse(result);
    res.status(200).send(result_CC);
});

app.post('/bicycle', async (req, res) => {
    console.log("POST /bicycle triggered");
    const key = req.body.Key;
    const value = JSON.stringify(req.body);

    let result_CC = await triggerCC(currentId, "Set", key, value);

    if (result_CC.result == "fail") {
        console.log(`POST /bicycle end --fail, ${result_CC}`);
    } else {
        console.log(`POST /bicycle end --success, ${result_CC}`);
    }
    res.status(200).send(result_CC);
});

app.post('/bicycle/state', async (req, res) => {
    console.log("POST /bicycle/state triggered");
    const key = req.body.Key;
    const mode = req.body.Mode;
    const value = "";
    console.log(mode);
    if (mode == "Report") {
        let result_CC = await triggerCC(currentId, "SetAbandoned", key, value);
    } else {
        let result_CC = await triggerCC(currentId, "SetResolved", key, value);
    }
    result_CC = JSON.parse(result_CC);

    if (result_CC.result == "fail") {
        console.log(`POST /bicycle end --fail, ${result_CC}`);
    } else {
        console.log(`POST /bicycle end --success, ${result_CC}`);
    }
    res.status(200).send(result_CC);
});

app.get('/bicycle/transfer', async (req, res) => {
    console.log("POST /bicycle/transfer triggered");
    const key = req.body.Key;
    const newOwner = req.body.NewOwner;
    console.log(key, newOwner);
    let result_CC = await triggerCC(currentId, "Transfer", key, newOwner);
    result_CC = JSON.parse(result_CC);

    if (result_CC.result == "fail") {
        console.log(`POST /bicycle/transfer end --fail, ${result_CC}`);
    } else {
        console.log(`POST /bicycle/transfer end --success, ${result_CC}`);
    }
    res.status(200).send(result_CC);
});



app.get('/bicycle/history', async (req, res) => {
    console.log("get /bicycle/history called");
    const key = req.query.bicycleIdQuery;
    const value = "";

    let result_CC = await triggerCC(currentId, "History", key, value);
    console.log(result_CC);
    // result_CC = JSON.parse(result_CC);

    if (result_CC.result == "fail") {
        console.log(`GET /bicycle/history end --fail, ${result_CC}`);
    } else {
        console.log(`GET /bicycle/history end --success, ${result_CC}`);
    }
    // var obj = JSON.parse(result);
    res.status(200).send(result_CC);
});

app.get('/bicycle/abandoned', async (req, res) => {
    console.log("get /bicycle/abandoned called");
    const key = "";
    const value = "";

    let result_CC = await triggerCC(currentId, "GetAbandoned", key, value);
    console.log(result_CC);
    // result_CC = JSON.parse(result_CC);

    if (result_CC.result == "fail") {
        console.log(`GET /bicycle/history end --fail, ${result_CC}`);
    } else {
        console.log(`GET /bicycle/history end --success, ${result_CC}`);
    }
    // var obj = JSON.parse(result);
    res.status(200).send(result_CC);
});

app.get('/bicycle/all', async (req, res) => {
    console.log("get /bicycle/all called");
    const key = "";
    const value = "";

    let result_CC = await triggerCC(currentId, "GetAll", key, value);
    // result_CC = JSON.parse(result_CC);

    if (result_CC.result == "fail") {
        console.log(`GET /bicycle/all end --fail, ${result_CC}`);
    } else {
        console.log(`GET /bicycle/all end --success, ${result_CC}`);
    }
    res.status(200).send(result_CC);
});


// Create adminWallet
app.post('/adminWallet', async (req, res) => {
    const id = "admin";
    const pw = "adminpw";
    console.log(id, pw);
    try {
        const caInfo = ccp.certificateAuthorities["ca.org1.example.com"];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCaServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.canName);

        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const identity = await wallet.get(id);
        if (identity) {
            console.log(`An identiy for the admin user ${id} already exists in the wallet`);
            const res_str = `{"result":"failed", "msg":"An identity for the admin user ${id} already exists in the wallet"}`;
            res.json(JSON.parse(res_str));
            return;
        }
        const enrollment = await ca.enroll({ enrollmentID: id, enrollmentSecret: pw });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: "Org1MSP",
            type: "X.509",
        };
        await wallet.put(id, x509Identity);

        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
        const res_str = `{"result":"success", "msg":"Successfully enrolled adminuser ${id} in the wallet"}`;
        res.status(200).json(JSON.parse(res_str));
    } catch (error) {
        console.error(`Failed to enrol admin user ${id}`);
        const res_str = `{"result":"failed","msg":"failed to enrol admin user - ${id} : ${error}"}`;
        res.json(JSON.parse(res_str));
    }
});

// Create User Wallet
app.post('/userWallet', async (req, res) => {
    var id = req.body.id;
    const userrole = "client";
    console.log("making user wallet with next info", id, userrole);
    try {
        const caInfo = ccp.certificateAuthorities["ca.org1.example.com"];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCaServices(caInfo.url, {
            trustedRoots: caTLSCACerts, verify: false
        }, caInfo.caName);

        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user
        const userIdentity = await wallet.get(id);
        if (userIdentity) {
            console.log(`An identity for the user ${id} already exists in the wallet`);
            const res_str = `{"result":"failed","msg":"An identity for the user ${id} already exists in the wallet"}`;
            res.send(JSON.parse(res_str));
            return;
        }

        const adminIdentity = await wallet.get("admin");
        if (!adminIdentity) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            const res_str = `{"result":"failed", "msg":"An identity for the admin user ${id} does not exists in the wallet"}`;
            res.json(JSON.parse(res_str));
            return;
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, "admin");

        const secret = await ca.register({
            affiliation: "org1.department1",
            enrollmentID: id,
            role: userrole,
        },
            adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: id,
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
        await wallet.put(id, x509Identity);
        console.log('Successfully registered and enrolled admin user "appUser" and imported it into the wallet');
        const res_str = `{"result":"Success", "msg":"Successfully enrolled normal user ${id} in the wallet"}`;
        res.status(200).json(JSON.parse(res_str));
    } catch (error) {
        console.error(`Failed to enroll normal user ${id}`);
        res.send(error);
    }
});


app.get('/', (req, res) => {
    console.log("index page called");
    res.render('index', (err, html) => {
        res.end(html);
    });
});

// Running server on port 6000
app.listen(6000, () => {
    console.log('Express server is running at port 6000');
});
