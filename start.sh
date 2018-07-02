#!/bin/bash
set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

function launch {
    git reset --hard @{u}
    yarn
    nodemon ./
}

launch
