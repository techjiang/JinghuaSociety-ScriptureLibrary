---
title: HTTP 方法与幂等性
createTime: 2026-10-22
permalink: /library/tech/http-methods/
description: GET/POST/PUT/PATCH/DELETE 的语义边界、幂等是什么、为什么重试前必须懂
---

# HTTP 方法与幂等性

方法（Method）是 HTTP 请求的「动词」。动词用错，
不只是「不规范」—— 缓存、重试、爬虫全会误解你。
这篇讲清语义边界和那个面试必考的**幂等性**。

## 一、九个方法，常用五个

| 方法 | 作用 | 安全 | 幂等 |
| --- | --- | --- | --- |
| GET | 获取资源 | ✅ | ✅ |
| POST | 创建/提交（语义开放） | ❌ | ❌ |
| PUT | 全量替换资源 | ❌ | ✅ |
| PATCH | 部分修改资源 | ❌ | ❌* |
| DELETE | 删资源 | ❌ | ✅ |
| HEAD | 只要头不要体（探活/查大小） | ✅ | ✅ |
| OPTIONS | 查询服务器支持什么（CORS 预检用它） | ✅ | ✅ |
| TRACE | 回显请求（诊断用，基本废了） | ✅ | ✅ |
| CONNECT | 建隧道（代理/HTTPS 代理） | ❌ | ❌ |

*PATCH 可以是幂等的（比如「把状态改成 X」），
也可以不是（「给计数 +1」）—— 取决于实现。

**日常只会用到前五个 + OPTIONS。**

## 二、两个概念：安全与幂等

### 安全（Safe）

**不改变服务器资源状态**。GET/HEAD/OPTIONS 安全 ——
服务器不该因为「读了一下」就改数据。

```text
安全的方法：随便调、随便缓存、爬虫随便抓
不安全的方法：调之前想清楚后果
```

### 幂等（Idempotent）

**同样的请求发一次和发 N 次，效果相同。**

```text
GET /users/1      发 10 次：返回同样的数据          ✅ 幂等
DELETE /users/1   发 10 次：第一次删了，后面 404     ✅ 幂等（结果一致：不存在）
PUT /users/1 {...} 发 10 次：最终状态是「那套数据」   ✅ 幂等
POST /users       发 10 次：创建了 10 个用户！        ❌ 不幂等
```

**幂等的关键在「最终状态」，不在「每次响应」**：
DELETE 第一次 200、第二次 404 —— 状态都是「已删除」，
所以幂等。**浏览器/网络栈据此决定「失败能不能自动重试」** ——
这就是它不只是学术概念的原因。

## 三、PUT vs POST vs PATCH：经典的糊涂账

### 创建资源用谁？

```http
# 方式一：POST 到集合（服务端分配 ID）
POST /users  { "name": "张三" }
→ 201 Created, Location: /users/123

# 方式二：PUT 到具体 URI（客户端指定 ID）
PUT /users/123  { "name": "张三" }
→ 201 Created
```

**POST 创建**：服务端说了算（ID、时间、默认值）。
**PUT 创建**：客户端说了算（ID 我指定）。两者都合法，
API 选一种贯彻。

### 更新用谁？

```http
# PATCH：只传要改的字段
PATCH /users/123  { "name": "李四" }
# 结果：name 变李四，age/email 原样

# PUT：传完整资源
PUT /users/123  { "name": "李四", "age": 26, "email": "ls@x.com" }
# 结果：整个资源被替换成这套（少给的字段可能被清空！）
```

**PUT 是「替换」，PATCH 是「打补丁」**。
日常更新接口 90% 该用 PATCH（传部分字段自然多了）。
PUT 的经典用途：文件上传、配置全量覆盖。

### POST 的开放语义

POST 是「方法里的瑞士军刀」：创建、提交表单、
触发动作（`POST /users/1/activate`）…… 没有严格约束。
正因为没约束，**POST 的接口文档要格外写清楚语义** ——
别人猜不出你那个 POST 到底是创建还是触发。

## 四、RPC 风格动作怎么办

有些操作不是 CRUD：「激活用户」「发布文章」、「重新计算」。
三种风格：

```http
# 1. 子资源激活（推荐，最 REST）
POST /users/1/activation

# 2. 动词进路径（ pragmatic，常见）
POST /users/1/activate

# 3. 自定义方法（Google API 风格）
POST /users/1:activate
```

选一种团队统一。**别和 CRUD 混着来** ——
一会儿 `/users/1/activate` 一会儿 `/users/1/publish`，
文档没法读。

## 五、幂等的工程意义

### 1. 重试安全

网络超时了，客户端不知道服务端处理没处理。
**幂等的请求（PUT/DELETE）可以大胆重试**；
POST 重试可能创建重复订单 —— 需要额外的
**幂等键（Idempotency-Key）**机制：

```http
POST /orders
Idempotency-Key: client-generated-uuid-123
```

服务端记录「这个 key 处理过」，重复请求直接返回首次结果。
Stripe 等支付 API 的标准做法（RESTful 那篇详述）。

### 2. 缓存和 CDN

CDN/代理只缓存**安全方法**（GET/HEAD）的响应。
POST 响应一律不缓存 —— 所以「为什么我的接口不缓存」，
先看方法是不是 GET。

### 3. 爬虫与 SEO

搜索引擎只「敢」深入爬 GET 页面。POST 才能访问的内容
（老式「点击加载」）对 SEO 基本隐形。

## 六、选码速查

```text
读数据          → GET     （要缓存、要 SEO、要幂等）
创建（服务端分配 ID） → POST    （不幂等，配幂等键）
创建/替换（客户端指定） → PUT     （幂等，传完整）
更新部分字段     → PATCH   （日常更新首选）
删除            → DELETE  （幂等，返回 204）
触发动作        → POST /资源/子动作
```

**返回什么状态码**配合[状态码指南](./status-codes.md)一起看：
GET→200、POST 创建→201、PUT→200/201、PATCH→200、DELETE→204。

## 七、常见错误用法

1. **GET 做修改**：`GET /deleteUser?id=1` ——
   浏览器预取、爬虫、CDN 全可能「误触发」，删库冤案；
2. **POST 一把梭**：读也用 POST（「POST 安全，不被缓存」）——
   丢掉了缓存、SEO、语义；
3. **PUT 更新忘传全字段**：客户端以为「只改 name」，
   结果 PUT 把 age 清了；
4. **DELETE 不幂等地实现**：依赖「删除时计数」之类的副作用，
   重试就出怪事。

## 小结

方法语义记五句：**GET 读（安全幂等）、POST 建（都不）、
PUT 换（幂等全量）、PATCH 补（部分更新）、DELETE 删（幂等）**。
幂等性是「重试安全」的通行证 —— 设计接口时先问自己：
「这个方法重试十次，世界会怎样？」答不上来，
先把语义和幂等键想清楚。
