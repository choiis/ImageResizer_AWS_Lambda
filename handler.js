'use strict';
const HttpStatus = require('http-status-codes');

const logger = require('./logger');
const resizer = require('./resizer');

const imageHeader = { "Content-Type": "image/jpg" };

const minSize = 100;
const maxSize = 1200;
const limitRatio = 2;

const jsonIse = {
	statusCode: HttpStatus.BAD_REQUEST,
	body: JSON.stringify(
		{msg : "Illegal size Exception"}
	)
};

const jsonIee = {
	statusCode: HttpStatus.BAD_REQUEST,
	body: JSON.stringify(
		{msg : "Illegal extension Exception"}
	)
};

const imgExtension = /(.*?)\.(jpg|JPG|png|PNG|gif|GIF)$/;
const redirecturl = process.env.redirect;

module.exports.resolve = async (event ,context, callback) => {
	let req = event.pathParameters;
	let path = event.path;
	logger.info("resolve " + path);
	logger.info("source ip " + event.requestContext.identity.sourceIp);
	logger.info("call userAgent " + event.requestContext.identity.userAgent);

	if (path.startsWith('/resizeImages')) {
		
		let files = req.files;
		let W = parseInt(req.width);
		if (isNaN(W) || W < minSize || W > maxSize) {
			logger.error("resizeImages Illegal Argument size policy error");
			return jsonIse;
		} else if (!imgExtension.test(files)) {
			logger.error("resizeImages Illegal Argument extension policy error");
			return jsonIee;
		}

		await resizer.resizeImages(files, W)
		.then(data => {
			let redirect = redirecturl + data;
			const response = {
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				headers: {
					Location : redirect
				}
			}
			logger.info("redirect to " + redirect);
			callback(null, response);
		})
		.catch(err => {
			logger.error("resizeImages error " + err);
			const errorjson = {
				statusCode: err,
				body: JSON.stringify(
					{msg : HttpStatus.getStatusText(err)}
				)
			};
			logger.info("redirect to " + redirect);
			callback(null, errorjson);
		});

	} else if (path.startsWith('/convertSizeImages')) {
		
		let files = req.files;
		let W = parseInt(req.width);
		let H = parseInt(req.height);
		if (isNaN(W) || isNaN(H) || (H > (W * limitRatio)) || (W > (H * limitRatio))) {
			logger.error("convertSizeImages Illegal Argument size policy error");
			return jsonIse;
		} else if (!imgExtension.test(files)) {
			logger.error("convertSizeImages Illegal Argument extension policy error");
			return jsonIee;
		}
		
		await resizer.convertSizeImages(files, W, H)
		.then(data => {
			let redirect = redirecturl + data;
			const response = {
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				headers: {
					Location : redirect
				}
			}
			logger.info("redirect to " + redirect);
			callback(null, response);
		})
		.catch(err => {
			logger.error("convertSizeImages error " + err);
			const errorjson = {
				statusCode: err,
				body: JSON.stringify(
					{msg : HttpStatus.getStatusText(err)}
				)
			};
			callback(null, errorjson);
		});

	} else if (path.startsWith('/rotateImages')) {
		
		let files = req.files;
		let angle = parseInt(req.angle);
		
		if (isNaN(angle) || angle <= 0 || angle >= 360 || !imgExtension.test(files)) {
			logger.error("rotateImages Illegal Argument size policy error");
			return jsonIse;
		} else if (!imgExtension.test(files)) {
			logger.error("resizeImages Illegal Argument extension policy error");
			return jsonIee;
		}

		await resizer.rotateImages(files, angle)
		.then(data => {
			let redirect = redirecturl + data;
			const response = {
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				headers: {
					Location : redirect
				}
			}
			logger.info("redirect to " + redirect);
			callback(null, response);
		})
		.catch(err => {
			logger.error("rotateImages error " + err);
			const errorjson = {
				statusCode: err,
				body: JSON.stringify(
					{msg : HttpStatus.getStatusText(err)}
				)
			};
			callback(null, errorjson);
		});
	} else if (path.startsWith('/fitSizeImages')) {
		
		let files = req.files;
		let W = parseInt(req.width);
		let H = parseInt(req.height);
		if (isNaN(W) || isNaN(H) || (H > (W * limitRatio)) || (W > (H * limitRatio))) {
			logger.error("fitSizeImages Illegal Argument size policy error");
			return jsonIse;
		} else if (!imgExtension.test(files)) {
			logger.error("fitSizeImages Illegal Argument extension policy error");
			return jsonIee;
		}
		
		await resizer.fitSizeImages(files, W, H)
		.then(data => {
			let redirect = redirecturl + data;
			const response = {
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				headers: {
					Location : redirect
				}
			}
		
			callback(null, response);
		})
		.catch(err => {
			logger.error("fitSizeImages error " + err);
			const errorjson = {
				statusCode: err,
				body: JSON.stringify(
					{msg : HttpStatus.getStatusText(err)}
				)
			};
			callback(null, errorjson);
		});
	}

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
