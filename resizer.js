
const fs = require('fs'), sharp = require('sharp');

const { timeStamp } = require('console');
const { resolve } = require('path');
const { reject } = require('async');

const logger = require('./logger');
const directory = "./images/";
const resized = "/tmp/";
const HttpStatus = require('http-status-codes');

module.exports = {

    resizeImages(files, W) {
		
		return new Promise( async (resolve,reject) => {
			let imagePath = directory + files;
			let resizedPath = resized + files;
			if(!fs.existsSync(imagePath)) {
				reject(HttpStatus.NOT_FOUND);
				return;
			} 

        	let resizedImage = await sharp(imagePath)
			.resize({width:W}).toFile(resizedPath)
			.then(data => {
				logger.info("resizeImages " + files +  " success");
				let file = fs.readFileSync(resizedPath);
				resolve(file);
			})
			.catch(err => {
				reject(HttpStatus.INTERNAL_SERVER_ERROR);
			});
			
		});
    },

    convertSizeImages(files, W, H) {

		return new Promise( async (resolve,reject) => {
			let imagePath = directory + files;
			let resizedPath = resized + files;
			if(!fs.existsSync(imagePath)) {
				reject(HttpStatus.NOT_FOUND);
				return;
			} 

			let convertedImage = await sharp(imagePath)
			.resize({fit:'fill', width:W, height:H}).toFile(resizedPath)
			.then(data => {
				logger.info("convertSizeImages " + files +  " success");
				let file = fs.readFileSync(resizedPath);
				resolve(file);
			})
			.catch(err => {
				reject(HttpStatus.INTERNAL_SERVER_ERROR);
			});

		});
    },

    async rotateImages(files, angle) {

		return new Promise( async (resolve,reject) => {
			let imagePath = directory + files;
			let resizedPath = resized + files;
			if(!fs.existsSync(imagePath)) {
				reject(HttpStatus.NOT_FOUND);
				return;
			} 

			let rotatedImage = await sharp(imagePath)
			.rotate(angle).toFile(resizedPath)
			.then(data => {
				logger.info("rotateImages " + files +  " success");
				let file = fs.readFileSync(resizedPath);
				resolve(file);
			})
			.catch(err => {
				reject(HttpStatus.INTERNAL_SERVER_ERROR);
			});
			
		});
    }

};