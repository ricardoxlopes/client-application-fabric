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

peer='grpc://localhost:12051'
orderer='grpc://localhost:7050'
event_peer='grpc://localhost:12053'

chaincodeId='mycc'
fcn='query'
args="['a']"

node enrollAdmin.js $path $ca1_url $ca1_name $mspid1
node registerUser.js $path $ca1_url 'user' $mspid1
val=$(node query.js)

# echo "##### BLOCK QUERY $val #########"

node enrollAdmin.js $path'1' $ca4_url $ca4_name $mspid4
node registerUser.js $path'1' $ca4_url 'user1' $mspid4
node invoke.js $val
node query1.js





