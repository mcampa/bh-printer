#!/bin/bash
set -e

# This loads nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# wait for internet
until ping -W 1 -c 1 8.8.8.8; do sleep 1; done

function launch {
    pushd /home/pi/bh-printer
    git fetch --all
    git reset --hard @{u}
    yarn
    nodemon ./
}

launch
