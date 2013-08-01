#!/usr/bin/env bash

yellow='\e[0;33m'
red='\e[0;31m'
NC='\e[0m' # No Color

if [ ! -f /var/log/0usersetup ];
then
    echo -e "${yellow}Setting up User: Scylla${NC}"
    useradd -d /home/scylla -m scylla -p scylla
    touch /var/log/0usersetup
fi

if [ ! -f /var/log/0systemsetup ];
then
    echo -e "${yellow}Installing system pre-reqs${NC}"
    sudo apt-get update
    sudo apt-get install -y git imagemagick
    # Check for ssh keys
    if [ ! -f /vagrant/.ssh ];
    then
        cp -R /vagrant/.ssh ~/
        chown vagrant -R ~/.ssh
        chgrp vagrant -R ~/.ssh
        chmod 700 ~/.ssh
        chmod 600 ~/.ssh/*
    else
        echo -e "${red}SSH keys not copied.${NC}"
    fi
    touch /var/log/1systemsetup
fi

if [ ! -f /var/log/2mongosetup ];
then
    echo -e "${yellow}Installing MongoDB${NC}"
    sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
    echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/10gen.list
    sudo apt-get update
    sudo apt-get install -y mongodb-10gen python-software-properties python g++ make
    touch /var/log/2mongosetup
fi

if [ ! -f /var/log/3nodejssetup ];
then
    echo -e "${yellow}Installing NodeJS${NC}"
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install -y nodejs
    touch /var/log/3nodejssetup
fi

if [ ! -f /var/log/4upstart ];
then
    echo -e "${yellow}Setup Upstart Script{NC}"
    sudo cp /vagrant/scylla-upstart.conf /etc/init/scylla.conf
    chmod a+x /vagrant/scylla.conf
    touch /var/log/4upstart
fi

if [ ! -f /var/run/scylla.pid ];
then
    stop scylla
fi

echo -e "${yellow}Installing Scyalla NPM Deps${NC}"
cd /vagrant
npm install

start scylla