import fetch from 'node-fetch';
import { calculateDistance } from './utils.js';
import connection from './db.js';
import { sleep } from './utils.js'

/**
 * 获取两个地点之间不同交通方式的耗时
 * 通过高德地图API获取步行、骑行、驾车和公交路线的时间
 * @param {number} origin_lat - 起点纬度
 * @param {number} origin_lng - 起点经度
 * @param {number} dest_lat - 终点纬度
 * @param {number} dest_lng - 终点经度
 * @returns {Promise<Object>} 返回包含距离和各种交通方式耗时的对象
 *                           {distance: 直线距离,
 *                            walking: 步行时间,
 *                            bicycling: 骑行时间,
 *                            driving: 驾车时间,
 *                            transit: 公交时间}
 * @note 步行仅在距离小于3公里时计算
 * @note 骑行仅在距离小于8公里时计算
 * @note 时间单位为秒，无法获取时返回100000
 */
export async function getAllTime(origin_lat, origin_lng, dest_lat, dest_lng) {
    const distance = calculateDistance(121.253548, 31.331280, 121.617199, 31.130441);
    let data = {
        origin_lat: origin_lat,
        origin_lng: origin_lng,
        dest_lat: dest_lat,
        dest_lng: dest_lng,
        distance: distance,
        driving: 100000,
        walking: 100000,
        bicycling: 100000,
        transit: 100000,
    }
    if(distance < 3){
        console.log(`https://restapi.amap.com/v5/direction/walking?key=8fd33196bc2afa57afd32c5f70e3c67e&origin=${origin_lat},${origin_lng}&destination=${dest_lat},${dest_lng}&show_fields=cost`)
        let walkingRes = await fetch(`https://restapi.amap.com/v5/direction/walking?key=8fd33196bc2afa57afd32c5f70e3c67e&origin=${origin_lat},${origin_lng}&destination=${dest_lat},${dest_lng}&show_fields=cost`,{
            method: 'GET',
        })
        const walkingData = await walkingRes.json()
        data.walking = walkingData.route.paths[0]?.cost?.duration || 100000;
        sleep(1000);
    }
    if(distance < 8){
        console.log(`https://restapi.amap.com/v5/direction/bicycling?key=8fd33196bc2afa57afd32c5f70e3c67e&origin=${origin_lat},${origin_lng}&destination=${dest_lat},${dest_lng}&show_fields=cost`)
        let bicyclingRes = await fetch(`https://restapi.amap.com/v5/direction/bicycling?key=8fd33196bc2afa57afd32c5f70e3c67e&origin=${origin_lat},${origin_lng}&destination=${dest_lat},${dest_lng}&show_fields=cost`,{
            method: 'GET',
        })
        const bicyclingData = await bicyclingRes.json()
        data.bicycling = bicyclingData.route.paths[0].distance || 100000;
        sleep(1000);
    }
    console.log(`https://restapi.amap.com/v5/direction/driving?key=8fd33196bc2afa57afd32c5f70e3c67e&origin=${origin_lat},${origin_lng}&destination=${dest_lat},${dest_lng}&show_fields=cost`)
    let drivingRes = await fetch(`https://restapi.amap.com/v5/direction/driving?key=8fd33196bc2afa57afd32c5f70e3c67e&origin=${origin_lat},${origin_lng}&destination=${dest_lat},${dest_lng}&show_fields=cost`,{
        method: 'GET',
    })
    const drivingData = await drivingRes.json()
    data.driving = drivingData.route.paths[0]?.cost?.duration || 100000;
    sleep(1000);
    console.log(`https://restapi.amap.com/v5/direction/transit/integrated?key=8fd33196bc2afa57afd32c5f70e3c67e&origin=${origin_lat},${origin_lng}&destination=${dest_lat},${dest_lng}`)
    let transitRes = await fetch(`https://restapi.amap.com/v5/direction/transit/integrated?key=8fd33196bc2afa57afd32c5f70e3c67e&origin=${origin_lat},${origin_lng}&destination=${dest_lat},${dest_lng}&city1=3101&city2=3101&show_fields=cost`,{
        method: 'GET',
    })
    const transitData = await transitRes.json()
    data.transit = transitData.route.transits[0]?.cost?.duration || 100000;
    sleep(1000);
    return data;
}



