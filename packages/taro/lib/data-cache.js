"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cacheDataSet = cacheDataSet;
exports.cacheDataGet = cacheDataGet;
exports.cacheDataHas = cacheDataHas;
var data = {};

function cacheDataSet(key, val) {
  data[key] = val;
}

function cacheDataGet(key, delelteAfterGet) {
  var temp = data[key];
  delelteAfterGet && delete data[key];
  return temp;
}

function cacheDataHas(key) {
  return key in data;
}