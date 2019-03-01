/**
 * Created by 2ue on 2018/1/5.
 * 用于合并采集到的数据
 */

//合并采集到的数据
//date-year目录

const fs = require('fs');
const path = require('path');

function mergeData(startYear, endYear) {
    //遍历结束的年份, 合并的结果
    let result = {};

    for (startYear; startYear <= endYear; startYear++) {
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, `../date-year/${startYear}.json`), 'utf8'));
        // result.solarInfo = { ...result.solarInfo, ...data.solarInfo };
        // result.lunarInfo = { ...result.lunarInfo, ...data.lunarInfo };
        result = { ...result, ...data };
        console.log(`==== 合并完成${(200 - endYear + startYear) / 2}%  ====`)
    }

    //汇总
    const allTargetPath = path.join(__dirname, '../data/all.json');
    writeJsonData(result, allTargetPath, '阴历阳历');
    // //阴历
    // const solarTargetPath = path.join(__dirname, './data/solar.json');
    // writeJsonData(result.solarInfo, solarTargetPath, '阳历');
    // //阳历
    // const lunarTargetPath = path.join(__dirname, './data/lunar.json');
    // writeJsonData(result.lunarInfo, lunarTargetPath, '阴历');

    function writeJsonData(data, path, msg) {
        let writerStream;
        //创建一个可写入的流
        writerStream = fs.createWriteStream(path);
        writerStream.write(JSON.stringify(data, null, 4), 'utf-8');
        writerStream.end();//标记结束
        writerStream.on('finish', () => {
            console.log(`=====  ${msg}汇总数据汇总成功！ =====`);
        }).on('error', (err) => {
            console.log(err.stack);
            console.log(`=====  ${msg}汇总数据汇总失败！ =====`);
        });
    }
}
module.exports = mergeData;
