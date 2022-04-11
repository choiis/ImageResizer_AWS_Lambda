
const sharp = require('sharp');
import logger from './logger';
const directory = "images/";
const resized = "resized/";
const HttpStatus = require('http-status-codes');
const AWS = require('aws-sdk');

interface s3Param {
	Bucket: undefined | string;
	Key: string
};

interface Destparams {
    Bucket: string | undefined;
    Key: string;
    Body: unknown;
    ContentType: string;
}

class Resizer {

	private readonly S3: any;
	private readonly access: undefined | string;
	private readonly secret: undefined | string;
	private readonly bucket: undefined | string;
	private readonly phone: undefined | string;
	private readonly message: undefined | string;
	private readonly snsparam: any;
	
	constructor() {
		this.access = process.env.access;
		this.secret = process.env.secret;
		this.bucket = process.env.bucket;
		this.phone = process.env.phone;
		this.message = process.env.message;
		this.S3 = new AWS.S3({accessKeyId : this.access, secretAccessKey : this.secret});

		this.snsparam = {
			Message: this.message,
			PhoneNumber: this.phone
		};
	
	}

	public async resizeImages(files: any, W: number) {
		
		return new Promise( async (resolve,reject) => {
			let params: s3Param = {
				Bucket : this.bucket,
				Key : directory + files
			}

			let originImage: any;
			try {
				logger.info("resizeImages get " + files);
				originImage = await this.S3.getObject(params).promise();
			} catch (err) {
				logger.error("resizeImages not found");
				reject(HttpStatus.NOT_FOUND);

				const SNS = new AWS.SNS({
				}).publish(this.snsparam).promise();
				SNS.then(
					function(data:any) {
						logger.info("SNS send ok");
					}).catch(
					function(err:any) {
						logger.error("SNS send fail " + err);
				});

				return;
			}

			let resizedPath: string = resized + "resizeImages_" + W + "_" + files;
			const existParam: s3Param  = {
				Bucket: this.bucket,
        	    Key: resizedPath
			};

			try {
				await this.S3.headObject(existParam).promise();
				logger.info("resizeImages " + files +  " already exist");
				const result: object = {
					path : resizedPath,
					status : HttpStatus.PERMANENT_REDIRECT
				}
				resolve(result);
			} catch (err) {
				let bufferedImage: object = await sharp(originImage.Body)
				.resize(W).toBuffer();
				logger.info("resizeImages " + files +  " success");
	
				const destparams: Destparams = {
					Bucket: this.bucket,
					Key: resizedPath,
					Body: bufferedImage,
					ContentType: "image"
				};
	
				const putResult: any = await this.S3.putObject(destparams).promise();
				logger.info("putResult " + putResult);
				const result: object = {
					path : resizedPath,
					status : HttpStatus.TEMPORARY_REDIRECT
				}
				resolve(result);
			}

		});
    }

    public async convertSizeImages(files: any, W: number, H: number) {

		return new Promise( async (resolve,reject) => {
			let params: s3Param = {
				Bucket : this.bucket,
				Key : directory + files
			}

			let originImage: any;
			try {
				logger.info("convertSizeImages get " + files);
				originImage = await this.S3.getObject(params).promise();
			} catch (err) {
				logger.error("convertSizeImages not found");
				reject(HttpStatus.NOT_FOUND);
				
				const SNS = new AWS.SNS({
				}).publish(this.snsparam).promise();
				SNS.then(
					function(data:any) {
						logger.info("SNS send ok");
					}).catch(
					function(err:any) {
						logger.error("SNS send fail " + err);
				});
				return;
			}
			
			let resizedPath: string = resized + "convertSizeImages_" + W + "_" + H + "_" + files;
			const existParam: s3Param  = {
				Bucket: this.bucket,
        	    Key: resizedPath
			};

			try {
				await this.S3.headObject(existParam).promise();
				logger.info("convertSizeImages " + files +  " already exist");
				const result: object = {
					path : resizedPath,
					status : HttpStatus.PERMANENT_REDIRECT
				}
				resolve(result);
			} catch (err) {
				let bufferedImage: object = await sharp(originImage.Body)
				.resize(W, H ,{fit:'fill'}).toBuffer();
				logger.info("convertSizeImages " + files +  " success");

				const destparams: Destparams = {
					Bucket: this.bucket,
					Key: resizedPath,
					Body: bufferedImage,
					ContentType: "image"
				};
	
				const putResult: any = await this.S3.putObject(destparams).promise();
				logger.info("putResult " + putResult);
				const result: object = {
					path : resizedPath,
					status : HttpStatus.TEMPORARY_REDIRECT
				}
				resolve(result);
			}
			
		});
    }

