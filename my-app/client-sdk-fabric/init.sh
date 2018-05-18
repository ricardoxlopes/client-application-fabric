#!/bin/bash

# rm -rf store-Path*/
# rm -rf crypto-config/

# ./bin/cryptogen generate --config=./crypto-config-add.yaml
# # ./bin/configtxgen -profile OrdererGenesis -outputBlock ./channel-artifacts/genesis.block
# # ./bin/configtxgen -profile NewChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID mynewchannel

ARCH=`uname -s | grep Darwin`
if [ "$ARCH" == "Darwin" ]; then
  OPTS="-it"
else
  OPTS="-i"
fi

# # Copy the template to the file that will be modified to add the private key
# cp docker-compose-template.yaml docker-compose.yaml

# # The next steps will replace the template's contents with the
# # actual values of the private key file names for the two CAs.
# CURRENT_DIR=$PWD
# cd crypto-config/peerOrganizations/orgnew.example.com/ca/
# PRIV_KEY=$(ls *_sk)
# cd "$CURRENT_DIR"
# sed $OPTS "s/CANEW_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose.yaml

# Copy the template to the file that will be modified to add the private key
cp orgNewContent-template.json orgNewContent.json

# # The next steps will replace the template's contents with the
# # actual values of the private key file names for the two CAs.
CURRENT_DIR=$PWD

cd crypto-config/peerOrganizations/orgnew.example.com/users/Admin@orgnew.example.com/msp/admincerts
FILE_NAME=$(ls *.pem)
PRIV_KEY=$( base64 $FILE_NAME )
cd "$CURRENT_DIR"
NO_WHITESPACE="$(echo -e "${PRIV_KEY}" | tr -d '\040\011\012\015')"
sed $OPTS "s@CANEW_PRIVATE_KEY_ADMIN@$NO_WHITESPACE@g" orgNewContent.json

CURRENT_DIR=$PWD

cd crypto-config/peerOrganizations/orgnew.example.com/users/Admin@orgnew.example.com/msp/cacerts
FILE_NAME=$(ls *.pem)
PRIV_KEY=$( base64 $FILE_NAME )
cd "$CURRENT_DIR"
NO_WHITESPACE="$(echo -e "${PRIV_KEY}" | tr -d '\040\011\012\015')"
sed $OPTS "s@CANEW_PRIVATE_KEY_CACERT@$NO_WHITESPACE@g" orgNewContent.json

CURRENT_DIR=$PWD

cd crypto-config/peerOrganizations/orgnew.example.com/users/Admin@orgnew.example.com/msp/tlscacerts
FILE_NAME=$(ls *.pem)
PRIV_KEY=$( base64 $FILE_NAME )
cd "$CURRENT_DIR"
NO_WHITESPACE="$(echo -e "${PRIV_KEY}" | tr -d '\040\011\012\015')"
sed $OPTS "s@CANEW_PRIVATE_KEY_TLS@$NO_WHITESPACE@g" orgNewContent.json


# docker-compose up

