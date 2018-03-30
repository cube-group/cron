# Cron Engine
### 基于Node.js
* node ^8.0.0
* npm ^5.6
* 代替你的crontab,轻松监控(邮件和钉钉webhook机器人报警)
* 精确至秒级(秒 分 时 日 月 周)
* 支持定时shell和定时url-get两种任务方式
* crontab? fuck that!

![](https://github.com/cube-group/cron/blob/master/public/images/dashboard.png)
### 安装
github下载项目
```
git clone git@github.com:cube-group/cron.git
cd cron && npm install --registry=https://registry.npm.taobao.org
```
修改cron/setting.json配置文件
```
{
  "port": 3000,
  "mailSetting": {
    "host": "smtp.you.com",
    "secureConnection": true,
    "port": 465,
    "auth": {
      "user": "hello@you.com",
      "pass": "password"
    },
    "from": "system@suck.com",
    "to": "hello@mail.com,world@mail.com"
  },
  "webhook": "dingding-web-hook",
  "api": {
    "secret": "hello-node-cron-totp-secret"
  },
  "mysql": {
    "connectionLimit": 1,
    "acquireTimeout": 3000,
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": "agreement",
    "database": "cron",
    "multipleStatements": true
  }
}
```
* cron-engine web-server服务端口
* mailSetting - 报警邮件配置项
* webhook - 钉钉群报警机器人webhook
* api - secret最终会用于生成登录时所需要的google-auth-url
* mysql - 数据库配置项

修改cron/setting-engine.json配置文件
```
[
  {
    "name": "hello",//engine名称
    "ip": "127.0.0.1",//唯一外网ip(用于mysql中定位)
    "code": "hello",//唯一编号(用于mysql中定位)
    "mail": "lin2798003@sina.com"//报警邮件组
  },
  {
    "name": "none",
    "ip": "127.0.0.8",
    "code": "none",
    "mail": "lin2798003@sina.com"
  }
]
```
注: 当前engine版本暂时不支持master管理模式下的动态增删改engine列表

执行数据库初始化安装(该命令仅执行一次即可）
```
cd cron && node bin/setup
```
### 以单点模式启动
顾名思义,该模式为对一台任务机的管理方式
查看help帮助
```
cd cron && node bin/task -h
```
如下所示:
```
--help, -h
                Displays help information about this script
                'task -h' or 'task --help'

        --code, -c
                设置任务机编号 (可选)
                'node bin/task -c=任务机编号'

        --ip, -ip
                设置外网ip（可选）
                'node bin/task -ip=127.0.0.1'

        --totp, -t
                获取google auth url
                'node bin/task -t'

        --master, -m
                以master管理模式启动
                'node bin/task -m=1'

        --version
                Displays version info
                task --version
```
注意: -c、-ip是在当前机器无法正确获取外网ip时需要你自己来配置的,如:
```
cd cron && node bin/task -c hello -ip 10.0.0.2
```
### 以master管理模式启动
该模式下的节点可以管理数据库中的所有任务机任务增删改查<br>
当然你可以让任何任务机都以master管理模式启动 :)
```
cd cron && node bin/task -m
```
### 如何实现多节点管理?
例如,您有两台任务机,A、B<br>
A的外网ip为:A-ip<br>
B的外网ip为:B-ip<br>
那么您的setting-engine.json配置应该如下:
```
[
  {
    "name": "A",//engine名称
    "ip": "A-ip",//外网ip(用于mysql中定位)
    "code": "A",//唯一编号(用于mysql中定位)
    "mail": "xx@mail.com"//报警邮件组
  },
  {
    "name": "B",
    "ip": "B-ip",
    "code": "B",
    "mail": "xx@mail.com"
  }
]
```
到A机器上启动
```
cd cron && node bin/task -m -c A
```
到B机器上启动
```
cd cron && node bin/task -c B
```
这样http://A:port/login 即可登录A的master管理模式进行A和B的任务管理
### 如何登录?
1. use the google auth app!see the setting.json's api.secret
2. how to get the google auth url?
```
cd cron && node bin/task -t
#会立马输出标准google-auth-url,然后使用app进行设置即可
```

![](https://github.com/cube-group/cron/blob/master/public/images/login.png)