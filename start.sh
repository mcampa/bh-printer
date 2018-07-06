#!/bin/bash
set -e

echo "I am $(whoami)"

# This loads nvm
export NVM_DIR="/home/pi/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# wait for internet
until ping -W 1 -c 1 8.8.8.8; do sleep 1; done

function launch {
    pushd /home/pi/bh-printer
    git fetch --all
    git reset --hard @{u}
    /home/pi/.nvm/versions/node/v8.11.3/bin/yarn
    /home/pi/.nvm/versions/node/v8.11.3/bin/nodemon ./
}

launch
