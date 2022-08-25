#!/bin/bash

set -x

export PATH=$PATH:/home/${USER}/fabric-samples/bin;
export FABRIC_CFG_PATH=${PWD}

#1 컨테이너 생성 및 도커네트워크 생성
docker-compose -f docker-compose.yaml up -d ca_org1 ca_org2 ca_org3 orderer.example.com peer0.org1.example.com peer0.org2.example.com peer0.org3.example.com

sleep 10

docker ps -a 

#환경설정 org1
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export FABRIC_CFG_PATH=/home/${USER}/fabric-samples/config

# export FABRIC_CFG_PATH=/home/${USER}/fabric-samples/config

#2 채널생성
peer channel create -o localhost:7050 -c mychannel -f ./config/mychannel.tx --outputBlock ./config/mychannel.block 
sleep 3

#3 채널조인
peer channel join -b ./config/mychannel.block 
peer channel list
sleep 3

#환경설정 org2
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

peer channel join -b ./config/mychannel.block 
sleep 3

peer channel list

#환경설정 org3
export CORE_PEER_LOCALMSPID="Org3MSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
export CORE_PEER_ADDRESS=localhost:8051

peer channel join -b ./config/mychannel.block 
sleep 3

peer channel list
