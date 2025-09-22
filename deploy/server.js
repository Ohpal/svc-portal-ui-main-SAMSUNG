const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');
const winston = require('winston');
const events = require('events');
require('winston-daily-rotate-file');

const EventEmitter = events.EventEmitter;
EventEmitter.setMaxListeners(20);

// 프로메테우스 데이터 expoter 설정
// const uptime = require('./metrics/uptime');
// const client = require('prom-client');
// const collectDefaultMetrics = client.collectDefaultMetrics;
// const Registry = client.Registry;
// const register = new Registry();
// collectDefaultMetrics({ register });
// register.registerCollector(uptime(register));

const app = express();
const date = new Date();

// const clientIp = Object.values(require('os').networkInterfaces())
//   .flat()
//   .filter((item) => !item.internal && item.family === 'IPv4')
//   .find(Boolean).address

const distDir = path.join(__dirname, '/dist');
const webConfig = require('./config.json');
// console.log('clientIP = ', clientIp)
console.log('distDir = ', distDir);
console.log('configPath =', process.env.VITE_CONFIG_PATH);
console.log('logPath =', process.env.VITE_LOG_PATH);
console.log('env.mode = ', process.env.NODE_ENV);
console.log('apiTarget = ', process.env.VITE_API_TARGET);
console.log('https port =', process.env.VITE_PORT_HTTPS);
console.log('http port =', process.env.VITE_PORT_HTTP);
console.log('web config = ', webConfig);
// vue-cli (npm run serve)로 실행시킨 경우 MFE가 정상적으로 동작하지 않는다.
// 해당 웹서버를 통해서 동작하게한다.

/* winston logger */
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const format = winston.format.combine(
  winston.format.timestamp({ format: ' YYYY-MM-DD HH:mm:ss ||' }),
  winston.format.printf((info) => `${info.timestamp} [ ${info.level} ] ${info.message}`)
);

const logger = winston.createLogger({
  format,
  level: level(),
  transports: [
    new winston.transports.DailyRotateFile({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: process.env.VITE_LOG_PATH,
      filename: 'svc-portal-ui-%DATE%.log',
      zippedArchive: true,
      handleExceptions: true
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: process.env.VITE_LOG_PATH,
      filename: 'svc-portal-ui-%DATE%.error.log',
      zippedArchive: true
    }),
    new winston.transports.Console({
      handleExceptions: true
    })
  ]
});
/* winston logger */

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  //https 설정
  const https = require('https');
  const options = {
    key: fs.readFileSync(`${process.env.VITE_CONFIG_PATH}/ssl/server.key`).toString(),
    cert: fs.readFileSync(`${process.env.VITE_CONFIG_PATH}/ssl/server.crt`).toString()
  };

  const httpsServer = https.createServer(options, app);
  const httpsPort = process.env.VITE_PORT_HTTPS;
  httpsServer.listen(httpsPort, () => {
    console.log(`${date.toLocaleString()} app listening at ${httpsPort}`);
  });
}

/** proxy event function */
const onProxyReq = function (proxyReq, req, res) {
  const logString = `||REQ|HTTP|${req.method}|${proxyReq.host}||||||${req.url}|`;
  logger.info(logString);
};

const onProxyRes = function (proxyRes, req, res) {
  let logString = `||RES|HTTP|${res.req.method}|${proxyRes.req.host}|${proxyRes.statusCode}|||||${res.req.url}|`;
  logger.info(logString);
};

const onError = function (err, req, res, target) {
  logger.error(`${target.host}${req.url} : ${err.code}`);
  if (err.code === 'ECONNREFUSED') {
    res.writeHead(500, {
      'Content-Type': 'application/json;'
    });
    res.end('Something went wrong. And we are reporting a custom error message.');
  }
};

/** proxy 설정 **/
app.use(
  createProxyMiddleware('/krakend', {
    target: `${process.env.VITE_API_TARGET}`,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/krakend': ''
    },
    onProxyReq: onProxyReq,
    onProxyRes: onProxyRes,
    onError: onError
  })
);
app.use(
  createProxyMiddleware(['/timezone', '/countries'], {
    target: `${process.env.VITE_STATIC_INFO_API_TARGET}`,
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: onProxyReq,
    onProxyRes: onProxyRes,
    onError: onError
  })
);
app.use(
  createProxyMiddleware('/geotarget', {
    target: `${process.env.VITE_GEO_TARGET}`,
    pathRewrite: { '^/geotarget': '' },
    changeOrigin: true,
    onError: onError
  })
);
app.use(
  createProxyMiddleware('/api/v1/ws', {
    target: `${process.env.VITE_WS_TARGET}`,
    changeOrigin: true,
    ws: true,
    logLevel: 'debug',
    onProxyReq: onProxyReq,
    onProxyRes: onProxyRes,
    onError: onError
  })
);
// 서비스에서 사용하는 이미지 파일 Path
app.use(
  createProxyMiddleware('/VITE_SETTING_TARGET', {
    target: `${process.env.VITE_SETTING_TARGET}`,
    pathRewrite: { '/VITE_SETTING_TARGET': '' },
    changeOrigin: true,
    onError: onError
  }),
  // createProxyMiddleware('/VITE_FLEET_TARGET', {
  //   target: `${process.env.VITE_FLEET_TARGET}`,
  //   pathRewrite: { '/VITE_FLEET_TARGET': '' },
  //   changeOrigin: true,
  //   onError: onError
  // }),
  createProxyMiddleware('/rims-api', {
    target: `${process.env.rims_api}`,
    changeOrigin: true,
    onError: onError
  }),
  createProxyMiddleware('/api', {
    target: `${process.env.api}`,
    changeOrigin: true,
    onError: onError
  }),
  createProxyMiddleware('/kdt-api', {
    target: `${process.env.kdt_api}`,
    changeOrigin: true,
    onError: onError
  }),
  createProxyMiddleware('/unity', {
    target: `${process.env.unity}`,
    changeOrigin: true,
    onError: onError
  }),
  createProxyMiddleware('/mrc-api', {
    target: `${process.env.mrc_api}`,
    changeOrigin: true,
    onError: onError
  }),
  createProxyMiddleware('/mrc-api-amsvdr', {
    target: `${process.env.mrc_api_amsvdr}`,
    changeOrigin: true,
    onError: onError
  }),
  createProxyMiddleware('/mrc-api-shipinfo', {
    target: `${process.env.mrc_api_shipinfo}`,
    changeOrigin: true,
    onError: onError
  }),
  createProxyMiddleware('/dbdata', {
    target: `${process.env.dbdata}`,
    changeOrigin: true,
    onError: onError
  }),
  createProxyMiddleware('/analysis-api', {
    target: `${process.env.analysis_api}`,
    changeOrigin: true,
    onError: onError
  }),
  createProxyMiddleware('/synth-data', {
    target: `${process.env.synth_data}`,
    changeOrigin: true,
    onError: onError
  })
);

// 정적파일 서빙
app.use(express.static(distDir));

//유저 정보 반환
app.get('/web-config', (req, res) => {
  res.json(webConfig);
});

// Catch-All 라우팅
app.get('*', (req, res) => {
  res.sendFile(distDir + '/index.html', function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const port = process.env.VITE_PORT_HTTP;

app.listen(port, () => {
  console.log(`${date.toLocaleString()} app listening at ${port}`);
});

// app.get(process.env.VITE_CLIENT_PATH + '/actuator/prometheus', async (req, res) => {
//   try {
//     res.set('Content-Type', register.contentType);
//     res.end(await register.metrics());
//   } catch (ex) {
//     res.status(500).end(ex);
//   }
// });
