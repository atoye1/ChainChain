#!/bin/bash

set +x

export CC_PATH="${PWD}/../contract/bicycleCC"
export CC_NAME="bicycleCC"

export FABRIC_CFG_PATH=${PWD}

setGlobals() {
    USING_ORG=$1
    if [ $USING_ORG -eq 1 ]; then
        export CORE_PEER_TLS_ENABLED=true
        export CORE_PEER_LOCALMSPID="Org1MSP"
        export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
        export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
        export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
        export CORE_PEER_ADDRESS=localhost:7051
    elif [ $USING_ORG -eq 2 ]; then
        export CORE_PEER_TLS_ENABLED=true
        export CORE_PEER_LOCALMSPID="Org2MSP"
        export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
        export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
        export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
        export CORE_PEER_ADDRESS=localhost:9051
    else
        errorln "ORG Unknown"
    fi
}

export FABRIC_CFG_PATH=/home/${USER}/fabric-samples/config

setGlobals 1
fcn_call='{"Args":["Set", "fakeKey1", "{\"Owner\":\"fakeUserId\", \"Company\":\"fakeCompany\", \"Model\":\"fakeModel\", \"Colour\":\"fakeColour\", \"Image\":\"fakeImage\", \"Comment\":\"fakeComment\", \"Location\":\"fakeLocation\", \"IsDeserted\":\"false\"}"]}'

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n ${CC_NAME} -c "${fcn_call}" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"
sleep 3



setGlobals 1
peer chaincode query -C mychannel -n ${CC_NAME} -c '{"Args":["Get","fakeKey1"]}'
