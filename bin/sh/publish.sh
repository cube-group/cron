#!/bin/sh
#node cron

dir=/data/website/cron
js_file_src=/data/website/cron/bin/task

#安装forever
npm install forever -g --registry=https://registry.npm.taobao.org

#准备nodejs libs
function installNodeModules(){
    cd ${dir}
    ${npm} install -g --registry=https://registry.npm.taobao.org
    ${npm} link
}

#开启nodejs service
function startservice() {
    cd ${dir}
    sleep 1s
    ${forever} stopall
    sleep 1s
    ${forever} start ${js_file_src}
}
installNodeModules
startservice