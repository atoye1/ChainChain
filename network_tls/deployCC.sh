#!/bin/bash

set +x

export CC_PATH="${PWD}/../contract/bicycleCC"
export CC_NAME="bicycleCC"
export CC_VERSION="1"
export CHANNEL_NAME="mychannel"

setGlobals() {
    USING_ORG=$1
    if [ $USING_ORG -eq 1 ]; then
        export CORE_PEER_LOCALMSPID="Org1MSP"
        export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
        export CORE_PEER_ADDRESS=localhost:7051
        export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
    elif [ $USING_ORG -eq 2 ]; then
        export CORE_PEER_LOCALMSPID="Org2MSP"
        export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
        export CORE_PEER_ADDRESS=localhost:9051
        export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
    else
        errorln "ORG Unknown"
    fi
    export CORE_PEER_TLS_ENABLED=true
    export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
}

export FABRIC_CFG_PATH=${PWD}
setGlobals 1

peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CC_PATH} --label ${CC_NAME}_1

setGlobals 1
peer lifecycle chaincode install ${CC_NAME}.tar.gz
peer lifecycle chaincode queryinstalled

setGlobals 2
peer lifecycle chaincode install ${CC_NAME}.tar.gz
peer lifecycle chaincode queryinstalled



PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | sed -n "/bicycleCC_1/{s/^Package ID: //; s/, Label:.*$//; p;}")
## approve for org1
setGlobals 1
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --package-id ${PACKAGE_ID} --sequence 1 >&log.txt
cat log.txt

## approve for org1
setGlobals 2
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --package-id ${PACKAGE_ID} --sequence 1 >&log.txt
cat log.txt

set -x

CC_NAME=bicycleCC
## check commitreadiness
peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${CC_VERSION} --sequence 1 --tls --cafile $ORDERER_CA --output json

## commit chaincode
PEER_CONN_PARMS="--peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"

peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} $PEER_CONN_PARMS --version ${CC_VERSION} --sequence 1 >&log.txt
{ set +x; } 2>/dev/null
cat log.txt

peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME} --cafile $ORDERER_CA

sleep 3

# Chaincode test script
