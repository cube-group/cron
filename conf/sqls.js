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
};

module.exports = data;