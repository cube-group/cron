/**
 * Created by linyang on 17/6/1.
 */
var data = {
    /**
     * 获取任务机详情.
     */
    SELECT_TASK_SERVER: 'SELECT * FROM `p_task` WHERE `ip`=? OR `inner_ip`=? limit 0,1',
    /**
     * 获取任务机的所有任务.
     */
    SELECT_TASK_CRON: 'SELECT * FROM `p_task_cron` WHERE `tid`=?',
    /**
     * 获取代理机详情.
     */
    SELECT_PROXY_SERVER: 'SELECT * FROM `p_proxy` WHERE `ip`=? OR `inner_ip`=? limit 0,1'
};

module.exports = data;