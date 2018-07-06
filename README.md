# bh-printer

This a bistrohub printer client that runs on raspberrypi. It uses socketIO to listen for print orders

## Burn image:
    1. Download image from https://steele.debian.net/comitup/image_2018-06-29-Comitup.zip
    2. Follow this steps for MacOS https://www.raspberrypi.org/documentation/installation/installing-images/mac.md

In summary, run this command:
```
sudo dd bs=1m if=raspbian.img of=/dev/rdisk2 conv=sync
```

## Connect to WIFI

    1. Connect to pi WIFI hotspot "comitup-XXXX"
    2. Go to http://10.42.0.1 and follow instructions
    3. Get pi's IP from local router
    4. SSH in pi ssh pi@192.168.0.100 password: raspberry
    5. Run `passwd` to change password to be the same printerID

## Upgrade and install essentials
```
sudo dpkg-reconfigure locales (en_US.UTF-8 UTF-8)
sudo apt-get -y update
sudo apt-get -y upgrade
sudo apt-get -y dist-upgrade
sudo apt-get -y install git build-essential libudev-dev
```

## Give user permissions to access usb
```
sudo usermod -a -G lp,dialout,gpio $(whoami)
```

## Install NVM and Node
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
nvm install 8
npm install -g yarn nodemon
```

## install bh-printer
```
cd && git clone https://github.com/mcampa/bh-printer.git
cd ~/bh-printer && yarn

sudo touch /var/log/bh-printer.log
sudo chmod 766 /var/log/bh-printer.log
```

## Start at boot
Append to `/etc/rc.local` (replace printer id)
```
PRINTER_ID=AXXXXXXXX /home/pi/bh-printer/start.sh < /dev/null >/var/log/bh-printer.log 2>&1 &
```

## Test development
```
URL=http://api.bistrohub.local PRINTER_ID=AXXXXXXXX USE_CONSOLE=1 nodemon
```
