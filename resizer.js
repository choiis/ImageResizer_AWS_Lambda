
const fs = require('fs'), sharp = require('sharp');

const { timeStamp } = require('console');
const { resolve } = require('path');
const { reject } = require('async');

module.exports = {

    async resizeImages(imagePath, W) {
        let resizedImage = await sharp(imagePath)
		.resize({width:W})
		.toBuffer();
			
		return resizedImage;
    },

    async convertSizeImages(imagePath, W, H) {
		let convertedImage = await sharp(imagePath)
		.resize({fit:'fill', width:W, height:H})
		.toBuffer();
			
		return convertedImage;
    },

    async rotateImages(imagePath, angle) {
		let rotatedImage = await sharp(imagePath)
		.rotate(angle)
		.toBuffer();
			
		return rotatedImage;
    }

};