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

createData() {
    fcn_call=$1
    set -x
    peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n ${CC_NAME} -c "${fcn_call}" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"

    sleep 3
}

fcn_call='{"Args":["Set", "GM1", "{\"Owner\":\"GiantUser\", \"Company\":\"Giant\", \"Model\":\"Giant.MTB\", \"Colour\":\"orange\", \"Image\":\"giant_mtb.jpeg\", \"Comment\":\"fakeComment\", \"Location\":\"busan\", \"Abandoned\":\"false\"}"]}'
createData "${fcn_call}"

fcn_call='{"Args":["Set", "MC1", "{\"Owner\":\"MeridaUser\", \"Company\":\"Merida\", \"Model\":\"Merida.Cycle\", \"Colour\":\"white\", \"Image\":\"merida_cycle.jpeg\", \"Comment\":\"fakeComment\", \"Location\":\"seoul\", \"Abandoned\":\"false\"}"]}'
createData "${fcn_call}"

fcn_call='{"Args":["Set", "CH1", "{\"Owner\":\"CelloUser\", \"Company\":\"Cello\", \"Model\":\"Cello.Hybrid\", \"Colour\":\"skyblue\", \"Image\":\"cello_hybrid.jpeg\", \"Comment\":\"fakeComment\", \"Location\":\"busan\", \"Abandoned\":\"false\"}"]}'
createData "${fcn_call}"

fcn_call='{"Args":["Set", "BE1", "{\"Owner\":\"BianchiUser\", \"Company\":\"Bianchi\", \"Model\":\"Bianchi.Electronic\", \"Colour\":\"mint\", \"Image\":\"bianchi_electronic.jpeg\", \"Comment\":\"fakeComment\", \"Location\":\"seoul\", \"Abandoned\":\"false\"}"]}'
createData "${fcn_call}"

fcn_call='{"Args":["Set", "BF1", "{\"Owner\":\"BromptonUser\", \"Company\":\"Brompton\", \"Model\":\"Brompton.Foldable\", \"Colour\":\"black\", \"Image\":\"brompton_foldable.jpeg\", \"Comment\":\"fakeComment\", \"Location\":\"busan\", \"Abandoned\":\"false\"}"]}'
createData "${fcn_call}"


# Abandoned Bicycle Test Data
fcn_call='{"Args":["Set", "GM_A1", "{\"Owner\":\"BadGiantUser\", \"Company\":\"Giant\", \"Model\":\"Giant.MTB\", \"Colour\":\"green\", \"Image\":\"abandoned1.jpeg\", \"Comment\":\"fakeComment\", \"Location\":\"busan\", \"Abandoned\":\"true\"}"]}'
createData "${fcn_call}"

fcn_call='{"Args":["Set", "MC_A1", "{\"Owner\":\"BadMeridaUser\", \"Company\":\"Merida\", \"Model\":\"Merida.Cycle\", \"Colour\":\"white\", \"Image\":\"abandoned2.jpeg\", \"Comment\":\"fakeComment\", \"Location\":\"seoul\", \"Abandoned\":\"true\"}"]}'
createData "${fcn_call}"

fcn_call='{"Args":["Set", "CH_A1", "{\"Owner\":\"BadCelloUser\", \"Company\":\"Cello\", \"Model\":\"Cello.Hybrid\", \"Colour\":\"black\", \"Image\":\"abandoned3.jpeg\", \"Comment\":\"fakeComment\", \"Location\":\"busan\", \"Abandoned\":\"true\"}"]}'
createData "${fcn_call}"
