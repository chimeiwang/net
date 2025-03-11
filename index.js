import { getAllTime } from './getFile.js'
import connection from './db.js'
import { sleep } from './utils.js'
const a = await getAllTime(121.253548,31.331280,121.617199,31.130441)
const maxGetNum = 1300, start_lat = 121.253548, start_lng = 31.331280, end_lat = 121.617199, end_lng = 31.130441, addLat = 0.03, addLng = 0.008;
let getnum = 0
const dest_cycle = async (origin_lat, origin_lng, dest_lat, dest_lng) => {
    while(getnum < maxGetNum){
        getnum++;
        dest_lng = dest_lng - addLng;
        if(dest_lng < end_lng){
            dest_lat = dest_lat + addLat;
            if(dest_lat > end_lat){
                break;
            }else{
                dest_lng = orrgin_lng;
            }
        }
        const data = await getAllTime(origin_lat, origin_lng, dest_lat, dest_lng);
        sleep(3000);
        await addData(data, (err, result) => {
            if (err) {
                console.error('添加数据失败: ' + err.stack);
                return;
            }
            console.log('成功添加数据，影响的行数: ' + result.affectedRows);
        });
    }
}

const main = async()=> {
    let origin_lat = start_lat, origin_lng = start_lng, dest_lat = start_lat, dest_lng = start_lng;
    while(getnum < maxGetNum){
        if(origin_lng < end_lng){
            if(origin_lat > end_lat){
                // 关闭连接
                connection.end((err) => {
                    if (err) {
                        console.error('关闭连接失败: ' + err.stack);
                        return;
                    }
                    console.log('数据库连接已关闭');
                });
                break;
            }else{
                origin_lat = origin_lat + addLat;
            }
            
        }
        await dest_cycle(origin_lat, origin_lng, dest_lat, dest_lng);
        origin_lng = origin_lng - addLng;
    }
    
}

const addData = async (data, callback) => {
    const query = 'INSERT INTO net SET ?'; // 替换 your_table 为你的表名
    await connection.query(query, data, (error, results) => {
        if (error) {
            return callback(error);
        }
        callback(null, results);
    });
};



main();