'use strict';

// Import General Modules
const express = require('express');
const path = require('path');
const serveIndex = require('serve-index');

// Import routers

const indexRouter = require('./routes/index');
const bicycleRouter = require('./routes/bicycles');
const userRouter = require('./routes/users');

// Get express object
let app = express();

// Set envs
const port = "3000";
const currentId = 'admin';
app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// express settings
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '/')));
app.use(express.static(__dirname + "/"));
app.use('/static', serveIndex(__dirname + '/'));

// Setting Routers
app.use('/', indexRouter);
app.use('/bicycles', bicycleRouter);
app.use('/users', userRouter);


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

// Running server on specified port 
app.listen(port, () => {
    console.log(`Express server is running at port ${port}`);
});
