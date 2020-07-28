
const fs = require('fs'), sharp = require('sharp');
const logger = require('./logger');

const HttpStatus = require('http-status-codes');
const { timeStamp } = require('console');
const { resolve } = require('path');
const { reject } = require('async');

const resizeDir = "./resize/";

module.exports = {
    
     resizeImages(res, imagePath, outPath, W) {
          
        return new Promise((resolve) => {
            sharp(imagePath).resize({width:W})
            .toFile(outPath)
            .then(() => {
                logger.info("resize success");
                fs.readFile(outPath, (err, data) => {
                    resolve(data);
                });
            }).catch((err) => {
                logger.info("resize fail");
                throw err;
            }); 
        });    
        
    },

    convertSizeImages(res, imagePath, outPath, W, H) {
        return new Promise((resolve) => {
            sharp(imagePath).resize({fit:'fill', width:W, height:H})
            .toFile(outPath)
            .then(() => {
                // resize success
                logger.info("convert success");
                fs.readFile(outPath, (err, data) => {
                    resolve(data);
                });
        
            }).catch((err) => {
                logger.info("convert fail");
                throw err;
            }); 
        });
        
    },

    rotateImages(res, imagePath, outPath, angle) {
        return new Promise((resolve) => {
            sharp(imagePath).rotate(angle)
            .toFile(outPath)
            .then(() => {
                // rotate success
                logger.info("rotate success");
                fs.readFile(outPath, (err, data) => {
                    resolve(data);
                });
            
            }).catch((err) => {
                logger.info("rotate fail");
                throw err;
            }); 
        });
    }

};