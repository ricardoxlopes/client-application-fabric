#!/bin/bash

path='hfc-key-store'
ca1_url='http://localhost:7054'
ca3_url='http://localhost:9054'
ca4_url='http://localhost:10054'

ca1_name='ca-org1'
ca4_name='ca-Pl'
ca3_name='ca-org3'


mspid1='Org1MSP'
mspid3='Org3MSP'
mspid4='Pl1MSP'

user='user'

channel='mychannel4'

peer4='grpc://localhost:12051'
orderer='grpc://localhost:7050'
event_peer='grpc://localhost:12053'

chaincodeId='mycc'
fcn='query'
args1='["a"]'
args2='["b"]'

node enrollAdmin.js $path $ca1_url $ca1_name $mspid1
node registerUser.js $path $ca1_url 'user' $mspid1
echo 
echo "################################"
echo "QUERY ORG1"
echo "################################"
echo 
val=$(node query.js $path 'mychannel1' $peer4 'user' 'mycc' 'query' $args1)

echo "BLOCK QUERY $val"


args3='["a","b","'$val'"]'

node enrollAdmin.js $path'1' $ca4_url $ca4_name $mspid4
node registerUser.js $path'1' $ca4_url 'user1' $mspid4
echo 
echo "################################"
echo "TRANSACT TO PRIVATE LEDGER"
echo "################################"
echo 
node invoke.js $path'1' 'mychannel4' $peer4 $orderer 'user1' 'mycc' 'invoke' $args3 $event_peer
echo 
echo "################################"
echo "QUERY PRIVATE LEDGER"
echo "################################"
echo 
val=$(node query.js $path'1' 'mychannel4' $peer4 'user1' 'mycc' 'query' $args2)

echo "BLOCK QUERY $val"

args4='["b","a","'$val'"]'

node enrollAdmin.js $path'2' $ca3_url $ca3_name $mspid3
node registerUser.js $path'2' $ca3_url 'user2' $mspid3
echo 
echo "################################"
echo "TRANSACT TO ORG3"
echo "################################"
echo 
node invoke.js $path'2' 'mychannel3' $peer4 $orderer 'user2' 'mycc' 'invoke' $args4 $event_peer
echo 
echo "################################"
echo "QUERY ORG3"
echo "################################"
echo 
node query.js $path'2' 'mychannel3' $peer4 'user2' 'mycc' 'query' $args1




