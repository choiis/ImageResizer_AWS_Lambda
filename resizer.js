
const fs = require('fs'), sharp = require('sharp');

const HttpStatus = require('http-status-codes');
const { timeStamp } = require('console');
const { resolve } = require('path');
const { reject } = require('async');

const resizeDir = "./resize/";

module.exports = {

    resizeImages(res, imagePath, outPath, W) {
        return new Promise((resolve, reject) => {
            sharp(imagePath).resize({width:W})
            .toFile(outPath)
            .then(() => {
                fs.readFile(outPath, (err, data) => {
                    resolve(data);
                });
            }).catch((err) => {
                reject(err);
            }); 
        });    
        
    },

    convertSizeImages(res, imagePath, outPath, W, H) {
        return new Promise((resolve, reject) => {
            sharp(imagePath).resize({fit:'fill', width:W, height:H})
            .toFile(outPath)
            .then(() => {
                fs.readFile(outPath, (err, data) => {
                    resolve(data);
                });
        
            }).catch((err) => {
                reject(err);
            }); 
        });
        
    },

    rotateImages(res, imagePath, outPath, angle) {
        return new Promise((resolve, reject) => {
            sharp(imagePath).rotate(angle)
            .toFile(outPath)
            .then(() => {
                fs.readFile(outPath, (err, data) => {
                    resolve(data);
                });
            
            }).catch((err) => {
                reject(err);
            }); 
        });
    }

};