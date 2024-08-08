const winston = require("winston");
const config = require("./config");

// Định dạng lỗi để bao gồm cả stack trace trong log message
const enumerateErrorFormat = winston.format(info => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),  // Thêm timestamp vào log
    enumerateErrorFormat(),  // Bao gồm stack trace trong log message
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),  // Định dạng màu cho development
    winston.format.splat(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)  // Định dạng log cuối cùng
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],  // Chỉ log lỗi vào stderr
    }),
    new winston.transports.File({
      filename: 'app.log',
      level: 'info',
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.json()  // Log dưới dạng JSON để dễ dàng phân tích
      )
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exceptions.log' })  // Log ngoại lệ vào file riêng
  ]
});

// Xử lý các ngoại lệ không bắt được
winston.exceptions.handle(
  new winston.transports.File({ filename: 'exceptions.log' })
);

// Xuất logger để sử dụng trong các phần khác của ứng dụng
module.exports = logger;
