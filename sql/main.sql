# 任务机表
CREATE TABLE `p_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL COMMENT '任务机名称',
  `ip` varchar(45) NOT NULL COMMENT '任务机外网ip',
  `inner_ip` varchar(45) NOT NULL COMMENT '任务机内网ip',
  `port` int(11) NOT NULL COMMENT '任务机端口',
  `create_time` datetime NOT NULL,
  `mailto` varchar(500) DEFAULT NULL COMMENT '该任务机任务报警接收邮件组',
  `ssh_name` varchar(45) NOT NULL DEFAULT 'root' COMMENT '该任务机ssh默认name',
  `ssh_port` varchar(45) NOT NULL DEFAULT '10068' COMMENT '该任务机ssh默认port',
  `phpbase` varchar(100) DEFAULT NULL COMMENT '该任务机上base库目录',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

# 任务机任务表
CREATE TABLE `p_task_cron` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tid` int(11) NOT NULL COMMENT '关联到p_task中的id',
  `time` varchar(45) NOT NULL COMMENT 'crontab格式的时间格式，支持到秒级，* * * * * * (秒，分，时，日，月，周）',
  `value` varchar(500) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '任务类型，0：为shell脚本，1：为http地址',
  `mail` tinyint(1) NOT NULL DEFAULT '0' COMMENT '执行错误是否发送邮件报警，0：为不发送，1：为发送',
  `create_time` datetime NOT NULL,
  `last_time` datetime DEFAULT NULL,
  `comment` varchar(50) DEFAULT NULL COMMENT '注释',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8;