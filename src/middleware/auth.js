const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 查找用户
    const user = await User.findOne({ _id: decoded.userId });
    
    if (!user) {
      throw new Error();
    }

    // 将用户信息添加到请求对象
    req.token = token;
    req.user = user;
    req.user.coupleId = user.coupleId;  // 使用用户的 coupleId
    
    next();
  } catch (err) {
    res.status(401).json({ message: '请先登录' });
  }
};

module.exports = auth;
