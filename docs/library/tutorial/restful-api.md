---
title: RESTful API 设计入门
createTime: 2026-10-22
permalink: /library/tutorial/restful-api/
description: 资源建模、HTTP 方法语义、状态码、错误格式与分页，写给前后端都该懂的人
---

<CategoryTag name="教程" link="/library/tutorial/" />
前后端协作，接口是契约。契约设计得好，前后端各自安好；
设计得烂，天天为「这个字段叫啥」「错误怎么返回」扯皮。
这篇讲一套实用的 RESTful 设计规范，不是 RFC 复读，是踩坑总结。

## 一、核心思想：URL 是名词，方法是动词

REST 的本质：**把一切都当资源，用 HTTP 方法表达操作**。

```text
GET    /users          获取用户列表
POST   /users          创建用户
GET    /users/123      获取单个用户
PUT    /users/123      全量更新用户
PATCH  /users/123      部分更新用户
DELETE /users/123      删除用户
```

反面教材（见过真实项目）：

```text
GET /getUserList        # 动词进 URL，方法还浪费
POST /createUser
POST /deleteUserById?id=123
```

判断标准：**URL 里不该出现动词**。出现动词，说明你在用 URL 表达动作，
那还不如直接上 RPC。

## 二、命名与结构的规矩

### 用复数，用连字符

```text
✅ /users, /blog-posts, /order-items
❌ /user, /blog_posts, /orderItems
```

复数：`/users/1` 比 `/user/1` 顺眼，列表和单项统一。
连字符：`/blog-posts` 比 `/blog_posts` 读着舒服（下划线和蛇形命名混用是历史遗留）。

### 层级表达归属

```text
/users/123/orders          用户 123 的订单列表
/users/123/orders/456      用户 123 的 456 号订单
```

层级别超过两层。`/users/123/orders/456/items/789/reviews` 这种，
查询参数是更好的选择：`/reviews?item=789`。

### 过滤排序分页用查询参数

```text
GET /users?status=active&sort=-created_at&page=2&per_page=20
```

- 过滤：字段名=值；
- 排序：`sort=-created_at`（减号表降序，约定俗成）；
- 分页：`page` + `per_page`（简单场景），大数据量用 `cursor`（游标分页，深页不慢）。

## 三、状态码：用对别滥用

| 码 | 含义 | 场景 |
| --- | --- | --- |
| 200 | OK | GET/PUT/PATCH 成功 |
| 201 | Created | POST 创建成功（响应带 Location 头更好） |
| 204 | No Content | DELETE 成功，没内容返回 |
| 400 | Bad Request | 参数错误、校验失败 |
| 401 | Unauthorized | 没登录/ token 失效 |
| 403 | Forbidden | 登录了但没权限 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 唯一键冲突、状态不允许 |
| 422 | Unprocessable | 语义错误（用得少，和 400 有重叠） |
| 429 | Too Many Requests | 限流 |
| 500 | Internal Error | 服务端炸了 |

**最常犯的错：什么都返 200，错误信息塞 body 里**：

```json
// 反例：HTTP 200，但业务失败
{ "code": 5001, "message": "用户不存在", "data": null }
```

这会让监控、缓存、重试机制全部失灵 —— HTTP 层看是成功的，
业务层看是失败的，两边精神分裂。**状态码表达 HTTP 语义，
body 表达业务细节**，各司其职。

## 四、响应格式：统一约定

### 成功

```json
{
  "data": { "id": 123, "name": "张三" }
}
```

单个资源直接给对象；列表包一层带元信息：

```json
{
  "data": [{ "id": 1 }, { "id": 2 }],
  "meta": { "total": 57, "page": 1, "per_page": 20 }
}
```

### 失败

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "参数校验失败",
    "details": [
      { "field": "email", "message": "邮箱格式不正确" }
    ]
  }
}
```

`code` 给程序判断（稳定的字符串），`message` 给人看（可以变），
`details` 逐字段说明。前后端约定好这套，联调效率翻倍。

## 五、版本管理：从第一天就要想

API 会变。不变的方式有三种：

1. **URL 路径**：`/api/v1/users` —— 最直观，缓存友好，推荐；
2. **请求头**：`Accept: application/vnd.api.v1+json` —— 干净但麻烦；
3. **查询参数**：`/users?version=1` —— 慎用，容易被缓存搞乱。

**个人项目经验**：第一个版本就带 `/v1/`。破坏性变更出 `v2`，
`v1` 跑一段时间再下线。别信「我们不会改接口」 —— 都会改。

## 六、认证：JWT 还是 Session

简单对比：

| | Session | JWT |
| --- | --- | --- |
| 存储 | 服务端存，客户端只存 ID | 客户端存完整 token |
| 吊销 | 容易（删服务端记录） | 难（得等过期或加黑名单） |
| 多服务 | 要共享存储（Redis） | 天然支持（无状态） |
| 体积 | 小（一个 cookie） | 大（几百字节到 KB） |

选型经验：**单服务用 Session 省心；多服务/移动端用 JWT**。
别追新技术，JWT 的「无法吊销」坑过很多项目 ——
用户改密码后旧 token 还能用，安全事故的经典开头。

认证统一放请求头：

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs…
```

## 七、幂等性：重复请求别重复执行

**POST 创建订单，用户连点两下，创建了两单** —— 经典 bug。

幂等设计：客户端生成一个唯一 key（订单号/请求 ID），
服务端按 key 去重：

```http
POST /orders
Idempotency-Key: client-generated-uuid-123
```

服务端记录「这个 key 已经处理过」，重复请求直接返回上次结果。
Stripe 等支付接口都有这个头，值得抄。

## 八、自测清单

接口写完，逐条过：

- [ ] URL 是名词复数，没有动词；
- [ ] 方法语义正确（GET 不改数据，DELETE 幂等）；
- [ ] 状态码表达 HTTP 语义，不拿 200 包错误；
- [ ] 错误格式统一（code/message/details）；
- [ ] 分页参数一致；
- [ ] 需要认证的接口，401 和 403 分得清；
- [ ] POST 有幂等设计；
- [ ] 敏感字段（密码、token）不出现在响应里。

## 小结

RESTful 的核心不是「URL 长得像 REST」，是**资源思维 + HTTP 语义 +
约定优于配置**。这套规范前后端都该懂 —— 前端知道为什么 401 要跳登录，
后端知道为什么不能什么都返 200。契约清晰，扯皮减半。
