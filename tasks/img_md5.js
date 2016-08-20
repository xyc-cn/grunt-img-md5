/*
 * grunt-img-md5
 * https://github.com/xyc-cn/grunt-img-md5
 *
 * Copyright (c) 2016 easonxie
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    var fs = require('fs');
    var crypto = require('crypto');
    var path = require('path');
    var _ = require('underscore');
    var imgMatchList = [];
    /**
     * 获取文件md5值
     * @param p
     * @returns {*}
     */
    function getMd5(p,filePath) {
        var str;
        try {
            str = fs.readFileSync(p, 'utf-8');
        } catch (e) {
            grunt.log.warn(filePath +" no such img src = " + p);
            return null;
        }
        var md5um = crypto.createHash('md5');
        md5um.update(str);
        return md5um.digest('hex');
    }

    /**
     * 处理文件
     * @param p
     * @param dest
     */
    function handleFile(p, dest, config) {
        dest = dest ? dest : ['png', 'jpg', 'gif'];
        var src = grunt.file.read(p);
        var path = config.map && config.map(p, config) || dest + p;//处理完的文件地址
        var imgArray = matchImg(p, src, path, config);//文件里面引用的图片数组
        imgArray = _.uniq(imgArray, function (v,t) {
            return v.item;
        });
        imgArray.forEach(function (v) {//替换文件里面的图片名
            src = src.replace(new RegExp(v.item,'g'), v.value);
        });

        grunt.file.write(path, src);
        imgMatchList = imgMatchList.concat(imgArray);
    }

    /**
     * 匹配文件里面引用的图片，修改图片名
     * @param p
     * @param src
     * @returns {Array}等待替换的数组对象
     */
    function matchImg(p, src, dest, config) {
        var imgMd5 = [],srcList,imgList,tempList;
        var patt_src = /src\s*=\s*["']([^<">']+?\.(jpg|png|gif))/g;
        var patt_url = /url\(['"]?([^<">\)']+?\.(jpg|png|gif))/g;
        if(config&&config.options&&config.options.banDefalut){

        }else{
            srcList = getMatchImgList(patt_src,src);
            imgList = getMatchImgList(patt_url,src);
            imgMd5 = imgMd5.concat(getMapArray(p,config,dest,srcList));
            imgMd5 = imgMd5.concat(getMapArray(p,config,dest,imgList));
        }
        if(config&&config.options&&config.options.RegExp){
            config.options.RegExp.forEach(function (v) {
                tempList = getMatchImgList(v.RegExp,src, v.index);
                imgMd5 = imgMd5.concat(getMapArray(p,config,dest,tempList));
            })
        }
        return imgMd5;
    }

    /**
     * 根据正则获取匹配的图片url数组
     * @param patt
     * @returns {Array}
     */
    function getMatchImgList(patt,src,index){
        var result,imgList = [];
            index = index?index:1;

        while ((result = patt.exec(src)) != null) {
            if(imgList.indexOf(result[index]) < 0){
                result[index] = result[index].trim();
                imgList.push(result[index]);
            }
        }
        return imgList;
    }
    /**
     * 获取匹配的图片键值对数组
     * @param p
     * @param config
     * @param dest
     * @param imgList
     * @returns {Array}
     */
    function getMapArray(p,config,dest,imgList){
        var imgMd5 = [];
        imgList && imgList.forEach(function (v, i) {
            if (v.substr(0, 7) == "http://" || v.substr(0, 7) == "https:/") {
                return;
            }
            var imgPath = getImgPath(p, v), destPath = getImgPath(dest, v), imgType;
            if (config.options && config.options.Base && config.options.Target) {
                var relatives = path.relative(config.options.Base, p);
                imgPath = path.join(config.options.Base, '../', relatives, v);
                destPath = path.join(config.options.Target, '../', relatives, v);
            }
            if (config.options && config.options.BaseMap) {
                if (typeof config.options.BaseMap == "function") {
                    imgPath = config.options.BaseMap(v);
                }
            }
            if (config.options && config.options.TargetMap) {
                if (typeof config.options.TargetMap == "function") {
                    destPath = config.options.TargetMap(v);
                }
            }
            if (testMd5(imgPath,p,config)) {
                return;
            }
            var srcPath = imgPath;
            var md5 = getMd5(imgPath,p);
            if (md5) {
                if(config&&config.options&&config.options.md5Length){
                    if(md5.length>config.options.md5Length){
                        md5 = md5.slice(0,config.options.md5Length);
                    }
                }
                imgPath.match(/\w*.(png|jpg|gif)/);
                imgType = RegExp.$1;
                destPath = destPath.replace(/\w*.(png|jpg|gif)/, md5 + "." + imgType);
                if (!grunt.file.exists(destPath)) {
                    grunt.file.copy(srcPath, destPath);
                }
                imgMd5.push({
                    item: v,
                    value: v.replace(/\w*.(png|jpg|gif)/, md5 + "." + imgType)
                });
            }
        });
        return imgMd5;
    }
    /**
     * 判断图片md5是不是改变了
     * @param imgPath
     */
    function testMd5(imgPath,filePath,config) {
        var oldMd5 = imgPath.match(/(\w*).(png|jpg|gif)/)[1];
        var md5 = getMd5(imgPath,filePath);
        if(config&&config.options&&config.options.md5Length){
            if(md5.length>config.options.md5Length){
                md5 = md5.slice(0,config.options.md5Length);
            }
        }
        if (oldMd5 == md5) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 获取文件里面图片的绝对路径
     * @param filePath
     * @param imgPath
     * @returns {*}
     */
    function getImgPath(filePath, imgPath) {
        var deep = imgPath.match(/(\.\.\/)/g);
        var str = [];
        str.push(filePath);
        if (deep) {
            for (var i = 0; i < deep.length; i++) {
                str.push("../");
            }
        }
        str.push(imgPath);
        return path.resolve.apply(this, str);
    }

    /**
     * 写入map文件
     * @param data
     * @param path
     */
    function recordMatchImg(data,path){
        var src =[],fileData;
        if (grunt.file.exists(path)) {
            src = grunt.file.read(path);
            fileData = src;
            src = JSON.parse(src);
        }
        src = src.concat(data);
        src = _.uniq(src, function (v,t) {
            return v.item;
        });
        src = JSON.stringify(src);
        if(src != fileData){
            grunt.file.write(path,src);
        }
    }

    grunt.registerMultiTask('img_md5', 'The best Grunt plugin ever.', function (e) {
        var config = this.data;
        this.files.forEach(function (file) {
            file.src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    handleFile(filepath, file.dest, config);
                    return true;
                }
            });
        });
        if(config.noMapFile){
            return;
        }
        recordMatchImg(imgMatchList,'img_md5.js');
        return;
    });

};
