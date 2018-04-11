#!/bin/bash

path='hfc-key-store'
ca1_url='http://localhost:7054'
ca2_url='http://localhost:8054'
ca3_url='http://localhost:9054'
ca4_url='http://localhost:10054'

ca1_name='ca-org1'
ca2_name='ca-org2'
ca3_name='ca-org3'
ca4_name='ca-Pl'

mspid1='Org1MSP'
mspid2='Org2MSP'
mspid3='Org3MSP'
mspid4='Pl1MSP'

peer4='grpc://localhost:12051'
orderer='grpc://localhost:7050'
event_peer='grpc://localhost:12053'

user='user'
channel='mychannel4'
chaincodeId='mycc'
fcn='query'

args1='["record1"]'
args2='["record2"]'
args5='["recordOrg1ToPl1"]'
args6='["recordOrg2ToPl1"]'
args9='["record1Pl1ToOrg3"]'
args10='["record2Pl1ToOrg3"]'

echo
echo
echo
echo "################################"
echo "ORG 1"
echo "################################"
echo
echo
echo
node enrollAdmin.js $path'1' $ca1_url $ca1_name $mspid1
node registerUser.js $path'1' $ca1_url 'user1' $mspid1
echo 
echo "################################"
echo "QUERY ORG1"
echo "################################"
echo 
val1=$(node query.js $path'1' 'mychannel1' $peer4 'user1' 'mycc' 'query' $args1)

echo "BLOCK QUERY $val1"

val1=`echo $val1 | sed 's/"/\\\"/g'`

args3='["recordOrg1ToPl1","'$val1'"]'

echo
echo
echo
echo "################################"
echo "ORG 2"
echo "################################"
echo
echo
echo

node enrollAdmin.js $path'2' $ca2_url $ca2_name $mspid2
node registerUser.js $path'2' $ca2_url 'user2' $mspid2
echo 
echo "################################"
echo "QUERY ORG2"
echo "################################"
echo 
val2=$(node query.js $path'2' 'mychannel2' $peer4 'user2' 'mycc' 'query' $args2)

echo "BLOCK QUERY $val2"

val2=`echo $val2 | sed 's/"/\\\"/g'`

args4='["recordOrg2ToPl1","'$val2'"]'



echo
echo
echo
echo "################################"
echo "PL1"
echo "################################"
echo
echo
echo
node enrollAdmin.js $path'3' $ca4_url $ca4_name $mspid4
node registerUser.js $path'3' $ca4_url 'user3' $mspid4
echo 
echo "################################"
echo "TRANSACT TO PL1 RECORD 1"
echo "################################"
echo 
node invoke.js $path'3' 'mychannel4' $peer4 $orderer 'user3' 'mycc' 'invoke' $args3 $event_peer
echo 
echo "################################"
echo "TRANSACT TO PL1 RECORD 2"
echo "################################"
echo 
node invoke.js $path'3' 'mychannel4' $peer4 $orderer 'user3' 'mycc' 'invoke' $args4 $event_peer
#node instantiate.js $path'1' 'mychannel4' $peer4 $orderer 'user1' 'mycc' $args3 $event_peer '1.0'
echo 
echo "################################"
echo "QUERY PL1 RECORD 1"
echo "################################"
echo 
val3=$(node query.js $path'3' 'mychannel4' $peer4 'user3' 'mycc' 'query' $args5)

echo "BLOCK QUERY $val3"

val3=`echo $val3 | sed 's/"/\\\"/g'`

args7='["record1Pl1ToOrg3","'$val3'"]'

echo 
echo "################################"
echo "QUERY PL1 RECORD 2"
echo "################################"
echo 
val4=$(node query.js $path'3' 'mychannel4' $peer4 'user3' 'mycc' 'query' $args6)

echo "BLOCK QUERY $val4"

val4=`echo $val4 | sed 's/"/\\\"/g'`

args8='["record2Pl1ToOrg3","'$val4'"]'

echo
echo
echo
echo "################################"
echo "ORG 3"
echo "################################"
echo
echo
echo
node enrollAdmin.js $path'4' $ca3_url $ca3_name $mspid3
node registerUser.js $path'4' $ca3_url 'user4' $mspid3
echo 
echo "################################"
echo "TRANSACT TO ORG3 RECORD 1"
echo "################################"
echo 
node invoke.js $path'4' 'mychannel3' $peer4 $orderer 'user4' 'mycc' 'invoke' $args7 $event_peer
echo 
echo "################################"
echo "TRANSACT TO ORG3 RECORD 2"
echo "################################"
echo 
node invoke.js $path'4' 'mychannel3' $peer4 $orderer 'user4' 'mycc' 'invoke' $args8 $event_peer
#node instantiate.js $path'2' 'mychannel3' $peer4 $orderer 'user2' 'mycc' $args4 $event_peer '1.0'
echo 
echo "################################"
echo "QUERY ORG3 RECORD 1"
echo "################################"
echo 
node query.js $path'4' 'mychannel3' $peer4 'user4' 'mycc' 'query' $args9
echo 
echo "################################"
echo "QUERY ORG3 RECORD 2"
echo "################################"
echo 
node query.js $path'4' 'mychannel3' $peer4 'user4' 'mycc' 'query' $args10



