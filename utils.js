
export function calculateDistance(lat1, lon1, lat2, lon2) {
    // 将角度转换为弧度
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var deltaLat = radLat2 - radLat1;
    var deltaLon = lon2 * Math.PI / 180.0 - lon1 * Math.PI / 180.0;
 
    // 应用Haversine公式
    var a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
          Math.cos(radLat1) * Math.cos(radLat2) *
          Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var R = 6371; // 地球的平均半径，单位为公里
    var d = R * c;
 
    return d;
}

/**
* Simulates a sleep function by returning a promise that resolves after a specified delay.
* @param {number} ms - The number of milliseconds to sleep.
* @returns {Promise} A promise that resolves when the sleep period is over.
*/

export function sleep(ms) {
    return new Promise(resolve => {
        let startTime = Date.now();
        while (Date.now() - startTime < ms) {
            // 空循环，避免CPU占用过高
        }
        resolve();
    });
}