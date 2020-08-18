
const fs = require('fs'), sharp = require('sharp');

const { timeStamp } = require('console');
const { resolve } = require('path');
const { reject } = require('async');

const directory = "./images/";
const HttpStatus = require('http-status-codes');

module.exports = {

    async resizeImages(files, W) {
		
		let imagePath = directory + files;

		if(!fs.existsSync(imagePath)) {
			throw new Error(HttpStatus.NOT_FOUND);
		} 

        let resizedImage = await sharp(imagePath)
		.resize({width:W})
		.toBuffer();
			
		return resizedImage;
    },

    async convertSizeImages(files, W, H) {

		let imagePath = directory + files;
		
		if(!fs.existsSync(imagePath)) {
			throw new Error(HttpStatus.NOT_FOUND);
		} 

		let convertedImage = await sharp(imagePath)
		.resize({fit:'fill', width:W, height:H})
		.toBuffer();
			
		return convertedImage;
    },

    async rotateImages(files, angle) {

		let imagePath = directory + files;
		
		if(!fs.existsSync(imagePath)) {
			throw new Error(HttpStatus.NOT_FOUND);
		} 

		let rotatedImage = await sharp(imagePath)
		.rotate(angle)
		.toBuffer();
			
		return rotatedImage;
    }

};