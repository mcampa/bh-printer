# bh-printer

This is a bistrohub printer client that runs on a raspberry pi. It uses socketIO to listen for print orders

#Download image:
    1. Download image from:
        - https://steele.debian.net/comitup/image_2019-03-30-Comitup.zip
         - or https://davesteele.github.io/comitup/

## Burn image:
    - Follow this steps for MacOS https://www.raspberrypi.org/documentation/installation/installing-images/mac.md

In summary, run this commands:
```
diskutil list # identify the disk
diskutil unmountDisk /dev/disk3
sudo dd bs=1m if=image.img of=/dev/rdisk3 conv=sync
sudo diskutil eject /dev/rdisk3
```

## Connect to WIFI

    1. Connect to pi WIFI hotspot "comitup-XXXX"
    2. Go to http://10.42.0.1 and follow instructions
    3. Get pi's IP from local router
    4. SSH in pi ssh pi@192.168.0.100 password: raspberry
    5. Run `sudo passwd pi` to change password to be the same printerID

## Upgrade and install essentials
```
sudo dpkg-reconfigure locales (en_US.UTF-8 UTF-8)
sudo apt-get -y update
sudo apt-get -y upgrade
sudo apt-get -y dist-upgrade
sudo apt-get -y install git build-essential libudev-dev supervisor
```

## Give user permissions to access usb
```
sudo usermod -a -G lp,dialout,gpio pi
```

## Install NVM and Node
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
nvm install 8
npm install -g yarn
```

## install bh-printer
```
cd && git clone https://github.com/mcampa/bh-printer.git
cd ~/bh-printer && yarn

sudo touch /var/log/bh-printer.log
sudo chmod 766 /var/log/bh-printer.log
```

## Start at boot
Create supervisor file `sudo vim /etc/supervisor/conf.d/bh-printer.conf`
```
[program:bh-printer]
user=pi
environment=HOME=/home/pi,USER=pi,PRINTER_ID=AXXXXXXXX
directory=/home/pi/bh-printer
command=/home/pi/bh-printer/start.sh
stdout_logfile=/var/log/bh-printer.log
redirect_stderr=true
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
stopsignal=INT
```

## Test development
```
URL=http://api.bistrohub.local PRINTER_ID=AXXXXXXXX USE_CONSOLE=1 nodemon
```
