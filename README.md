# Cron Engine
### Base Node.js
* node must
* npm must
### How to use it?
```
git clone git@github.com:cube-group/cron.git
cd cron && node bin/task -h
```
then as you can see
```
Usage: task [options]

        --help, -h
                Displays help information about this script
                'task -h' or 'task --help'

        --code, -c
                设置任务机编号
                'node bin/task -c=任务机编号'

        --ip, -ip
                设置外网ip
                'node bin/task -ip=127.0.0.1'

        --iip, -iip
                设置内网ip
                'node bin/task -iip=127.0.0.1'

        --totp, -t
                获取google auth url
                'node bin/task -t=secret'

        --master, -m
                是否为master mode
                'node bin/task -m=1'

        --version
                Displays version info
                task --version

```
### See the config
setting.json
```
{
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
  "webhook": "alibaba-dingding-webhook",
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
init cron engine setting
```
[
  {
    "name": "hello",
    "ip": "127.0.0.1",
    "iip": "127.0.0.1",
    "code": "hello",
    "address": "127.0.0.1:3000",
    "mail": "lin2798003@sina.com"
  },
  {
    "name": "none",
    "ip": "127.0.0.8",
    "iip": "127.0.0.8",
    "code": "none",
    "address": "127.0.0.8:3000",
    "mail": "lin2798003@sina.com"
  }
]
```
### How to setup cron-egine?
init db setting, and see the setting.json's mysql
```
cd cron && node bin/setup
```
### How to login cron-engine？
1.use the google auth app!see the setting.json's api.secret
2.how to get the google auth url?
```
cd cron && node bin/task -t
```
![](https://github.com/cube-group/cron/blob/master/public/images/login.png)
### How to use cron-engine?
![](https://github.com/cube-group/cron/blob/master/public/images/dashboard.png)