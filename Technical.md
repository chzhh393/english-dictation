# 英语听写小助手技术方案

## 1. 技术架构
### 1.1 整体架构
- 前端：Taro + React + TypeScript
- 后端：微信云开发
- 存储：云数据库 + 云存储
- 第三方服务：OCR + 词典API

### 1.2 技术选型详情
#### 前端框架
- Taro 3.x
  - 使用React语法
  - TypeScript支持
  - 跨端能力
  
#### UI框架
- NutUI（基础组件）
- Taro UI（补充组件）

#### 状态管理
- React Hooks
- Context API

#### 云开发
- 云数据库：用户数据、听写记录
- 云存储：图片存储
- 云函数：业务逻辑

## 2. 核心服务
### 2.1 OCR服务
- 服务商：腾讯云OCR
- 用途：
  - 识别教材单词
  - 批改作业
- 费用：0.0015元/次
- 免费额度：1000次/月

### 2.2 语音服务
- 方案：词典API
- 可选API：
  - 有道词典API
  - 剑桥词典API
- 备选方案：预制音频文件

## 3. 数据库设计
### 3.1 用户表(users)
```typescript
interface User {
  _id: string;
  openid: string;
  nickname: string;
  avatar: string;
  createTime: Date;
}
```

### 3.2 单词组表(wordLists)
```typescript
interface WordList {
  _id: string;
  name: string;
  words: Array<{
    word: string;
    meaning: string;
    phonetic?: string;
  }>;
  creator: string;
  createTime: Date;
}
```

### 3.3 听写记录表(dictations)
```typescript
interface Dictation {
  _id: string;
  userId: string;
  wordListId: string;
  words: Array<{
    word: string;
    correct: boolean;
  }>;
  score: number;
  imageUrl?: string;
  createTime: Date;
}
```

## 4. 项目结构
```
src/
├── components/        # 公共组件
├── pages/            # 页面文件
├── services/         # API服务
├── hooks/            # 自定义hooks
├── utils/            # 工具函数
├── constants/        # 常量定义
├── types/            # 类型定义
└── app.ts            # 入口文件
```

## 5. 开发环境
- Node.js >= 14
- VSCode
- 微信开发者工具
- Git

## 6. 部署环境
- 微信小程序云开发环境
  - 开发环境
  - 测试环境
  - 生产环境

## 7. 安全考虑
1. 数据安全
   - 用户数据加密存储
   - 敏感信息脱敏
   
2. 访问控制
   - 用户鉴权
   - 数据访问权限

3. 资源控制
   - 限制单用户访问频率
   - 限制文件上传大小

## 8. 性能优化
1. 图片处理
   - 上传前压缩
   - 使用CDN加速

2. 数据缓存
   - 常用单词音频缓存
   - 用户数据本地缓存

3. 请求优化
   - 数据预加载
   - 接口合并
```

接下来，我可以帮您搭建工程，需要执行以下步骤：

1. 首先确保安装了Node.js和Taro CLI：
```bash
npm install -g @tarojs/cli
```

2. 创建项目：
```bash
taro init english-dictation
```
在交互式命令行中选择：
- 框架：React
- 语言：TypeScript
- 模板：默认模板
- 包管理器：npm

3. 安装必要依赖：
```bash
cd english-dictation
npm install @nutui/nutui-react-taro
npm install @tarojs/plugin-html
```

需要我继续详细说明配置过程吗？
