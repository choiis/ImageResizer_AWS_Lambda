import sharp from 'sharp';
import logger from './logger';
import PhoneNumber from 'awesome-phonenumber';

import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { Readable } from 'stream';
const HttpStatus = require('http-status-codes');

import AWSXRay from 'aws-xray-sdk-core';

const directory = 'images/';
const resized = 'resized/';

interface S3Param {
  Bucket: string | undefined;
  Key: string;
}

interface DestParams {
  Bucket: string | undefined;
  Key: string;
  Body: Buffer;
  ContentType: string;
}

interface SnsParam {
  Message?: string;
  PhoneNumber: string;
}

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

class Resizer {
  private readonly s3: S3Client;
  private readonly sns: SNSClient;
  private readonly access: string | undefined;
  private readonly secret: string | undefined;
  private readonly bucket: string | undefined;
  private readonly phone: string;
  private readonly message: string | undefined;
  private readonly snsparam: SnsParam;

   constructor() {
    this.access = process.env.access;
    this.secret = process.env.secret;
    this.bucket = process.env.bucket;
    this.phone = process.env.phone!;
    this.message = process.env.message;

    logger.info('s3 access ' + this.access);
    logger.info('s3 secret ' + this.secret);
    logger.info('s3 bucket ' + this.bucket);
    logger.info('s3 phone ' + this.phone);

    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'ap-northeast-2';

    this.s3 = AWSXRay.captureAWSv3Client(
      new S3Client({
        region,
        credentials:
          this.access && this.secret
            ? {
                accessKeyId: this.access,
                secretAccessKey: this.secret,
              }
            : undefined,
      }),
    );

    this.sns = AWSXRay.captureAWSv3Client(
      new SNSClient({
        region,
      }),
    );

    const phonenumber = new PhoneNumber(this.phone, 'KR');
    this.snsparam = {
      Message: this.message,
      PhoneNumber: phonenumber.getNumber('e164')!,
    };
  }

  public async resizeImages(files: string, W: number) {
    return new Promise(async (resolve, reject) => {
      const params: S3Param = {
        Bucket: this.bucket,
        Key: directory + files,
      };

      let originImageBody: Buffer;
      try {
        logger.info('resizeImages get ' + files);
        const originImage = await this.s3.send(new GetObjectCommand(params));
        if (!originImage.Body) {
          throw new Error('S3 object body is empty');
        }
        originImageBody = await streamToBuffer(originImage.Body as Readable);
      } catch (err) {
        logger.error('resizeImages not found');
        reject(HttpStatus.NOT_FOUND);

        this.sendSns();
        return;
      }

      const resizedPath: string = resized + 'resizeImages_' + W + '_' + files;
      const existParam: S3Param = {
        Bucket: this.bucket,
        Key: resizedPath,
      };

      try {
        await this.s3.send(new HeadObjectCommand(existParam));
        logger.info('resizeImages ' + files + ' already exist');
        const result = {
          path: resizedPath,
          status: HttpStatus.PERMANENT_REDIRECT,
        };
        resolve(result);
      } catch (_err) {
        const bufferedImage = await sharp(originImageBody).resize(W).toBuffer();
        logger.info('resizeImages ' + files + ' success');

        const destparams: DestParams = {
          Bucket: this.bucket,
          Key: resizedPath,
          Body: bufferedImage,
          ContentType: 'image',
        };

        const putResult = await this.s3.send(new PutObjectCommand(destparams));
        logger.info('putResult ' + JSON.stringify(putResult));
        const result = {
          path: resizedPath,
          status: HttpStatus.TEMPORARY_REDIRECT,
        };
        resolve(result);
      }
    });
  }

  public async convertSizeImages(files: string, W: number, H: number) {
    return new Promise(async (resolve, reject) => {
      const params: S3Param = {
        Bucket: this.bucket,
        Key: directory + files,
      };

      let originImageBody: Buffer;
      try {
        logger.info('convertSizeImages get ' + files);
        const originImage = await this.s3.send(new GetObjectCommand(params));
        if (!originImage.Body) {
          throw new Error('S3 object body is empty');
        }
        originImageBody = await streamToBuffer(originImage.Body as Readable);
      } catch (err) {
        logger.error('convertSizeImages not found');
        reject(HttpStatus.NOT_FOUND);

        this.sendSns();
        return;
      }

      const resizedPath: string = resized + 'convertSizeImages_' + W + '_' + H + '_' + files;
      const existParam: S3Param = {
        Bucket: this.bucket,
        Key: resizedPath,
      };

      try {
        await this.s3.send(new HeadObjectCommand(existParam));
        logger.info('convertSizeImages ' + files + ' already exist');
        const result = {
          path: resizedPath,
          status: HttpStatus.PERMANENT_REDIRECT,
        };
        resolve(result);
      } catch (_err) {
        const bufferedImage = await sharp(originImageBody)
          .resize(W, H, { fit: 'fill' })
          .toBuffer();
        logger.info('convertSizeImages ' + files + ' success');

        const destparams: DestParams = {
          Bucket: this.bucket,
          Key: resizedPath,
          Body: bufferedImage,
          ContentType: 'image',
        };

        const putResult = await this.s3.send(new PutObjectCommand(destparams));
        logger.info('putResult ' + JSON.stringify(putResult));
        const result = {
          path: resizedPath,
          status: HttpStatus.TEMPORARY_REDIRECT,
        };
        resolve(result);
      }
    });
  }

