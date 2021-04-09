
const sharp = require('sharp');
import logger from './logger';
const directory = "images/";
const resized = "resized/";
const HttpStatus = require('http-status-codes');
const AWS = require('aws-sdk');
const access = process.env.access;
const secret = process.env.secret;
const bucket = process.env.bucket;

const S3 = new AWS.S3({accessKeyId : access, secretAccessKey : secret});

class Resizer {

	constructor() {

	}

	public async resizeImages(files: any, W: number) {
		
		return new Promise( async (resolve,reject) => {
			let params = {
				Bucket : bucket,
				Key : directory + files
			}

			let originImage;
			try {
				logger.info("resizeImages get " + files);
				originImage = await S3.getObject(params).promise();
			} catch (err) {
				logger.error("resizeImages not found");
				reject(HttpStatus.NOT_FOUND);
				return;
			}

			let resizedPath = resized + "resizeImages_" + W + "_" + files;
			const existParam = {
				Bucket: bucket,
        	    Key: resizedPath
			};

			try {
				await S3.headObject(existParam).promise();
				logger.info("resizeImages " + files +  " already exist");
				const result = {
					path : resizedPath,
					status : HttpStatus.PERMANENT_REDIRECT
				}
				resolve(result);
			} catch (err) {
				let bufferedImage = await sharp(originImage.Body)
				.resize(W).toBuffer();
				logger.info("resizeImages " + files +  " success");
	
				const destparams = {
					Bucket: bucket,
					Key: resizedPath,
					Body: bufferedImage,
					ContentType: "image"
				};
	
				const putResult = await S3.putObject(destparams).promise();
				logger.info("putResult " + putResult);
				const result = {
					path : resizedPath,
					status : HttpStatus.TEMPORARY_REDIRECT
				}
				resolve(result);
			}

		});
    }

    public async convertSizeImages(files: any, W: number, H: number) {

		return new Promise( async (resolve,reject) => {
			let params = {
				Bucket : bucket,
				Key : directory + files
			}

			let originImage;
			try {
				logger.info("convertSizeImages get " + files);
				originImage = await S3.getObject(params).promise();
			} catch (err) {
				logger.error("convertSizeImages not found");
				reject(HttpStatus.NOT_FOUND);
				return;
			}
			
			let resizedPath = resized + "convertSizeImages_" + W + "_" + H + "_" + files;
			const existParam = {
				Bucket: bucket,
        	    Key: resizedPath
			};

			try {
				await S3.headObject(existParam).promise();
				logger.info("convertSizeImages " + files +  " already exist");
				const result = {
					path : resizedPath,
					status : HttpStatus.PERMANENT_REDIRECT
				}
				resolve(result);
			} catch (err) {
				let bufferedImage = await sharp(originImage.Body)
				.resize(W, H ,{fit:'fill'}).toBuffer();
				logger.info("convertSizeImages " + files +  " success");

				const destparams = {
					Bucket: bucket,
					Key: resizedPath,
					Body: bufferedImage,
					ContentType: "image"
				};
	
				const putResult = await S3.putObject(destparams).promise();
				logger.info("putResult " + putResult);
				const result = {
					path : resizedPath,
					status : HttpStatus.TEMPORARY_REDIRECT
				}
				resolve(result);
			}
			
		});
    }

    public async rotateImages(files: any, angle: number) {

		return new Promise( async (resolve,reject) => {
			let params = {
				Bucket : bucket,
				Key : directory + files
			}

			let originImage;
			try {
				logger.info("rotateImages get " + files);
				originImage = await S3.getObject(params).promise();
			} catch (err) {
				logger.error("rotateImages not found");
				reject(HttpStatus.NOT_FOUND);
				return;
			}

			let resizedPath = resized + "rotateImages_" + angle + "_" + files;
			const existParam = {
				Bucket: bucket,
        	    Key: resizedPath
			};

			try {
				await S3.headObject(existParam).promise();
				logger.info("rotateImages " + files +  " already exist");
				const result = {
					path : resizedPath,
					status : HttpStatus.PERMANENT_REDIRECT
				}
				resolve(result);
			} catch (err) {
				let bufferedImage = await sharp(originImage.Body)
				.rotate(angle).toBuffer();
				logger.info("rotateImages " + files +  " success");
				const destparams = {
					Bucket: bucket,
					Key: resizedPath,
					Body: bufferedImage,
					ContentType: "image"
				};
	
				const putResult = await S3.putObject(destparams).promise();
				logger.info("putResult " + putResult);
				const result = {
					path : resizedPath,
					status : HttpStatus.TEMPORARY_REDIRECT
				}
				resolve(result);
			}
			
		});
    }

	public async fitSizeImages(files: any, W: number, H: number) {

		return new Promise( async (resolve,reject) => {
			let params = {
				Bucket : bucket,
				Key : directory + files
			}

			let originImage;
			try {
				logger.info("fitSizeImages get " + files);
				originImage = await S3.getObject(params).promise();
			} catch (err) {
				logger.error("fitSizeImages not found");
				reject(HttpStatus.NOT_FOUND);
				return;
			}

			let resizedPath = resized + "fitSizeImages_" + W + "_" + H + "_" + files;
			const existParam = {
				Bucket: bucket,
        	    Key: resizedPath
			};

			try {
				await S3.headObject(existParam).promise();
				logger.info("fitSizeImages " + files +  " already exist");
				const result = {
					path : resizedPath,
					status : HttpStatus.PERMANENT_REDIRECT
				}
				resolve(result);
			} catch (err) {
				let bufferedImage = await sharp(originImage.Body)
				.resize(W, H,{fit:'contain'}).toBuffer();
				logger.info("fitSizeImages " + files +  " success");

				const destparams = {
        	    	Bucket: bucket,
        	    	Key: resizedPath,
        	    	Body: bufferedImage,
            		ContentType: "image"
        		};

				const putResult = await S3.putObject(destparams).promise();
				logger.info("putResult " + putResult);
				const result = {
					path : resizedPath,
					status : HttpStatus.TEMPORARY_REDIRECT
				}
				resolve(result);
			}
			
		});
    }
}

export default Resizer;