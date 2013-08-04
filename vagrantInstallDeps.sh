#Grab the github keys and dump them in known_hosts
ssh-keyscan -t rsa,dsa github.com 2>&1 > ~/.ssh/known_hosts
#Do the installs
cd /vagrant
npm install
cd /vagrant/public
bower install
cd /vagrant