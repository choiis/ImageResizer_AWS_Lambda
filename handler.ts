import { Handler, Context, Callback } from 'aws-lambda';
import logger from './logger';
import Resizer from './resizer';
const HttpStatus = require('http-status-codes');

const minSize: number = 100;
const maxSize: number = 1200;
const limitRatio: number = 2;

interface JsonReturn {
  statusCode: number;
  body: string;
}

const jsonIse: JsonReturn = {
  statusCode: HttpStatus.BAD_REQUEST,
  body: JSON.stringify({ msg: 'Illegal size Exception' }),
};

const jsonIee: JsonReturn = {
  statusCode: HttpStatus.BAD_REQUEST,
  body: JSON.stringify({ msg: 'Illegal extension Exception' }),
};

const notSupportUrl: JsonReturn = {
  statusCode: HttpStatus.BAD_REQUEST,
  body: JSON.stringify({ msg: 'Not Support URL' }),
};

interface ReturnType {
  statusCode: number;
  headers: {
    Location: string;
  };
}

interface ErrorType {
  statusCode: number;
  body: string;
}

const imgExtension: RegExp = /(.*?)\.(jpg|JPG|png|PNG|gif|GIF)$/;
const redirecturl: string | undefined = process.env.redirect;

const resizer: Resizer = new Resizer();

const resolve: Handler = async (event: any, _context: Context, callback: Callback) => {
  const req: any = event.pathParameters || {};
  const path: string = event.path || '';
  logger.info('resolve ' + path);
  logger.info('source ip ' + (event.requestContext?.identity?.sourceIp ?? 'unknown'));
  logger.info('call userAgent ' + (event.requestContext?.identity?.userAgent ?? 'unknown'));

  if (path.startsWith('/resizeImages')) {
    const files: string = req.files;
    const W: number = parseInt(req.width, 10);

    if (isNaN(W) || W < minSize || W > maxSize) {
      logger.error('resizeImages Illegal Argument size policy error');
      return jsonIse;
    } else if (!imgExtension.test(files)) {
      logger.error('resizeImages Illegal Argument extension policy error');
      return jsonIee;
    }

    await resizer
      .resizeImages(files, W)
      .then((data: any) => {
        const redirect: string = (redirecturl ?? '') + data.path;
        logger.info('http code ' + data.status);
        const response: ReturnType = {
          statusCode: data.status,
          headers: {
            Location: redirect,
          },
        };
        logger.info('redirect to ' + redirect);
        callback(null, response);
      })
      .catch((err: any) => {
        logger.error('resizeImages error ' + err);
        const errorjson: ErrorType = {
          statusCode: err,
          body: JSON.stringify({ msg: HttpStatus.getStatusText(err) }),
        };
        callback(null, errorjson);
      });
  } else if (path.startsWith('/convertSizeImages')) {
    const files: string = req.files;
    const W: number = parseInt(req.width, 10);
    const H: number = parseInt(req.height, 10);

    if (isNaN(W) || isNaN(H) || H > W * limitRatio || W > H * limitRatio) {
      logger.error('convertSizeImages Illegal Argument size policy error');
      return jsonIse;
    } else if (!imgExtension.test(files)) {
      logger.error('convertSizeImages Illegal Argument extension policy error');
      return jsonIee;
    }

    await resizer
      .convertSizeImages(files, W, H)
      .then((data: any) => {
        const redirect: string = (redirecturl ?? '') + data.path;
        logger.info('http code ' + data.status);
        const response: ReturnType = {
          statusCode: data.status,
          headers: {
            Location: redirect,
          },
        };
        logger.info('redirect to ' + redirect);
        callback(null, response);
      })
      .catch((err: any) => {
        logger.error('convertSizeImages error ' + err);
        const errorjson: ErrorType = {
          statusCode: err,
          body: JSON.stringify({ msg: HttpStatus.getStatusText(err) }),
        };
        callback(null, errorjson);
      });
  } else if (path.startsWith('/rotateImages')) {
    const files: string = req.files;
    const angle: number = parseInt(req.angle, 10);

    if (isNaN(angle) || angle <= 0 || angle >= 360 || !imgExtension.test(files)) {
      logger.error('rotateImages Illegal Argument size/ext policy error');
      return jsonIse;
    } else if (!imgExtension.test(files)) {
      logger.error('rotateImages Illegal Argument extension policy error');
      return jsonIee;
    }

    await resizer
      .rotateImages(files, angle)
      .then((data: any) => {
        const redirect: string = (redirecturl ?? '') + data.path;
        logger.info('http code ' + data.status);
        const response: ReturnType = {
          statusCode: data.status,
          headers: {
            Location: redirect,
          },
        };
        logger.info('redirect to ' + redirect);
        callback(null, response);
      })
      .catch((err: any) => {
        logger.error('rotateImages error ' + err);
        const errorjson: ErrorType = {
          statusCode: err,
          body: JSON.stringify({ msg: HttpStatus.getStatusText(err) }),
        };
        callback(null, errorjson);
      });
  } else if (path.startsWith('/fitSizeImages')) {
    const files: string = req.files;
    const W: number = parseInt(req.width, 10);
    const H: number = parseInt(req.height, 10);

    if (isNaN(W) || isNaN(H) || H > W * limitRatio || W > H * limitRatio) {
      logger.error('fitSizeImages Illegal Argument size policy error');
      return jsonIse;
    } else if (!imgExtension.test(files)) {
      logger.error('fitSizeImages Illegal Argument extension policy error');
      return jsonIee;
    }

    await resizer
      .fitSizeImages(files, W, H)
      .then((data: any) => {
        const redirect: string = (redirecturl ?? '') + data.path;
        logger.info('http code ' + data.status);
        const response: ReturnType = {
          statusCode: data.status,
          headers: {
            Location: redirect,
          },
        };
        logger.info('redirect to ' + redirect);
        callback(null, response);
      })
      .catch((err: any) => {
        logger.error('fitSizeImages error ' + err);
        const errorjson: ErrorType = {
          statusCode: err,
          body: JSON.stringify({ msg: HttpStatus.getStatusText(err) }),
        };
        callback(null, errorjson);
      });
  }

  // 위 if/else에 안 걸리면
  return notSupportUrl;
};

export { resolve };
