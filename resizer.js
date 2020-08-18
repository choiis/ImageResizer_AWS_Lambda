
const fs = require('fs'), sharp = require('sharp');

const { timeStamp } = require('console');
const { resolve } = require('path');
const { reject } = require('async');

const directory = "./images/";
const HttpStatus = require('http-status-codes');

module.exports = {

    resizeImages(files, W) {
		
		return new Promise( async (resolve,reject) => {
			let imagePath = directory + files;

			if(!fs.existsSync(imagePath)) {
				reject(HttpStatus.NOT_FOUND);
			} 

        	let resizedImage = await sharp(imagePath)
			.resize({width:W})
			.toBuffer();

			resolve(resizedImage);
		});
    },

    convertSizeImages(files, W, H) {

		return new Promise( async (resolve,reject) => {
			let imagePath = directory + files;
		
			if(!fs.existsSync(imagePath)) {
				reject(HttpStatus.NOT_FOUND);
			} 

			let convertedImage = await sharp(imagePath)
			.resize({fit:'fill', width:W, height:H})
			.toBuffer();
			
			resolve(convertedImage);
		});
    },

    async rotateImages(files, angle) {

		return new Promise( async (resolve,reject) => {
			let imagePath = directory + files;
		
			if(!fs.existsSync(imagePath)) {
				reject(HttpStatus.NOT_FOUND);
			} 

			let rotatedImage = await sharp(imagePath)
			.rotate(angle)
			.toBuffer();
			
			resolve(rotatedImage);
		});
    }

};