'use strict';

/**
 * Copyright (c) 2017 Copyright brainpoint All Rights Reserved.
 * Author: lipengxiang
 * Desc:
 */

var utils = require('../common/utils');

/**
 * @desc: 模拟sleep.
 * @return: Promise.
 *     在ms时间后执行.
 * @e.g.
 *     febs.utils.sleep(1000).then(()=>{
          //1000ms之后resolve.
       });
 */
exports.sleep = utils.sleep;

/**
 * @desc: the browser is mobile.
 * @param userAgent: the browser user agent string.
 */
exports.browserIsMobile = utils.browserIsMobile;

/**
 * @desc: the browser is ios.
 * @param userAgent: the browser user agent string.
 */
exports.browserIsIOS = utils.browserIsIOS;


/**
 * @desc: the browser is phone.
 * @param userAgent: the browser user agent string.
 */
exports.browserIsPhone = utils.browserIsPhone;


/**
 * @desc: the browser is weixin.
 */
exports.browserIsWeixin = utils.browserIsWeixin;

/**
 * @desc: 获取时间的string.
 * @param time: ms.
 * @param fmt: 格式化, 默认为 'HH:mm:ss'
 *             年(y)、月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 *              'yyyy-MM-dd hh:mm:ss.S' ==> 2006-07-02 08:09:04.423
 *              'yyyy-MM-dd E HH:mm:ss' ==> 2009-03-10 星期二 20:09:04
 *              'yyyy-M-d h:m:s.S'      ==> 2006-7-2 8:9:4.18
 * @param weekFmt: 星期的文字格式, 默认为 {'0':'星期天', '1': '星期一', ..., '6':'星期六'}
 * @return: string.
 */
exports.getTimeString = utils.getTimeString;

/**
 * @desc: 获取指定时间距离现在的时间描述.
 *        例如, 昨天, 1小时前等.
 * @param time: ms. 小于当前时间, 大于当前时间将显示为 '刚刚';
 * @param strFmt: 需要显示的文字. 
 *                默认为 {
 *                        now:    '刚刚',           // 3秒钟以内将显示此信息.
 *                        second: '秒前',
 *                        minute: '分钟前',
 *                        hour:   '小时前',
 *                        day_yesterday: '昨天',
 *                        day:    '天前',
 *                        month:  '个月前',          // 6个月内将显示此信息.
 *                        time:   'yyyy-M-d h:m:s'  // 超过6个月将使用此格式格式化时间
 *                       }
 * @return: string.
 */
exports.getTimeStringFromNow = utils.getTimeStringFromNow;

/**
 * @desc: getDate('2012-05-09')
 * @return: Date.
 */
exports.getDate = utils.getDate;


/**
 * @desc: getDate2('20120509')
 * @return: Date.
 */
exports.getDate2 = utils.getDate2;


/**
 * @desc: 合并多个map.
 * @return: {}
 */
exports.mergeMap = utils.mergeMap;


/**
* @desc: 判断参数是否是null,undefined,NaN
* @return: boolean
*/
exports.isNull = utils.isNull;


/**
* @desc: 判断是否是ie.
*/
exports.browserIsIE=
function() {
  if (!!window.ActiveXObject || "ActiveXObject" in window)
    return true;
  else
    return false;
}

/**
* @desc: 判断ie版本号.
* @return number. 非ie返回Number.MAX_SAFE_INTEGER.
*/
exports.browserIEVer=
function() {
  if (!exports.browserIsIE()) return Number.MAX_SAFE_INTEGER;
  
  var b_version = navigator.appVersion
  var version = b_version.split(";");
  var trim_Version = version[1].replace(/[ ]/g, "");
  if (!trim_Version || trim_Version.length < 5) {
    var userAgent = navigator.userAgent;
    userAgent = userAgent.toLowerCase();
    if (userAgent.indexOf('rv:11.') > 0) return 11;
    if (userAgent.indexOf('rv:12.') > 0) return 12;
    return Number.MAX_SAFE_INTEGER;
  }

  return parseInt(trim_Version[4]);
}

/**
 * @desc: the browser is support html5.
 */
exports.browserIsSupportHtml5=
function () {
  if (typeof(Worker) !== "undefined")
  {
      return true;
  }
  else
  {
      return false;
  }
}