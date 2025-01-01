const express = require('express');
const router = express.Router();
const Wish = require('../models/wish');
const auth = require('../middleware/auth');

// 获取情侣的所有愿望
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { coupleId: req.user.coupleId };

    // 如果提供了状态筛选
    if (status) {
      query.status = status;
    }

    const wishes = await Wish.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username'); // 关联用户信息

    res.json(wishes);
  } catch (err) {
    console.error('获取愿望列表失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 添加新愿望
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, targetDate } = req.body;
    
    const wish = new Wish({
      coupleId: req.user.coupleId,
      createdBy: req.user._id,
      title,
      description,
      targetDate: targetDate ? new Date(targetDate) : null,
      status: '待实现'
    });

    await wish.save();
    
    // 返回带有创建者信息的愿望
    const populatedWish = await Wish.findById(wish._id)
      .populate('createdBy', 'username');
      
    res.status(201).json(populatedWish);
  } catch (err) {
    console.error('添加愿望失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除愿望
router.delete('/:id', auth, async (req, res) => {
  try {
    const wish = await Wish.findOneAndDelete({
      _id: req.params.id,
      coupleId: req.user.coupleId
    });

    if (!wish) {
      return res.status(404).json({ message: '愿望不存在' });
    }

    res.json({ message: '愿望已删除' });
  } catch (err) {
    console.error('删除愿望失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 修改愿望
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, targetDate, status } = req.body;
    const wish = await Wish.findOneAndUpdate(
      {
        _id: req.params.id,
        coupleId: req.user.coupleId
      },
      {
        title,
        description,
        targetDate,
        status
      },
      { new: true }
    ).populate('createdBy', '_id username');

    if (!wish) {
      return res.status(404).json({ message: '愿望不存在' });
    }

    res.json(wish);
  } catch (err) {
    console.error('修改愿望失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取愿望统计
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Wish.aggregate([
      { $match: { coupleId: req.user.coupleId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // 统计每个人创建的愿望数量
    const userStats = await Wish.aggregate([
      { $match: { coupleId: req.user.coupleId } },
      {
        $group: {
          _id: '$createdBy',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      statusStats: stats,
      userStats: userStats
    });
  } catch (err) {
    console.error('获取愿望统计失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
