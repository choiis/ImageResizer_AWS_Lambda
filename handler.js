'use strict';
const fs = require('fs'), sharp = require('sharp');
const HttpStatus = require('http-status-codes');

const logger = require('./logger');
const resizer = require('./resizer');

const directory = "./images/";
const resizeDir = "./resize/";

const imageHeader = { "Content-Type": "image/jpg" };
const iae = "IllegalArgumentException"

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

module.exports.resolve = async event => {
	let req = event.pathParameters;
	let path = event.path;
	
	if (path.startsWith('/resizeImages')) {
		
		let files = req.files;
		let W = parseInt(req.width);
		if(isNaN(W) || W < minSize || W > maxSize) {
			return jsonIae;
		} 

		let imagePath = directory + files;
		if(!fs.existsSync(imagePath)) {
			return json404; 
		} else {
			let data = await resizer.resizeImages(imagePath, W);
			
			const response = {
				statusCode: HttpStatus.OK,
				headers: imageHeader,
				body: data.toString("base64"),
				isBase64Encoded: true
			}
			return response;
		}
	} else if (path.startsWith('/convertSizeImages')) {
		
		let files = req.files;
		let W = parseInt(req.width);
		let H = parseInt(req.height);
		if(isNaN(W) || isNaN(H) || (H > (W * limitRatio)) || (W > (H * limitRatio)) ) {
			return jsonIae;
		} 

		let imagePath = directory + files;
		if(!fs.existsSync(imagePath)) {
			return json404; 
		} else {
			let data = await resizer.convertSizeImages(imagePath, W, H);
			
			const response = {
				statusCode: HttpStatus.OK,
				headers: imageHeader,
				body: data.toString("base64"),
				isBase64Encoded: true
			}
			return response;
		}
	} else if (path.startsWith('/rotateImages')) {
		
		let files = req.files;
		let angle = parseInt(req.angle);
		
		if(isNaN(angle) || angle <= 0 || angle >= 360) {
			return jsonIae;
		} 

		let imagePath = directory + files;
		if(!fs.existsSync(imagePath)) {
			return json404; 
		} else {
			let data = await resizer.rotateImages(imagePath, angle);
			
			const response = {
				statusCode: HttpStatus.OK,
				headers: imageHeader,
				body: data.toString("base64"),
				isBase64Encoded: true
			}
			return response;
		}
	}
	

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
