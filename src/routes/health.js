const express = require('express');
const router = express.Router();
const Health = require('../models/health');
const auth = require('../middleware/auth');

// 获取用户的健康记录（支持日期范围查询）
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { coupleId: req.user.coupleId };

    // 如果提供了日期范围，添加到查询条件
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const healthRecords = await Health.find(query)
      .sort({ date: -1 });
    res.json(healthRecords);
  } catch (err) {
    console.error('获取健康记录失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 添加今日健康记录
router.post('/', auth, async (req, res) => {
  try {
    const { hasTakenMedicine, note } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const health = new Health({
      userId: req.user._id,
      coupleId: req.user.coupleId,
      date: today,
      hasTakenMedicine,
      note
    });

    await health.save();
    res.status(201).json(health);
  } catch (err) {
    console.error('添加健康记录失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新今日健康记录
router.put('/today', auth, async (req, res) => {
  try {
    const { hasTakenMedicine, note } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const healthRecord = await Health.findOne({
      userId: req.user._id,
      date: today
    });

    if (!healthRecord) {
      return res.status(404).json({ message: '今天还没有记录' });
    }

    healthRecord.hasTakenMedicine = hasTakenMedicine;
    healthRecord.note = note;

    await healthRecord.save();
    res.json(healthRecord);
  } catch (err) {
    console.error('更新健康记录失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取今日健康记录
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const healthRecord = await Health.findOne({
      userId: req.user._id,
      date: today
    });

    if (!healthRecord) {
      return res.status(404).json({ message: '今天还没有记录' });
    }

    res.json(healthRecord);
  } catch (err) {
    console.error('获取今日健康记录失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取伴侣今日健康记录
router.get('/partner/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 获取伴侣的记录（不是自己的记录）
    const partnerRecord = await Health.findOne({
      coupleId: req.user.coupleId,
      userId: { $ne: req.user._id },
      date: today
    });

    if (!partnerRecord) {
      return res.status(404).json({ message: '伴侣今天还没有记录' });
    }

    res.json(partnerRecord);
  } catch (err) {
    console.error('获取伴侣健康记录失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取健康记录统计
router.get('/stats', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {
      userId: req.user._id,
      date: {
        $gte: new Date(startDate || new Date().setDate(new Date().getDate() - 30)),
        $lte: new Date(endDate || new Date())
      }
    };

    const stats = await Health.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalDays: { $sum: 1 },
          medicationTakenDays: {
            $sum: { $cond: ['$hasTakenMedicine', 1, 0] }
          }
        }
      }
    ]);

    res.json(stats[0] || { totalDays: 0, medicationTakenDays: 0 });
  } catch (err) {
    console.error('获取健康统计失败:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
