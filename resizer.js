
const fs = require('fs'), sharp = require('sharp');

const logger = require('./logger');
const directory = "images/";
const resized = "resized/";
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

			let bufferedImage = await sharp(originImage.Body)
			.resize(W).toBuffer();
			logger.info("resizeImages " + files +  " success");

			let resizedPath = resized + "resizeImages_" + W + "_" + files;
			const destparams = {
        	    Bucket: bucket,
        	    Key: resizedPath,
        	    Body: bufferedImage,
            	ContentType: "image"
        	};

			const putResult = await S3.putObject(destparams).promise();
			resolve(resizedPath);
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
			
			let bufferedImage = await sharp(originImage.Body)
			.resize(W, H ,{fit:'fill'}).toBuffer();
			logger.info("convertSizeImages " + files +  " success");

			let resizedPath = resized + "convertSizeImages_" + W + "_" + H + "_" + files;
			const destparams = {
        	    Bucket: bucket,
        	    Key: resizedPath,
        	    Body: bufferedImage,
            	ContentType: "image"
        	};

			const putResult = await S3.putObject(destparams).promise();
			resolve(resizedPath);
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

			let bufferedImage = await sharp(originImage.Body)
			.rotate(angle).toBuffer();
			logger.info("rotateImages " + files +  " success");

			let resizedPath = resized + "rotateImages_" + angle + "_" + files;
			const destparams = {
        	    Bucket: bucket,
        	    Key: resizedPath,
        	    Body: bufferedImage,
            	ContentType: "image"
        	};

			const putResult = await S3.putObject(destparams).promise();
			resolve(resizedPath);
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
			
			let bufferedImage = await sharp(originImage.Body)
			.resize(W, H,{fit:'contain'}).toBuffer();
			logger.info("fitSizeImages " + files +  " success");

			let resizedPath = resized + "fitSizeImages_" + W + "_" + H + "_" + files;
			const destparams = {
        	    Bucket: bucket,
        	    Key: resizedPath,
        	    Body: bufferedImage,
            	ContentType: "image"
        	};

			const putResult = await S3.putObject(destparams).promise();
			resolve(resizedPath);
		});
    },

};