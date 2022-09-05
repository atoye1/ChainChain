const { body, validationResult } = require("express-validator");
const triggerCC = require("../ChaincodeUtils.js");
const currentId = "admin";

exports.bicycles_get = async (req, res, next) => {
    const abandoned = req.query.abandoned;
    const userid = req.query.userid;
    console.log(userid, abandoned);
    const key = "";
    const value = "";
    let CCFunction = abandoned ? "GetAbandoned" : userid ? "GetUser" : "GetAll";

    console.log(`GET /bicycles triggered - ${CCFunction}`);
    let result_CC = await triggerCC(currentId, CCFunction, key, value);
    let success = result_CC.result == "fail" ? "fail" : "success";

    console.log(`GET /bicycles/ end --${success}, ${result_CC}`);
    res.status(200).send(result_CC);
};

exports.bicycles_post = async (req, res, next) => {
    console.log("POST /bicycles triggered");
    const key = req.body.Key;
    const value = JSON.stringify(req.body);
    console.log(req.body);
    console.log(value);
    console.log(req.files);
    return;
    let result_CC = await triggerCC(currentId, "Set", key, value);
    let successFlag = result_CC.result == "fail" ? "fail" : "success";
    console.log(`POST /bicycles end --${successFlag}, ${result_CC}`);

    res.status(200).send(result_CC);
};

exports.bicycle_get = async (req, res, next) => {
    const key = req.params.id;
    const value = "";
    console.log(`GET /bicycles/${key} called`);

    let result_CC = await triggerCC(currentId, "Get", key, value);
    console.log(result_CC);

    let successFlag = result_CC.result == "fail" ? "fail" : "success";

    console.log(`GET /bicycles/${key} end --${successFlag}, ${result_CC}`);
    res.status(200).send(result_CC);

    return;
};

exports.bicycle_get_history = async (req, res, next) => {
    const key = req.params.id;
    const value = "";

    console.log(`GET /bicycles/${key}/history called`);

    let result_CC = await triggerCC(currentId, "History", key, value);
    let successFlag = result_CC.result == "fail" ? "fail" : "success";

    console.log(`GET /bicycles/${key}/history end --${successFlag}, ${result_CC}`);
    // var obj = JSON.parse(result);
    res.status(200).send(result_CC);

    return;
};

exports.bicycle_delete_post = async (req, res, next) => {
    const key = req.params.id;
    console.log(`POST /bicycles/${key}/delete triggered`);

    let result_CC = await triggerCC(currentId, "SetDelete", key, value);
    let successFlag = result_CC.result == "fail" ? "fail" : "success";

    console.log(`POST /bicycles/${key}/delete end --${successFlag}, ${result_CC}`);
    res.status(200).send(result_CC);
    return;
};

exports.bicycle_update_post = async (req, res, next) => {
    const key = req.body.Key;
    const mode = req.body.Mode; // mode name should be chanicode name like SetAbandoned, SetResolved
    console.log(`POST /bicycles/${key}/update triggered`);

    let result_CC = await triggerCC(currentId, mode, key, value);
    let successFlag = result_CC.result == "fail" ? "fail" : "success";

    console.log(`POST /bicycles/${key}/update end --${successFlag}, ${result_CC}`);
    res.status(200).send(result_CC);
    return;
};

exports.bicycle_transfer_post = async (req, res, next) => {
    const key = req.body.Key;
    const newOwner = req.body.NewOwner;

    console.log(`POST /bicycle/${key}/transfer triggered`);

    let result_CC = await triggerCC(currentId, "Transfer", key, newOwner);
    let successFlag = result_CC.result == "fail" ? "fail" : "success";

    console.log(`POST /bicycles/${key}/transfer end --${successFlag}, ${result_CC}`);
    result_CC = JSON.parse(result_CC);
    res.status(200).send(result_CC);
};
