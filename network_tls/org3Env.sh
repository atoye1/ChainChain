
#!/bin/bash
export PATH=$PATH:/home/${USER}/fabric-samples/bin;
export FABRIC_CFG_PATH=${PWD}

# set env for org2
export CORE_PEER_LOCALMSPID="Org3MSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/crypto-config/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
export CORE_PEER_ADDRESS=localhost:8051
export FABRIC_CFG_PATH=/home/${USER}/fabric-samples/config
export ORDERER_CA=/home/sdh/dev/simpleAssetWithWallet/network_org3/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export PEER0_ORG1_CA="/home/sdh/dev/simpleAssetWithWallet/network_org3/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"
export PEER0_ORG2_CA="/home/sdh/dev/simpleAssetWithWallet/network_org3/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"
export PEER0_ORG3_CA="/home/sdh/dev/simpleAssetWithWallet/network_org3/crypto-config/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt"
