/**
 * Created by 2ue on 2018/1/4.
 */

    //lunar农历，阴历
    //solar阳历，太阳历
    //divisions节气，分支

const request = require('request')
const iconv = require('iconv-lite')
const writeFile = require('./write-file');
let {startYear,lunarYear,lunarMon,nmCN,lunarCN,weekText} = require('./config');

//把旧历汉字转换成数字
function countOldToNum(text) {
    let textArr = typeof text === 'object' ? text : text.split(''), num = textArr.length < 2 ? nmCN.indexOf(text) + 1 : textArr.reduce((prev, curr) => lunarCN.indexOf(prev) * 10 + nmCN.indexOf(curr) + 1);
    return num > 30 ? 30 : num;
}
function getUrl(year) {
    console.log(year)
    return `http://data.weather.gov.hk/gts/time/calendar/text/T${year}c.txt`
}

//解析页面
function getHtml (year) {
    if (!year) return [];
    return new Promise(function (resolve, reject) {
        request({ url: getUrl(year), encoding: null }, function (error, response, body) {
            console.log(`=== 开始抓取 ===>  ${getUrl(year)}`);
            if (!error && response.statusCode === 200) {
                resolve(iconv.decode(body, 'big5').toString());
            } else {
                reject(error);
            }
        });
    })
};


function resolveHtml(year,callbak) {
    getHtml(year).then(function (data) {
        // console.log(data)
        var result = {};
        var arr = JSON.parse(JSON.stringify(data.split(/\n/)).replace(/\s+/g, ' ').replace(/\r/g,'').replace(/二十/g, lunarCN[1] + lunarCN[1]).replace(/正/g, nmCN[0]));//将汉字正月中正转换成一，以便正确计算
        //去除开始和尾部的多余数据
        arr = arr.splice(3, arr.length - 5);
        arr.map(function (item) {
            // console.log('item==>',item)
            if(item && item.replace(/\s/g,'')){
                var info = item.split(' ');
                var temp = true, solar = info[0].split(/[^0-9]/), lunar = info[1].split(''), divisions = info[3], weekday = weekText.indexOf(info[2].split('')[2]);
                solar = solar.splice(0, solar.length - 1).join('-');
                //判断是否带月，带月表示当前月第一天
                if (lunar[lunar.length - 1] === '月') {
                    lunarMon = countOldToNum(lunar.splice(0, lunar.length - 1));
                    //防止润一月时，lunarYear重复加
                    if (lunarMon === 1 && temp) {
                        lunarYear = lunarYear + 1;
                        temp = false;
                    }
                    lunar = '一';
                }
                lunar = `${lunarYear}-${lunarMon}-${countOldToNum(lunar)}`;
                result[solar] = {solar,lunar, divisions,weekday};
            }
        });
        if(callbak) callbak(result, year);
        writeFile(result,year,function (y) {
            resolveHtml(y)
        });
    });
};

// module.exports = resolveHtml;

resolveHtml(startYear);