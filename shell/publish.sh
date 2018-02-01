#!/bin/sh
#线上环境nodeservice

dir=/data/website/nodeservice
npm=/opt/soft/node/bin/npm
forever=forever
js_file_src=/data/website/nodeservice/bin/task

#安装forever
${npm} install forever -g --registry=https://registry.npm.taobao.org

#准备nodejs libs
function installNodeModules(){
    cd ${dir}
    ${npm} install body-parser -g --registry=https://registry.npm.taobao.org
    ${npm} install cookie-parser -g --registry=https://registry.npm.taobao.org
    ${npm} install dateformat -g --registry=https://registry.npm.taobao.org
    ${npm} install debug -g --registry=https://registry.npm.taobao.org
    ${npm} install ejs -g --registry=https://registry.npm.taobao.org
    ${npm} install express -g --registry=https://registry.npm.taobao.org
    ${npm} install morgan -g --registry=https://registry.npm.taobao.org
    ${npm} install multer -g --registry=https://registry.npm.taobao.org
    ${npm} install mysql -g --registry=https://registry.npm.taobao.org
    ${npm} install node-cron -g --registry=https://registry.npm.taobao.org
    ${npm} install nodemailer -g --registry=https://registry.npm.taobao.org
    ${npm} install request -g --registry=https://registry.npm.taobao.org
    ${npm} install serve-favicon -g --registry=https://registry.npm.taobao.org
    ${npm} install utility -g --registry=https://registry.npm.taobao.org
    ${npm} install uuid -g --registry=https://registry.npm.taobao.org
    ${npm} install async -g --registry=https://registry.npm.taobao.org

    ${npm} link body-parser
    ${npm} link cookie-parser
    ${npm} link dateformat
    ${npm} link debug
    ${npm} link ejs
    ${npm} link express
    ${npm} link morgan
    ${npm} link multer
    ${npm} link mysql
    ${npm} link node-cron
    ${npm} link nodemailer
    ${npm} link request
    ${npm} link serve-favicon
    ${npm} link utility
    ${npm} link uuid
    ${npm} link async
}

#开启nodejs service
function startservice() {
    cd ${dir}
    rm -rf *.lock
    > prod.lock
    sleep 1s
    ${forever} stopall
    sleep 1s
    ${forever} start ${js_file_src}
}
installNodeModules
startservice