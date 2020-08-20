
const fs = require('fs'), sharp = require('sharp');

const { timeStamp } = require('console');
const { resolve } = require('path');
const { reject } = require('async');

const logger = require('./logger');
const directory = "./images/";
const HttpStatus = require('http-status-codes');

module.exports = {

    resizeImages(files, W) {
		
		return new Promise( async (resolve,reject) => {
			let imagePath = directory + files;

			if(!fs.existsSync(imagePath)) {
				reject(HttpStatus.NOT_FOUND);
				return;
			} 

        	let resizedImage = await sharp(imagePath)
			.resize({width:W})
			.toBuffer();
			logger.info("resizeImages " + files +  " success");
			resolve(resizedImage);
		});
    },

    convertSizeImages(files, W, H) {

		return new Promise( async (resolve,reject) => {
			let imagePath = directory + files;
		
			if(!fs.existsSync(imagePath)) {
				reject(HttpStatus.NOT_FOUND);
				return;
			} 

			let convertedImage = await sharp(imagePath)
			.resize({fit:'fill', width:W, height:H})
			.toBuffer();
			logger.info("convertSizeImages " + files +  " success");
			resolve(convertedImage);
		});
    },

    async rotateImages(files, angle) {

		return new Promise( async (resolve,reject) => {
			let imagePath = directory + files;
		
			if(!fs.existsSync(imagePath)) {
				reject(HttpStatus.NOT_FOUND);
				return;
			} 

			let rotatedImage = await sharp(imagePath)
			.rotate(angle)
			.toBuffer();
			logger.info("rotateImages " + files +  " success");
			resolve(rotatedImage);
		});
    }

};