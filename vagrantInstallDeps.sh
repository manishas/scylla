#Do the installs
cd /vagrant
if [ ! -f /var/log/6node-packages ];
then
    echo -e "${yellow}Installing Node Packages{NC}"
    npm install
    touch /var/log/6node-packages
fi

if [ ! -f /var/log/7bower-packages ];
then
    echo -e "${yellow}Installing Bower Packages{NC}"
    cd /vagrant/public
    bower install
    cd /vagrant
    touch /var/log/7bower-packages
fi

