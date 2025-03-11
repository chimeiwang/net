import mysql from 'mysql';

const connection = mysql.createConnection({
    host: '124.71.85.180',        // 数据库主机地址
    user: 'root',    // 数据库用户名
    password: '123456',// 数据库密码
    database: 'shanghai_net_test' // 要连接的数据库名称
});

// 连接到数据库
connection.connect((err) => {
    if (err) {
        console.error('连接数据库失败: ' + err.stack);
        return;
    }
    console.log('成功连接到数据库，连接ID ' + connection.threadId);
});

export default connection;
