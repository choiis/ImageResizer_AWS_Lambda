import { Handler, Context, Callback } from "aws-lambda";
import logger from './logger';
import Resizer from './resizer';
const HttpStatus = require('http-status-codes');

const minSize: number = 100;
const maxSize: number = 1200;
const limitRatio: number = 2;

interface JsonReturn {
	statusCode: any;
	body: any
};

const jsonIse: JsonReturn = {
	statusCode: HttpStatus.BAD_REQUEST,
	body: JSON.stringify(
		{msg : "Illegal size Exception"}
	)
};

const jsonIee: JsonReturn = {
	statusCode: HttpStatus.BAD_REQUEST,
	body: JSON.stringify(
		{msg : "Illegal extension Exception"}
	)
};

const imgExtension = /(.*?)\.(jpg|JPG|png|PNG|gif|GIF)$/;
const redirecturl = process.env.redirect;

const resizer: Resizer = new Resizer();

const resolve: Handler = async (event: any, _context: Context, callback: Callback) => {

  let req = event.pathParameters;
  let path = event.path;
  logger.info("resolve " + path);
  logger.info("source ip " + event.requestContext.identity.sourceIp);
  logger.info("call userAgent " + event.requestContext.identity.userAgent);

  if (path.startsWith('/resizeImages')) {
		
		let files: string = req.files;
		let W: number = parseInt(req.width);
		if (isNaN(W) || W < minSize || W > maxSize) {
			logger.error("resizeImages Illegal Argument size policy error");
			return jsonIse;
		} else if (!imgExtension.test(files)) {
			logger.error("resizeImages Illegal Argument extension policy error");
			return jsonIee;
		}

		await resizer.resizeImages(files, W)
		.then((data: any) => {
			let redirect = redirecturl + data.path;
			logger.info("http code " + data.status);
			const response = {
				statusCode: data.status,
				headers: {
					Location : redirect
				}
			}
			logger.info("redirect to " + redirect);
			callback(null, response);
		})
		.catch((err: any) => {
			logger.error("resizeImages error " + err);
			const errorjson = {
				statusCode: err,
				body: JSON.stringify(
					{msg : HttpStatus.getStatusText(err)}
				)
			};
			callback(null, errorjson);
		});

	} else if (path.startsWith('/convertSizeImages')) {
		
		let files: string = req.files;
		let W: number = parseInt(req.width);
		let H: number = parseInt(req.height);
		if (isNaN(W) || isNaN(H) || (H > (W * limitRatio)) || (W > (H * limitRatio))) {
			logger.error("convertSizeImages Illegal Argument size policy error");
			return jsonIse;
		} else if (!imgExtension.test(files)) {
			logger.error("convertSizeImages Illegal Argument extension policy error");
			return jsonIee;
		}
		
		await resizer.convertSizeImages(files, W, H)
		.then((data: any) => {
			let redirect = redirecturl + data.path;
			logger.info("http code " + data.status);
			const response = {
				statusCode: data.status,
				headers: {
					Location : redirect
				}
			}
			logger.info("redirect to " + redirect);
			callback(null, response);
		})
		.catch((err: any) => {
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
		
		let files: string = req.files;
		let angle: number = parseInt(req.angle);
		
		if (isNaN(angle) || angle <= 0 || angle >= 360 || !imgExtension.test(files)) {
			logger.error("rotateImages Illegal Argument size policy error");
			return jsonIse;
		} else if (!imgExtension.test(files)) {
			logger.error("resizeImages Illegal Argument extension policy error");
			return jsonIee;
		}

		await resizer.rotateImages(files, angle)
		.then((data: any) => {
			let redirect = redirecturl + data.path;
			logger.info("http code " + data.status);
			const response = {
				statusCode: data.status,
				headers: {
					Location : redirect
				}
			}
			logger.info("redirect to " + redirect);
			callback(null, response);
		})
		.catch((err: any) => {
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
		
		let files: string = req.files;
		let W: number = parseInt(req.width);
		let H: number = parseInt(req.height);
		if (isNaN(W) || isNaN(H) || (H > (W * limitRatio)) || (W > (H * limitRatio))) {
			logger.error("fitSizeImages Illegal Argument size policy error");
			return jsonIse;
		} else if (!imgExtension.test(files)) {
			logger.error("fitSizeImages Illegal Argument extension policy error");
			return jsonIee;
		}
		
		await resizer.fitSizeImages(files, W, H)
		.then((data: any) => {
			let redirect = redirecturl + data.path;
			logger.info("http code " + data.status);
			const response = {
				statusCode: data.status,
				headers: {
					Location : redirect
				}
			}
		
			callback(null, response);
		})
		.catch((err :any) => {
			logger.error("fitSizeImages error " + err);
			const errorjson = {
				statusCode: err,
				body: JSON.stringify(
					{msg : HttpStatus.getStatusText(err)}
				)
			};
			callback(null, errorjson);
		});
	} else {
		callback(null, jsonIee);
	}

};

export { resolve };