    public async rotateImages(files: any, angle: number) {

		return new Promise( async (resolve,reject) => {
			let params: s3Param = {
				Bucket : this.bucket,
				Key : directory + files
			}

			let originImage: any;
			try {
				logger.info("rotateImages get " + files);
				originImage = await this.S3.getObject(params).promise();
			} catch (err) {
				logger.error("rotateImages not found");
				reject(HttpStatus.NOT_FOUND);
				
				const SNS = new AWS.SNS({
				}).publish(this.snsparam).promise();
				SNS.then(
					function(data:any) {
						logger.info("SNS send ok");
					}).catch(
					function(err:any) {
						logger.error("SNS send fail " + err);
				});
				return;
			}

			let resizedPath: string = resized + "rotateImages_" + angle + "_" + files;
			const existParam: s3Param  = {
				Bucket: this.bucket,
        	    Key: resizedPath
			};

			try {
				await this.S3.headObject(existParam).promise();
				logger.info("rotateImages " + files +  " already exist");
				const result: object = {
					path : resizedPath,
					status : HttpStatus.PERMANENT_REDIRECT
				}
				resolve(result);
			} catch (err) {
				let bufferedImage: object = await sharp(originImage.Body)
				.rotate(angle).toBuffer();
				logger.info("rotateImages " + files +  " success");
				
				const destparams: Destparams = {
					Bucket: this.bucket,
					Key: resizedPath,
					Body: bufferedImage,
					ContentType: "image"
				};
	
				const putResult: any = await this.S3.putObject(destparams).promise();
				logger.info("putResult " + putResult);
				const result: object = {
					path : resizedPath,
					status : HttpStatus.TEMPORARY_REDIRECT
				}
				resolve(result);
			}
			
		});
    }

	public async fitSizeImages(files: any, W: number, H: number) {

		return new Promise( async (resolve,reject) => {
			let params: s3Param = {
				Bucket : this.bucket,
				Key : directory + files
			}

			let originImage: any;
			try {
				logger.info("fitSizeImages get " + files);
				originImage = await this.S3.getObject(params).promise();
			} catch (err) {
				logger.error("fitSizeImages not found");
				reject(HttpStatus.NOT_FOUND);

				const SNS = new AWS.SNS({
				}).publish(this.snsparam).promise();
				SNS.then(
					function(data:any) {
						logger.info("SNS send ok");
					}).catch(
					function(err:any) {
						logger.error("SNS send fail " + err);
				});
				return;
			}

			let resizedPath: string = resized + "fitSizeImages_" + W + "_" + H + "_" + files;
			const existParam: s3Param = {
				Bucket: this.bucket,
        	    Key: resizedPath
			};

			try {
				await this.S3.headObject(existParam).promise();
				logger.info("fitSizeImages " + files +  " already exist");
				const result: object = {
					path : resizedPath,
					status : HttpStatus.PERMANENT_REDIRECT
				}
				resolve(result);
			} catch (err) {
				let bufferedImage: object = await sharp(originImage.Body)
				.resize(W, H,{fit:'contain'}).toBuffer();
				logger.info("fitSizeImages " + files +  " success");

				const destparams: Destparams = {
        	    	Bucket: this.bucket,
        	    	Key: resizedPath,
        	    	Body: bufferedImage,
            		ContentType: "image"
        		};

				const putResult: any = await this.S3.putObject(destparams).promise();
				logger.info("putResult " + putResult);
				const result: object = {
					path : resizedPath,
					status : HttpStatus.TEMPORARY_REDIRECT
				}
				resolve(result);
			}
			
		});
    }
}

export default Resizer;