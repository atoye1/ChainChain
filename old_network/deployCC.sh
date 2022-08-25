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

peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CC_PATH} --label ${CC_NAME}_1

setGlobals 1
peer lifecycle chaincode install ${CC_NAME}.tar.gz
peer lifecycle chaincode queryinstalled

setGlobals 2
peer lifecycle chaincode install ${CC_NAME}.tar.gz
peer lifecycle chaincode queryinstalled

setGlobals 3
peer lifecycle chaincode install ${CC_NAME}.tar.gz
peer lifecycle chaincode queryinstalled

PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | sed -n "/bicycleCC_1/{s/^Package ID: //; s/, Label:.*$//; p;}")

setGlobals 1
peer lifecycle chaincode approveformyorg -o localhost:7050 --channelID mychannel --name ${CC_NAME} --version 1 --sequence 1 --package-id ${PACKAGE_ID} -- sequence 1

peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name ${CC_NAME} --version 1 --sequence 1 --output json

setGlobals 2
peer lifecycle chaincode approveformyorg -o localhost:7050 --channelID mychannel --name ${CC_NAME} --version 1 --sequence 1 --package-id ${PACKAGE_ID} --sequence 1

peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name ${CC_NAME} --version 1 --sequence 1 --output json

setGlobals 3
peer lifecycle chaincode approveformyorg -o localhost:7050 --channelID mychannel --name ${CC_NAME} --version 1 --sequence 1 --package-id ${PACKAGE_ID} --sequence 1

peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name ${CC_NAME} --version 1 --sequence 1 --output json

setGlobals 1
peer lifecycle chaincode commit -o localhost:7050 -C mychannel -n ${CC_NAME} --peerAddresses localhost:7051 --peerAddresses localhost:9051 --peerAddresses localhost:8051 --version 1 --sequence 1

sleep 3

# Chaincode test script
source ./invokeTestCC.sh
