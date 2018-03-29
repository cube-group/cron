#!/bin/bash
### BEGIN INIT INFO
# Provides: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;xiyoulib
# Required-Start: &nbsp; &nbsp;$all
# Required-Stop: &nbsp; &nbsp; $all
# Default-Start: &nbsp; &nbsp; 2 3 4 5
# Default-Stop: &nbsp; &nbsp; &nbsp;0 1 6
# Short-Description: Start daemon at boot time
# Description: &nbsp; &nbsp; &nbsp; Enable service provided by daemon.
### END INIT INFO
# chkconfig: 345 88 08
# description: Forever for Node.js

DEAMON=/data/website/nodeservice/bin/task  #这里需要填写你自己的Node项目的启动脚本文件
LOG=/data/log/nodejs/log  #可选，日志文件目录
PID=/data/run/nodejs/pid  #必填内容，用于记录forever的进程号

#往下的内容就不用修改了

node=node
forever=forever

case "$1" in
    start)
        $forever start -l $LOG --pidFile $PID -a $DEAMON
        ;;
    stop)
        $forever stop --pidFile $PID $DEAMON
        ;;
    stopall)
        $forever stopall --pidFile $PID
        ;;
    restartall)
        $forever restartall --pidFile $PID
        ;;
    reload|restart)
        $forever restart -l $LOG --pidFile $PID -a $DEAMON
        ;;
    list)
        $forever list
        ;;
    *)
        echo "Usage: /etc.init.d/node {start|stop|restart|reload|stopall|restartall|list}"
        exit 1
        ;;
esac