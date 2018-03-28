#!/bin/bash

path='hfc-key-store'
ca1_url='http://localhost:7054'
ca4_url='http://localhost:10054'

ca1_name='ca-org1'
ca4_name='ca-Pl'

mspid1='Org1MSP'
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
val=$(node query.js $path 'mychannel1' $peer4 'user' 'mycc' 'query' $args1)

echo "##### BLOCK QUERY $val #########"

args3='["a","b","'$val'"]'

node enrollAdmin.js $path'1' $ca4_url $ca4_name $mspid4
node registerUser.js $path'1' $ca4_url 'user1' $mspid4
node invoke.js $path'1' 'mychannel4' $peer4 $orderer 'user1' 'mycc' 'invoke' $args3 $event_peer
node query.js $path'1' 'mychannel4' $peer4 'user1' 'mycc' 'query' $args2





