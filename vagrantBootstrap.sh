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

if [ ! -f /var/log/1aptsetup ];
then
    echo -e "${yellow}Setting up Apt Sources${NC}"
    sudo apt-get update
    # Required for apt-add-repository
    sudo apt-get install -y python-software-properties
    sudo apt-add-repository -y ppa:chris-lea/node.js
    sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
    echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/10gen.list
    sudo apt-get update
    touch /var/log/1aptsetup
fi

if [ ! -f /var/log/2systemsetup ];
then
    echo -e "${yellow}Installing system pre-reqs${NC}"
    sudo apt-get install -y git imagemagick openssl

#Generate our own self-signed ssl keys
    mkdir /etc/ssl/self-signed && cd /etc/ssl/self-signed
    openssl genrsa -out server.key 2048 && openssl req -new -key server.key -out server.csr -subj '/C=US/ST=Washington/L=Seattle/O=Scylla/OU=Scylla/CN=Scylla' && openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

    touch /var/log/1systemsetup
fi

if [ ! -f /var/log/3mongosetup ];
then
    echo -e "${yellow}Installing MongoDB${NC}"
    sudo apt-get install -y mongodb-10gen python g++ make
    touch /var/log/3mongosetup
fi

if [ ! -f /var/log/4nodejssetup ];
then
    echo -e "${yellow}Installing NodeJS${NC}"
    sudo apt-get install -y nodejs
    sudo npm install -g bower
    touch /var/log/4nodejssetup
fi

if [ ! -f /var/log/5upstart ];
then
    echo -e "${yellow}Setup Upstart Script${NC}"
    sudo cp /vagrant/scylla-upstart.conf /etc/init/scylla.conf
    chmod a+x /etc/init/scylla.conf
    touch /var/log/5upstart
fi

if [ ! -f /vagrant/scylla/config/mail.js ];
then
    echo -e "${red}EXAMPLE MAIL FILE USED, EMAIL WILL NOT BE ABLE TO BE SENT${NC}"
    cp /vagrant/config/mail-example.js /vagrant/config/mail.js
fi

if [ -f /var/run/scylla.pid ];
then
    stop scylla
fi

echo -e "${yellow}Installing Scyalla NPM Deps${NC}"

#We've got to run the installs as the vagrant user, as npm and bower HATE being root.
su -c "/vagrant/vagrantInstallDeps.sh" vagrant


start scylla