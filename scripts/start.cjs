// Keep npm start in production mode on Windows, Linux and macOS.
process.env.NODE_ENV = 'production';
require('../dist/server.cjs');
