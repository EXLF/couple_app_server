const express = require('express');
const router = express.Router();
const Anniversary = require('../models/anniversary');
const auth = require('../middleware/auth');

// 获取情侣的所有纪念日
router.get('/', auth, async (req, res) => {
  try {
    const coupleId = req.user.coupleId || req.user.tempCoupleId;
    const anniversaries = await Anniversary.find({ coupleId })
      .sort({ date: -1 });
    res.json(anniversaries);
  } catch (err) {
    console.error('获取纪念日列表失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 添加新纪念日
router.post('/', auth, async (req, res) => {
  try {
    const { title, date, description } = req.body;
    const coupleId = req.user.coupleId || req.user.tempCoupleId;
    
    const anniversary = new Anniversary({
      coupleId,
      title,
      date,
      description
    });

    await anniversary.save();
    res.status(201).json(anniversary);
  } catch (err) {
    console.error('添加纪念日失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除纪念日
router.delete('/:id', auth, async (req, res) => {
  try {
    const anniversary = await Anniversary.findOneAndDelete({
      _id: req.params.id,
      coupleId: req.user.coupleId
    });

    if (!anniversary) {
      return res.status(404).json({ message: '纪念日不存在' });
    }

    res.json({ message: '纪念日已删除' });
  } catch (err) {
    console.error('删除纪念日失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 修改纪念日
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, date, description } = req.body;
    const anniversary = await Anniversary.findOneAndUpdate(
      {
        _id: req.params.id,
        coupleId: req.user.coupleId
      },
      {
        title,
        date,
        description
      },
      { new: true }
    );

    if (!anniversary) {
      return res.status(404).json({ message: '纪念日不存在' });
    }

    res.json(anniversary);
  } catch (err) {
    console.error('修改纪念日失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取单个纪念日详情
router.get('/:id', auth, async (req, res) => {
  try {
    const coupleId = req.user.coupleId || req.user.tempCoupleId;
    const anniversary = await Anniversary.findOne({
      _id: req.params.id,
      coupleId
    });

    if (!anniversary) {
      return res.status(404).json({ message: '纪念日不存在' });
    }

    res.json(anniversary);
  } catch (err) {
    console.error('获取纪念日详情失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
