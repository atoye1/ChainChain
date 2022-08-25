#!/bin/bash

set +x

export CC_PATH="${PWD}/../contract/bicycleCC"
export CC_NAME="bicycleCC"

setGlobals() {
    USING_ORG=$1
    if [ $USING_ORG -eq 1 ]; then
        export CORE_PEER_LOCALMSPID="Org1MSP"
        export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
        export CORE_PEER_ADDRESS=localhost:7051
    elif [ $USING_ORG -eq 2 ]; then
        export CORE_PEER_LOCALMSPID="Org2MSP"
        export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
        export CORE_PEER_ADDRESS=localhost:9051
    elif [ $USING_ORG -eq 3 ]; then
        export CORE_PEER_LOCALMSPID="Org3MSP"
        export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
        export CORE_PEER_ADDRESS=localhost:8051
    else
        errorln "ORG Unknown"
    fi
}

export FABRIC_CFG_PATH=/home/${USER}/fabric-samples/config

setGlobals 1
fcn_call='{"Args":["Set", "fakeKey1", "{\"Owner\":\"fakeUserId\", \"Company\":\"fakeCompany\", \"Model\":\"fakeModel\", \"Colour\":\"fakeColour\", \"Image\":\"fakeImage\", \"Comment\":\"fakeComment\", \"Location\":\"fakeLocation\", \"IsDeserted\":\"false\"}"]}'

peer chaincode invoke -o localhost:7050 -C mychannel -n ${CC_NAME} -c "${fcn_call}" --peerAddresses localhost:7051 --peerAddresses localhost:9051 --peerAddresses localhost:8051
sleep 3

setGlobals 3
peer chaincode query -C mychannel -n ${CC_NAME} -c '{"Args":["Get","fakeKey1"]}'
