// logger.ts
import { createLogger, transports, format } from 'winston';

interface TransformableInfo {
  level: string;
  message: string;
  [key: string]: any;
}

const logger = createLogger({
  transports: [
    new transports.Console({
      level: 'debug', // 최소 레벨
      format: format.combine(
        format.label({ label: '[consumer]' }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.colorize(),
        format.printf((info: TransformableInfo) => `${info.timestamp} - ${info.level}: ${info.label} ${info.message}`),
      )
    }),
  ]
});

export default logger;