# task-任务系统
### 特点
* 支持秒级任务
* 支持本机shell任务
* 支持http任务
* 支持配置任务失败后是否发送报警邮件
### 相关代码
```
var taskServer = require('../base/task/server');
taskServer.start();

//查看所有任务的执行状态.
taskServer.getAll();
```