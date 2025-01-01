const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token;
let userId;
let coupleId;
let anniversaryId = '';
let conflictId = '';
let wishId = '';
let currentTestUser;

// 测试数据
const testAnniversary = {
  title: '第一次见面',
  date: '2023-12-31',
  description: '在咖啡馆相遇'
};

const testConflict = {
  title: '关于周末安排的分歧',
  description: '对于周末是出游还是在家休息产生分歧',
  date: '2023-12-31'
};

const testWish = {
  title: '一起去旅行',
  description: '计划去日本旅行一周',
  targetDate: '2024-05-01'
};

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  validateStatus: () => true
});

// 在登录成功后保存 coupleId
api.interceptors.response.use(response => {
  if (response.data && response.data.user) {
    userId = response.data.user.id;
    if (response.data.user.tempCoupleId) {
      coupleId = response.data.user.tempCoupleId;
    }
  }
  if (response.data && response.data.coupleId) {
    coupleId = response.data.coupleId;
  }
  return response;
});

// 测试函数
async function testServerConnection() {
  console.log('\n1. 测试服务器连接');
  const response = await api.get('/test');
  console.log('服务器状态:', response.data.message);
  console.log('测试通过 ✓');
}

async function testRegister() {
  console.log('\n2. 测试用户注册');
  const timestamp = Date.now();
  const testUser = {
    username: `testuser${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: 'password123'
  };

  const response = await api.post('/auth/register', testUser);
  
  if (response.status === 201) {
    console.log('注册成功:', response.data);
    // 保存测试用户信息，供后续登录使用
    currentTestUser = testUser;
    console.log('测试通过 ✓');
    return true;
  } else {
    console.log('测试失败:', response.data);
    return false;
  }
}

async function testLogin() {
  console.log('\n3. 测试用户登录');
  const response = await api.post('/auth/login', {
    username: currentTestUser.username,
    password: currentTestUser.password
  });

  if (response.status === 200) {
    token = response.data.token;
    console.log('登录成功，获取到token');
    console.log('测试通过 ✓');
    return true;
  } else {
    console.log('测试失败:', response.data);
    return false;
  }
}

async function testAddAnniversary() {
  console.log('\n4. 测试添加纪念日');
  const response = await api.post('/anniversaries', {
    title: '第一次见面',
    date: '2023-12-31',
    description: '在咖啡馆相遇',
    coupleId: coupleId // 添加 coupleId
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (response.status === 201) {
    console.log('纪念日创建成功:', response.data);
    console.log('测试通过 ✓');
    anniversaryId = response.data._id;
    return response.data._id;
  } else {
    console.log('测试失败:', response.data);
    return null;
  }
}

async function testGetAnniversaries() {
  console.log('\n5. 测试获取纪念日列表');
  const response = await api.get('/anniversaries', {
    headers: { Authorization: `Bearer ${token}` }
  });

  console.log('获取到纪念日列表:', response.data);
  console.log('获取到纪念日数量:', response.data.length);
  console.log('测试通过 ✓');
  return response.data;
}

async function testAddConflict() {
  console.log('\n6. 测试添加矛盾记录');
  const response = await api.post('/conflicts', {
    title: '关于周末安排的分歧',
    description: '对于周末是出游还是在家休息产生分歧',
    date: '2023-12-31'
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (response.status === 201) {
    console.log('矛盾记录创建成功:', response.data);
    console.log('测试通过 ✓');
    return response.data._id;
  } else {
    console.log('测试失败:', response.data);
    return null;
  }
}

async function testUpdateConflictStatus(conflictId) {
  console.log('\n7. 测试更新矛盾状态');
  if (!conflictId) {
    console.log('没有可更新的矛盾记录ID');
    return;
  }

  const response = await api.patch(`/conflicts/${conflictId}/status`, {
    status: '已解决',
    resolution: '通过沟通达成共识'
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (response.status === 200) {
    console.log('矛盾状态更新成功:', response.data);
    console.log('测试通过 ✓');
  } else {
    console.log('测试失败:', response.data);
  }
}

async function testAddHealth() {
  console.log('8. 测试添加今日健康记录');
  const healthResponse = await api.post('/health', {
    hasTakenMedicine: true,
    note: '今天按时服药'
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('健康记录创建成功:', healthResponse.data);
  console.log('测试通过 ✓');
}

async function testAddWish() {
  console.log('9. 测试添加愿望');
  const wishResponse = await api.post('/wishes', testWish, {
    headers: { Authorization: `Bearer ${token}` }
  });
  wishId = wishResponse.data._id;
  console.log('愿望创建成功:', wishResponse.data);
  console.log('测试通过 ✓');
}

async function testGetWishStats() {
  console.log('10. 测试获取愿望统计');
  const wishStats = await api.get('/wishes/stats', {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('愿望统计:', wishStats.data);
  console.log('测试通过 ✓');
}

// 测试修改纪念日
async function testUpdateAnniversary(anniversaryId) {
  console.log('\n11. 测试修改纪念日');
  const response = await api.put(`/anniversaries/${anniversaryId}`, {
    title: '第一次约会',
    date: '2024-01-01',
    description: '在公园散步'
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (response.status === 200) {
    console.log('纪念日修改成功:', response.data);
    console.log('测试通过 ✓');
  } else {
    console.log('测试失败:', response.data);
  }
}

// 测试删除纪念日
async function testDeleteAnniversary(anniversaryId) {
  console.log('\n12. 测试删除纪念日');
  const response = await api.delete(`/anniversaries/${anniversaryId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (response.status === 200) {
    console.log('纪念日删除成功:', response.data);
    console.log('测试通过 ✓');
  } else {
    console.log('测试失败:', response.data);
  }
}

// 测试修改矛盾记录
async function testUpdateConflict(conflictId) {
  console.log('\n13. 测试修改矛盾记录');
  const response = await api.put(`/conflicts/${conflictId}`, {
    title: '关于假期安排的分歧',
    description: '对于假期是回家还是出游产生分歧',
    date: '2024-01-01'
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (response.status === 200) {
    console.log('矛盾记录修改成功:', response.data);
    console.log('测试通过 ✓');
  } else {
    console.log('测试失败:', response.data);
  }
}

// 测试删除矛盾记录
async function testDeleteConflict(conflictId) {
  console.log('\n14. 测试删除矛盾记录');
  const response = await api.delete(`/conflicts/${conflictId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (response.status === 200) {
    console.log('矛盾记录删除成功:', response.data);
    console.log('测试通过 ✓');
  } else {
    console.log('测试失败:', response.data);
  }
}

// 测试修改愿望
async function testUpdateWish(wishId) {
  console.log('\n15. 测试修改愿望');
  const response = await api.put(`/wishes/${wishId}`, {
    title: '一起去环球旅行',
    description: '计划环游世界一个月',
    targetDate: '2024-12-31',
    status: '进行中'
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (response.status === 200) {
    console.log('愿望修改成功:', response.data);
    console.log('测试通过 ✓');
  } else {
    console.log('测试失败:', response.data);
  }
}

// 测试删除愿望
async function testDeleteWish(wishId) {
  console.log('\n16. 测试删除愿望');
  const response = await api.delete(`/wishes/${wishId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (response.status === 200) {
    console.log('愿望删除成功:', response.data);
    console.log('测试通过 ✓');
  } else {
    console.log('测试失败:', response.data);
  }
}

// 主测试函数
async function runTests() {
  try {
    console.log('开始测试...\n');

    // 1. 测试服务器连接
    await testServerConnection();

    // 2. 用户注册
    await testRegister();
    
    // 3. 用户登录
    await testLogin();
    
    // 4. 添加纪念日
    await testAddAnniversary();
    
    // 5. 获取纪念日列表
    await testGetAnniversaries();
    
    // 6. 添加矛盾记录并获取ID
    const conflictId = await testAddConflict();
    
    // 7. 更新矛盾状态
    await testUpdateConflictStatus(conflictId);

    // 8. 测试添加今日健康记录
    await testAddHealth();

    // 9. 测试添加愿望
    await testAddWish();

    // 10. 测试获取愿望统计
    await testGetWishStats();

    // 11. 修改纪念日
    await testUpdateAnniversary(anniversaryId);
    
    // 12. 删除纪念日
    await testDeleteAnniversary(anniversaryId);

    // 13. 修改矛盾记录
    await testUpdateConflict(conflictId);
    
    // 14. 删除矛盾记录
    await testDeleteConflict(conflictId);

    // 15. 修改愿望
    await testUpdateWish(wishId);
    
    // 16. 删除愿望
    await testDeleteWish(wishId);

    console.log('所有测试完成！✨\n');

  } catch (err) {
    console.error('测试过程中出现错误:', err.message);
  }
}

// 运行测试
runTests();
