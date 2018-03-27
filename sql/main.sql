# 任务机表
CREATE TABLE `c_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL COMMENT '任务机名称',
  `ip` varchar(45) NOT NULL COMMENT '任务机外网ip',
  `inner_ip` varchar(45) NOT NULL COMMENT '任务机内网ip',
  `code` varchar(45) NOT NULL COMMENT '任务机标号',
  `address` varchar(100) NOT NULL DEFAULT '' COMMENT '该任务机地址，例如：127.0.0.1:3000',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mail` varchar(500) DEFAULT NULL COMMENT '该任务机任务报警接收邮件组',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

# 任务机任务表
CREATE TABLE `c_task_cron` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tid` int(11) NOT NULL COMMENT '关联到p_task中的id',
  `time` varchar(45) NOT NULL COMMENT 'crontab格式的时间格式，支持到秒级，* * * * * * (秒，分，时，日，月，周）',
  `value` varchar(500) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '任务类型，0：为shell脚本，1：为http地址',
  `mail` tinyint(1) NOT NULL DEFAULT '0' COMMENT '执行错误是否发送邮件报警，0：为不发送，1：为发送',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_time` datetime ON UPDATE CURRENT_TIMESTAMP,
  `comment` varchar(50) DEFAULT NULL COMMENT '注释',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8;