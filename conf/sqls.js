/**
 * Created by linyang on 17/6/1.
 */
let data = {
    /**
     * 获取任务机详情.
     */
    SELECT_TASK_SERVER: 'SELECT * FROM `c_task` WHERE `ip`=? OR `iip`=? OR `code`=? limit 0,1',
    /**
     * 获取任务机的所有任务.
     */
    SELECT_TASK_CRON: 'SELECT * FROM `c_task_cron` WHERE `tid`=?',
    /**
     * 任务编辑.
     */
    UPDATE_TASK: 'UPDATE `c_task_cron` SET `comment`=?,`time`=?,`value`=?,`mail`=?,`type`=? WHERE `id`=?',
    /**
     * 任务添加.
     */
    ADD_TASK: 'INSERT INTO `c_task_cron` (`comment`,`time`,`value`,`mail`,`type`,`tid`) VALUES (?,?,?,?,?,?)',
    /**
     * 任务删除
     */
    DELETE_TASK: 'DELETE FROM `c_task_cron` WHERE `id`=?',
};

module.exports = data;