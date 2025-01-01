const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// 中间件
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // 允许前端应用访问
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));

// 数据库连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/couple-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
})
.then(async () => {
  console.log('MongoDB 连接成功');
})
.catch(err => console.error('MongoDB 连接错误:', err));

// 路由
app.use('/api/test', require('./routes/test'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/couples', require('./routes/couples'));
app.use('/api/anniversaries', require('./routes/anniversaries'));
app.use('/api/conflicts', require('./routes/conflicts'));
app.use('/api/health', require('./routes/health'));
app.use('/api/wishes', require('./routes/wishes'));

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器错误' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
});
