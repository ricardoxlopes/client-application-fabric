#!/bin/bash

SECONDS=0
: "${FILENAME:=./logs/no-commands}"
: "${TIME:=1000000000}"

while [ $SECONDS -le $TIME ]; do

    # TYPE='CPUPerc'
    # C=orderer0.example.com
    # docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    # C=kafka0.example.com
    # docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    # C=kafka0.example.com
    # docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    # C=couchdb1
    # docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    # C=dev-peer0.org1.example.com-mycc-1.0
    # docker stats $C0 --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    # C=zookeeper0.example.com
    # docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    # C=ca_peerOrg1
    # docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt

    # TYPE='MemPerc'
    # C=orderer0.example.com
    # docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    # C=kafka0.example.com
    # docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    # C=kafka0.example.com
    # docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    # C=couchdb1
    # docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    # C=dev-peer0.org1.example.com-mycc-1.0
    # docker stats $C0 --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    # C=zookeeper0.example.com
    # docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    # C=ca_peerOrg1
    # docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt

    TYPE='NetIO'
    C=orderer0.example.com
    docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    C=kafka0.example.com
    docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    C=kafka0.example.com
    docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    C=couchdb1
    docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    C=dev-peer0.org1.example.com-mycc-1.0
    docker stats $C0 --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    C=zookeeper0.example.com
    docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    C=ca_peerOrg1
    docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt

    TYPE='BlockIO'
    C=orderer0.example.com
    docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    C=kafka0.example.com
    docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    C=kafka0.example.com
    docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    C=couchdb1
    docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    C=dev-peer0.org1.example.com-mycc-1.0
    docker stats $C0 --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    C=zookeeper0.example.com
    docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt
    C=ca_peerOrg1
    docker stats $C --format "{{.$TYPE}}" --no-stream >> $FILENAME-$C-$TYPE.txt

    # docker stats orderer1.example.com --format "{{.ID}}-{{.CPUPerc}}" --no-stream >> $FILENAME-CPUPerc.txt
    # docker stats kafka1.example.com --format "{{.ID}}-{{.CPUPerc}}" --no-stream >> $FILENAME-CPUPerc.txt
    # docker stats peer1.org1.example.com --format "{{.ID}}-{{.CPUPerc}}" --no-stream >> $FILENAME-CPUPerc.txt
    # docker stats couchdb2 --format "{{.ID}}-{{.CPUPerc}}" --no-stream >> $FILENAME-CPUPerc.txt
    # docker stats dev-peer0.org1.example.com-mycc-1.0 --format "{{.ID}}-{{.CPUPerc}}" --no-stream >> $FILENAME-CPUPerc.txt
    # docker stats zookeeper1.example.com --format "{{.ID}}-{{.CPUPerc}}" --no-stream >> $FILENAME-CPUPerc.txt
    # docker stats ca_peerPl --format "{{.ID}}-{{.CPUPerc}}" --no-stream >> $FILENAME-CPUPerc.txt

    # docker stats --format "{{.ID}}-{{.MemPerc}}" --no-stream >> $FILENAME-MemPerc.txt
    # docker stats --format "{{.ID}}-{{.NetIO}}" --no-stream >> $FILENAME-NetIO.txt
    # docker stats --format "{{.ID}}-{{.BlockIO}}" --no-stream >> $FILENAME-BlockIO.txt
    # docker stats --format "{{.ID}}-{{.PIDs}}" --no-stream >> $FILENAME-PIDs.txt
    # docker stats -a --no-stream >> stats.txt
    echo "running"
done