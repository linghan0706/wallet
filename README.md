## 技术栈

### 核心框架

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**

### UI 与样式

- **Ant Design** - UI 组件库
- **Tailwind CSS** - 样式框架
- **Framer Motion** - 动画库

### 状态管理与数据

- **Zustand** - 轻量化状态管理
- **SWR** - 数据获取和缓存

### TON 区块链集成

- **@ton/ton** - TON 核心库
- **@ton/crypto** - 加密功能库
- **@tonconnect/sdk** - TON Connect SDK
- **@tonconnect/ui-react** - TON Connect React UI
- **@ton-api/client** - TON API 客户端

### 开发工具

- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Jest** - 测试框架
- **Testing Library** - React 组件测试

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 环境配置

复制环境变量文件并配置：

```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，填入必要的配置：

```env
# TON API ����
NEXT_PUBLIC_TON_API_KEY=your_ton_api_key_here

# TON Connect ����
NEXT_PUBLIC_TONCONNECT_MANIFEST_URL=/api/tonconnect/manifest
NEXT_PUBLIC_TONCONNECT_ICON_URL=
NEXT_PUBLIC_TONCONNECT_TERMS_URL=
NEXT_PUBLIC_TONCONNECT_PRIVACY_URL=

# Ӧ������
NEXT_PUBLIC_APP_URL=https://your-domain.example
NEXT_PUBLIC_APP_NAME=Nova Explorer Bot

# ��������
NEXT_PUBLIC_NETWORK=mainnet
```

> ��Telegram WebApp�л���ʱ�������TON Connect�����ύ��HTTPS������ַ���Ա������CSP���ơ
> ���ʹ���Զ���·�������ɷ�����`/api/tonconnect/manifest`

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint 检查
- `npm run lint:fix` - 自动修复 ESLint 问题
- `npm run format` - 格式化代码
- `npm run format:check` - 检查代码格式
- `npm run test` - 运行测试
- `npm run test:watch` - 监视模式运行测试
- `npm run test:coverage` - 生成测试覆盖率报告

## 项目结构

```
src/
├── app/                  # 页面路由（App Router）
│   ├── home/             # 个人首页
│   ├── store/            # 商店页面
│   ├── task/             # 任务页面
│   ├── backpack/         # 背包页面
│   ├── base/             # 基础页面
│   └── layout.tsx        # 全局布局
├── components/          # UI 组件
│   ├── layout/          # 布局组件（如底部导航）
│   ├── ui/              # 通用 UI（加载、错误边界）
│   └── WalletConnect.tsx # 钱包连接组件
├── features/            # 功能模块
│   ├── explorer/        # 区块链浏览器功能
│   └── wallet/          # 钱包相关功能（含 hooks）
├── lib/                 # 工具类库
│   ├── ton-client.ts    # TON 客户端封装
│   └── ton-config.ts    # TON 配置文件
├── services/            # API 服务层
├── stores/              # Zustand 状态管理
├── types/               # TypeScript 类型定义
├── utils/               # 工具函数（格式化、验证等）
└── styles/              # 全局样式（globals.css）
```
