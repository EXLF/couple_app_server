const express = require('express');
const router = express.Router();
const Couple = require('../models/couple');
const auth = require('../middleware/auth');

// 发送配对邀请
router.post('/invite', auth, async (req, res) => {
  try {
    const { partnerUsername } = req.body;

    // 检查用户是否已经有配对
    const existingCouple = await Couple.findOne({
      $or: [
        { user1: req.user._id },
        { user2: req.user._id }
      ],
      status: 'accepted'
    });

    if (existingCouple) {
      return res.status(400).json({ message: '您已经有配对关系了' });
    }

    // 创建新的配对关系
    const couple = new Couple({
      user1: req.user._id,
      user2: partnerUsername,
      status: 'pending'
    });

    await couple.save();
    res.status(201).json(couple);
  } catch (err) {
    console.error('发送配对邀请失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 接受配对邀请
router.post('/accept/:id', auth, async (req, res) => {
  try {
    const couple = await Couple.findOne({
      _id: req.params.id,
      user2: req.user._id,
      status: 'pending'
    });

    if (!couple) {
      return res.status(404).json({ message: '邀请不存在或已过期' });
    }

    couple.status = 'accepted';
    await couple.save();

    res.json(couple);
  } catch (err) {
    console.error('接受配对邀请失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取配对状态
router.get('/status', auth, async (req, res) => {
  try {
    const couple = await Couple.findOne({
      $or: [
        { user1: req.user._id },
        { user2: req.user._id }
      ]
    }).populate('user1 user2', 'username');

    if (!couple) {
      return res.json({ status: 'none' });
    }

    res.json(couple);
  } catch (err) {
    console.error('获取配对状态失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 解除配对关系
router.delete('/:id', auth, async (req, res) => {
  try {
    const couple = await Couple.findOne({
      _id: req.params.id,
      $or: [
        { user1: req.user._id },
        { user2: req.user._id }
      ]
    });

    if (!couple) {
      return res.status(404).json({ message: '配对关系不存在' });
    }

    await couple.remove();
    res.json({ message: '配对关系已解除' });
  } catch (err) {
    console.error('解除配对关系失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
