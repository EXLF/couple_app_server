# Couple App Server

情侣应用的后端服务器

## 功能特性

- 用户认证与授权
- 纪念日管理
- 矛盾记录管理
- 愿望管理
- 健康记录管理

## 技术栈

- Node.js
- Express
- MongoDB
- JWT 认证

## 安装

```bash
# 安装依赖
npm install
```

## 开发环境运行

```bash
# 启动开发服务器
npm run dev
```

## 生产环境部署

1. 创建生产环境配置文件 `.env.production`：

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/couple-app
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=*
NODE_ENV=production
```

2. 启动服务器：

```bash
npm run prod
```

## API 文档

### 认证接口

#### 登录
- POST `/api/auth/login`
- Body: `{ username, password }`

### 纪念日接口

#### 获取纪念日列表
- GET `/api/anniversaries`
- Headers: `Authorization: Bearer token`

#### 添加纪念日
- POST `/api/anniversaries`
- Headers: `Authorization: Bearer token`
- Body: `{ title, date, imageUrl }`

#### 更新纪念日
- PUT `/api/anniversaries/:id`
- Headers: `Authorization: Bearer token`
- Body: `{ title, date, imageUrl }`

#### 删除纪念日
- DELETE `/api/anniversaries/:id`
- Headers: `Authorization: Bearer token`

### 矛盾记录接口

#### 获取矛盾记录列表
- GET `/api/conflicts`
- Headers: `Authorization: Bearer token`

#### 添加矛盾记录
- POST `/api/conflicts`
- Headers: `Authorization: Bearer token`
- Body: `{ title, description, date }`

#### 更新矛盾记录
- PUT `/api/conflicts/:id`
- Headers: `Authorization: Bearer token`
- Body: `{ title, description, resolution }`

#### 删除矛盾记录
- DELETE `/api/conflicts/:id`
- Headers: `Authorization: Bearer token`

### 愿望接口

#### 获取愿望列表
- GET `/api/wishes`
- Headers: `Authorization: Bearer token`

#### 添加愿望
- POST `/api/wishes`
- Headers: `Authorization: Bearer token`
- Body: `{ title, description }`

#### 更新愿望
- PUT `/api/wishes/:id`
- Headers: `Authorization: Bearer token`
- Body: `{ title, description, isCompleted }`

#### 删除愿望
- DELETE `/api/wishes/:id`
- Headers: `Authorization: Bearer token`

## 开发团队

- 后端开发：[您的名字]

## 许可证

MIT
