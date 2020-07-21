
const fs = require('fs'), sharp = require('sharp');
const logger = require('./logger');
const imageHeader = { "Context-Type": "image/jpg" };
const HttpStatus = require('http-status-codes');

const resizeDir = "./resize/";

module.exports = {
    
     resizeImages(res, imagePath, outPath, W) {
          
        sharp(imagePath).resize({width:W})
        .toFile(outPath)
        .then(() => {
            // resize success
            logger.info("resize success");
            fs.readFile(outPath, (err, data) => {
                res.writeHead(HttpStatus.OK, imageHeader);
                res.write(data);
                res.end();   
                });
        }).catch((err) => {
            // resize fail
            logger.info("resize fail");
            let status = HttpStatus.INTERNAL_SERVER_ERROR; 
            let json = {
                msg : HttpStatus.getStatusText(status)
            };
            res.status(status).send(json);
        }); 
    },

    convertSizeImages(res, imagePath, outPath, W, H) {
    
        sharp(imagePath).resize({fit:'fill', width:W, height:H})
        .toFile(outPath)
        .then(() => {
            // resize success
            logger.info("resize success");
            fs.readFile(outPath, (err, data) => {
                res.writeHead(HttpStatus.OK, imageHeader);
                res.write(data);    
                res.end();   
            });
        
        }).catch((err) => {
            // resize fail
            logger.info("resize fail");
            let status = HttpStatus.INTERNAL_SERVER_ERROR; 
            let json = {
                msg : HttpStatus.getStatusText(status)
            };
            res.status(status).send(json);
        }); 
    }
};