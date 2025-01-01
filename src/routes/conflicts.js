const express = require('express');
const router = express.Router();
const Conflict = require('../models/conflict');
const auth = require('../middleware/auth');

// 获取情侣的所有矛盾记录
router.get('/', auth, async (req, res) => {
  try {
    const coupleId = req.user.coupleId || req.user.tempCoupleId;
    const conflicts = await Conflict.find({ coupleId })
      .sort({ date: -1 });
    res.json(conflicts);
  } catch (err) {
    console.error('获取矛盾列表失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 添加新矛盾记录
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const coupleId = req.user.coupleId || req.user.tempCoupleId;
    
    const conflict = new Conflict({
      coupleId,
      title,
      description,
      date,
      status: '未解决'
    });

    await conflict.save();
    res.status(201).json(conflict);
  } catch (err) {
    console.error('添加矛盾记录失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除矛盾记录
router.delete('/:id', auth, async (req, res) => {
  try {
    const conflict = await Conflict.findOneAndDelete({
      _id: req.params.id,
      coupleId: req.user.coupleId
    });

    if (!conflict) {
      return res.status(404).json({ message: '矛盾记录不存在' });
    }

    res.json({ message: '矛盾记录已删除' });
  } catch (err) {
    console.error('删除矛盾记录失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 修改矛盾记录
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const conflict = await Conflict.findOneAndUpdate(
      {
        _id: req.params.id,
        coupleId: req.user.coupleId
      },
      {
        title,
        description,
        date
      },
      { new: true }
    );

    if (!conflict) {
      return res.status(404).json({ message: '矛盾记录不存在' });
    }

    res.json(conflict);
  } catch (err) {
    console.error('修改矛盾记录失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取单个矛盾记录详情
router.get('/:id', auth, async (req, res) => {
  try {
    const coupleId = req.user.coupleId || req.user.tempCoupleId;
    const conflict = await Conflict.findOne({
      _id: req.params.id,
      coupleId
    });

    if (!conflict) {
      return res.status(404).json({ message: '矛盾记录不存在' });
    }

    res.json(conflict);
  } catch (err) {
    console.error('获取矛盾记录详情失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新矛盾状态（解决/未解决）
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, resolution } = req.body;
    const coupleId = req.user.coupleId;
    
    // 使用 findOneAndUpdate 来更新状态
    const conflict = await Conflict.findOneAndUpdate(
      {
        _id: req.params.id,
        coupleId: coupleId
      },
      {
        $set: {
          status: status,
          resolution: resolution,
          updatedAt: new Date()
        }
      },
      { new: true }  // 返回更新后的文档
    );

    if (!conflict) {
      return res.status(404).json({ message: '矛盾记录不存在' });
    }

    res.json(conflict);
  } catch (err) {
    console.error('更新矛盾状态失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取统计信息
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const coupleId = req.user.coupleId || req.user.tempCoupleId;
    const stats = await Conflict.aggregate([
      { $match: { coupleId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(stats);
  } catch (err) {
    console.error('获取矛盾统计信息失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
