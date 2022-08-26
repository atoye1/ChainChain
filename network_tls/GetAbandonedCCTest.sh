#!/bin/bash
export FABRIC_CFG_PATH=${PWD}

#환경설정 org1
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export CORE_PEER_ADDRESS=localhost:7051

export CC_PATH="${PWD}/../contract/bicycleCC"
export CC_NAME="bicycleCC"

peer chaincode query -C mychannel -n ${CC_NAME} -c '{"Args":["GetAbandoned"]}'