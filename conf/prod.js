/**
 * Created by linyang on 17/4/13.
 */
var config = {
    API: {
        SECRET: 'hello-nodecronservice'
    },
    SHELL: {
        RESTART_NGINX: 'nginx -s reload',
        RESTART_NODE: 'forever restartall',
        RESTART_FPM: 'phpfpm_restart.sh'
    },
    MYSQL: {
        MAIN: {
            connectionLimit: 1,
            acquireTimeout: 5000,
            host: "host",
            port: 3306,
            user: "username",
            password: "password",
            database: "database"
        }
    }
};

module.exports = config;