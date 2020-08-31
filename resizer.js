
const fs = require('fs'), sharp = require('sharp');

const logger = require('./logger');
const directory = "images/";
const resized = "/tmp/";
const HttpStatus = require('http-status-codes');
const AWS = require('aws-sdk');
const access = process.env.access;
const secret = process.env.secret;
const bucket = process.env.bucket;

const S3 = new AWS.S3({accessKeyId : access, secretAccessKey : secret});

module.exports = {

    resizeImages(files, W) {
		
		return new Promise( async (resolve,reject) => {
			let params = {
				Bucket : bucket,
				Key : directory + files
			}

			let originImage;
			try {
				originImage = await S3.getObject(params).promise();
			} catch (err) {
				reject(HttpStatus.NOT_FOUND);
				return;
			}
			
			let resizedPath = resized + files;
        	let resizedImage = await sharp(originImage.Body)
			.resize(W).toFile(resizedPath)
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
			let params = {
				Bucket : bucket,
				Key : directory + files
			}

			let originImage;
			try {
				originImage = await S3.getObject(params).promise();
			} catch (err) {
				reject(HttpStatus.NOT_FOUND);
				return;
			}
			
			let resizedPath = resized + files;
			let convertedImage = await sharp(originImage.Body)
			.resize(W, H ,{fit:'fill'}).toFile(resizedPath)
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
			let params = {
				Bucket : bucket,
				Key : directory + files
			}

			let originImage;
			try {
				originImage = await S3.getObject(params).promise();
			} catch (err) {
				reject(HttpStatus.NOT_FOUND);
				return;
			}

			let resizedPath = resized + files;
			let rotatedImage = await sharp(originImage.Body)
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
    },

	async fitSizeImages(files, W, H) {

		return new Promise( async (resolve,reject) => {
			let params = {
				Bucket : bucket,
				Key : directory + files
			}

			let originImage;
			try {
				originImage = await S3.getObject(params).promise();
			} catch (err) {
				reject(HttpStatus.NOT_FOUND);
				return;
			}

			let resizedPath = resized + files;
			let convertedImage = await sharp(originImage.Body)
			.resize(W, H,{fit:'contain'}).toFile(resizedPath)
			.then(data => {
				logger.info("fitSizeImages " + files +  " success");
				let file = fs.readFileSync(resizedPath);
				resolve(file);
			})
			.catch(err => {
				reject(HttpStatus.INTERNAL_SERVER_ERROR);
			});

		});
    },

};