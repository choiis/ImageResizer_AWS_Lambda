'use strict';
const fs = require('fs'), sharp = require('sharp');
const HttpStatus = require('http-status-codes');

const logger = require('./logger');
const resizer = require('./resizer');
const { isContext } = require('vm');

const imageHeader = { "Content-Type": "image/jpg" };
const iae = "Illegal Argument Exception"

const minSize = 100;
const maxSize = 1200;
const limitRatio = 2;

const json404 = {
	statusCode: HttpStatus.NOT_FOUND,
	body: JSON.stringify(
		{msg : HttpStatus.getStatusText(HttpStatus.NOT_FOUND)}
	)
};

const jsonIae = {
	statusCode: HttpStatus.BAD_REQUEST,
	body: JSON.stringify(
		{msg : iae}
	)
};

const imgExtension = /(.*?)\.(jpg|JPG|png|PNG|gif|GIF)$/;

module.exports.resolve = async (event ,context, callback) => {
	let req = event.pathParameters;
	let path = event.path;
	logger.info("resolve " + path);
	if (path.startsWith('/resizeImages')) {
		
		let files = req.files;
		let W = parseInt(req.width);
		if(isNaN(W) || W < minSize || W > maxSize || !imgExtension.test(files)) {
			logger.error("resizeImages Illegal Argument");
			return jsonIae;
		} 

		await resizer.resizeImages(files, W)
		.then(data => {
			const response = {
				statusCode: HttpStatus.OK,
				headers: imageHeader,
				body: data.toString("base64"),
				isBase64Encoded: true
			}
		
			callback(null, response);
		})
		.catch(err => {
			logger.error("resizeImages error " + err);
			callback(null, json404);
		});

	} else if (path.startsWith('/convertSizeImages')) {
		
		let files = req.files;
		let W = parseInt(req.width);
		let H = parseInt(req.height);
		if(isNaN(W) || isNaN(H) || (H > (W * limitRatio)) || (W > (H * limitRatio)) || !imgExtension.test(files)) {
			logger.error("convertSizeImages Illegal Argument");
			return jsonIae;
		}
		
		await resizer.convertSizeImages(files, W, H)
		.then(data => {
			const response = {
				statusCode: HttpStatus.OK,
				headers: imageHeader,
				body: data.toString("base64"),
				isBase64Encoded: true
			}
		
			callback(null, response);
		})
		.catch(err => {
			logger.error("convertSizeImages error " + err);
			callback(null, json404);
		});

	} else if (path.startsWith('/rotateImages')) {
		
		let files = req.files;
		let angle = parseInt(req.angle);
		
		if(isNaN(angle) || angle <= 0 || angle >= 360 || !imgExtension.test(files)) {
			logger.error("rotateImages Illegal Argument");
			return jsonIae;
		} 

		await resizer.rotateImages(files, angle)
		.then(data => {
			const response = {
				statusCode: HttpStatus.OK,
				headers: imageHeader,
				body: data.toString("base64"),
				isBase64Encoded: true
			}
		
			callback(null, response);
		})
		.catch(err => {
			logger.error("rotateImages error " + err);
			callback(null, json404);
		});
	}

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
