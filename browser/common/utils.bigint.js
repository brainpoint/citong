'use strict';

/**
 * Copyright (c) 2017 Copyright brainpoint All Rights Reserved.
 * Author: lipengxiang
 * Desc:
 */

// var BigNumber = require('../third-party/bignumber.min.js');
var BigNumber = require('bignumber.js');


/**
 * @desc: 判断是否是bigint.
 */
exports.bigint_check = 
function(v) {
  if (Number.isInteger(v))
    return true;
  if (!v)
    return false;

  if (typeof v === 'string')
  {
    if (v.length > 22 || v.length < 1)
      return false;

    for (var j = 1; j < v.length; j++) {
      if (v[j] < '0' || v[j] > '9')
        return false;
    }
    
    if (v[0] == '-') {
      if (v.length < 2 || v[1] < '1' || v[1] > '9')
        return false;
    } else {
      if (v[j] < '1' || v[j] > '9')
        return false;
    }

    return true;
  }
  else {
    return false;
  }
}

/**
* @desc: calc bigint
* @return: bigint.
*/
exports.bigint_add = 
function(a, b) {if (!(a instanceof BigNumber)) a = new BigNumber(a); return a.plus(b);}

exports.bigint_minus = 
function(a, b) {if (!(a instanceof BigNumber)) a = new BigNumber(a); return a.minus(b);}

exports.bigint_dividedBy = 
function(a, b) {if (!(a instanceof BigNumber)) a = new BigNumber(a); return a.dividedBy(b);}

exports.bigint_mul = 
function(a, b) {if (!(a instanceof BigNumber)) a = new BigNumber(a); return a.times(b);}

/**
* @desc: compare with bigint.
* @return: boolean.
*/
exports.bigint_equal = 
function(a, b) {if (!(a instanceof BigNumber)) a = new BigNumber(a); return a.equals(b);}

exports.bigint_more_than = 
function(a, b) {if (!(a instanceof BigNumber)) a = new BigNumber(a); return a.greaterThan(b);}

exports.bigint_more_than_e = 
function(a, b) {if (!(a instanceof BigNumber)) a = new BigNumber(a); return a.greaterThanOrEqualTo(b);}

exports.bigint_less_than = 
function(a, b) {if (!(a instanceof BigNumber)) a = new BigNumber(a); return a.lessThan(b);}

exports.bigint_less_than_e = 
function(a, b) {if (!(a instanceof BigNumber)) a = new BigNumber(a); return a.lessThanOrEqualTo(b);}


/**
* @desc: 转换bigint->string.
* @param fixed: 小数位个数, 默认为0.
* @return: string.
*/
exports.bigint_toFixed = 
function(a, fixed) { fixed = (fixed||0); if (!(a instanceof BigNumber)) a = new BigNumber(a); return a.toFixed(fixed);}