  public async rotateImages(files: string, angle: number) {
    return new Promise(async (resolve, reject) => {
      const params: S3Param = {
        Bucket: this.bucket,
        Key: directory + files,
      };

      let originImageBody: Buffer;
      try {
        logger.info('rotateImages get ' + files);
        const originImage = await this.s3.send(new GetObjectCommand(params));
        if (!originImage.Body) {
          throw new Error('S3 object body is empty');
        }
        originImageBody = await streamToBuffer(originImage.Body as Readable);
      } catch (err) {
        logger.error('rotateImages not found');
        reject(HttpStatus.NOT_FOUND);

        this.sendSns();
        return;
      }

      const resizedPath: string = resized + 'rotateImages_' + angle + '_' + files;
      const existParam: S3Param = {
        Bucket: this.bucket,
        Key: resizedPath,
      };

      try {
        await this.s3.send(new HeadObjectCommand(existParam));
        logger.info('rotateImages ' + files + ' already exist');
        const result = {
          path: resizedPath,
          status: HttpStatus.PERMANENT_REDIRECT,
        };
        resolve(result);
      } catch (_err) {
        const bufferedImage = await sharp(originImageBody).rotate(angle).toBuffer();
        logger.info('rotateImages ' + files + ' success');

        const destparams: DestParams = {
          Bucket: this.bucket,
          Key: resizedPath,
          Body: bufferedImage,
          ContentType: 'image',
        };

        const putResult = await this.s3.send(new PutObjectCommand(destparams));
        logger.info('putResult ' + JSON.stringify(putResult));
        const result = {
          path: resizedPath,
          status: HttpStatus.TEMPORARY_REDIRECT,
        };
        resolve(result);
      }
    });
  }

  public async fitSizeImages(files: string, W: number, H: number) {
    return new Promise(async (resolve, reject) => {
      const params: S3Param = {
        Bucket: this.bucket,
        Key: directory + files,
      };

      let originImageBody: Buffer;
      try {
        logger.info('fitSizeImages get ' + files);
        const originImage = await this.s3.send(new GetObjectCommand(params));
        if (!originImage.Body) {
          throw new Error('S3 object body is empty');
        }
        originImageBody = await streamToBuffer(originImage.Body as Readable);
      } catch (err) {
        logger.error('fitSizeImages not found');
        reject(HttpStatus.NOT_FOUND);

        this.sendSns();
        return;
      }

      const resizedPath: string = resized + 'fitSizeImages_' + W + '_' + H + '_' + files;
      const existParam: S3Param = {
        Bucket: this.bucket,
        Key: resizedPath,
      };

      try {
        await this.s3.send(new HeadObjectCommand(existParam));
        logger.info('fitSizeImages ' + files + ' already exist');
        const result = {
          path: resizedPath,
          status: HttpStatus.PERMANENT_REDIRECT,
        };
        resolve(result);
      } catch (_err) {
        const bufferedImage = await sharp(originImageBody)
          .resize(W, H, { fit: 'contain' })
          .toBuffer();
        logger.info('fitSizeImages ' + files + ' success');

        const destparams: DestParams = {
          Bucket: this.bucket,
          Key: resizedPath,
          Body: bufferedImage,
          ContentType: 'image',
        };

        const putResult = await this.s3.send(new PutObjectCommand(destparams));
        logger.info('putResult ' + JSON.stringify(putResult));
        const result = {
          path: resizedPath,
          status: HttpStatus.TEMPORARY_REDIRECT,
        };
        resolve(result);
      }
    });
  }

  private async sendSns() {
    try {
      const result = await this.sns.send(new PublishCommand(this.snsparam));
      logger.info('SNS send success ' + JSON.stringify(result));
    } catch (err) {
      logger.error('SNS send fail ' + err);
    }
  }
}

export default Resizer;
