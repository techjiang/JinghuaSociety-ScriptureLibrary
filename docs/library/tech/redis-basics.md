---
title: Redis 十分钟入门
createTime: 2026-10-21
permalink: /library/tech/redis-basics/
description: 五种数据结构、三个最常用场景，以及一个必须知道的坑：缓存穿透
---
Redis 是后端面试三巨头之一（Redis + MySQL + 消息队列），
也是实际工作中用得最多的「非数据库」。它是个
**基于内存的 KV 存储**，所以快 —— 单机每秒十万次读写。
这篇讲最常用的部分，够你应付日常开发。

> 测试环境：Redis 7.2，本地 Docker 起。

## 一、先跑起来

```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
docker exec -it redis redis-cli
```

进去之后是个交互式命令行，敲 `ping`，回 `PONG` 就成了。

## 二、五种数据结构（按使用频率）

### String：最简单的 KV

```bash
SET user:1:name "张三"
GET user:1:name          # "张三"

SET page:home:views 100
INCR page:home:views     # 101，原子自增（计数器场景神器）
EXPIRE page:home:views 3600   # 一小时后自动消失
```

计数器、限流 token、分布式锁的值，都用 String。
`INCR` 是原子操作，多客户端同时加也不会错乱 ——
这是它比「先 GET 再 SET」强的地方。

### Hash：一个 key 存多个字段

```bash
HSET user:1 name "张三" age 25 email "zs@example.com"
HGET user:1 name         # "张三"
HGETALL user:1           # 整个对象
HINCRBY user:1 age 1     # age 变 26
```

适合存「对象」—— 比把整个对象 JSON 序列化成 String 更灵活：
能单独改某个字段，不用整个读出来改完再写回去。

### List：双端队列

```bash
LPUSH queue:tasks "task1"      # 左边进
RPUSH queue:tasks "task2"      # 右边进
LPOP queue:tasks               # 左边出（FIFO 队列）
LRANGE queue:tasks 0 -1        # 看全部
```

简单消息队列、最新 N 条动态（朋友圈、最新评论）。
注意：它是「简单队列」，别拿它当专业 MQ 用 ——
没有确认机制、没有持久化保证、消费者组也没有。

### Set：去重集合

```bash
SADD tags:post:1 "vue" "redis" "docker"
SISMEMBER tags:post:1 "vue"        # 1，在不在
SADD user:1:liked 101 102 103      # 用户点赞过的文章
SCARD user:1:liked                 # 3，点赞数
SINTER user:1:liked user:2:liked   # 两人共同点赞的文章（交集）
```

去重、共同好友、共同关注，`SINTER/SUNION/SDIFF` 三个集合运算
在 Redis 里是一句话的事，在 MySQL 里要写半天 JOIN。

### ZSet：带分数的集合

```bash
ZADD leaderboard 100 "player1" 95 "player2" 110 "player3"
ZREVRANGE leaderboard 0 2 WITHSCORES   # 分数前三名
ZINCRBY leaderboard 5 "player1"        # 加 5 分
```

排行榜、延迟队列（score 存时间戳）、范围查询。
**ZSet 是 Redis 最被低估的结构**，带排序的有序集合，
很多场景（热搜榜、Top N）非它不可。

## 三、三个最常用场景

### 1. 缓存：挡在数据库前面的盾

```text
请求 → Redis 有？ → 有：直接返回（快）
                  → 没有：查 DB → 写回 Redis → 返回
```

读多写少的数据（商品信息、配置、用户资料）都该缓存。
数据库 QPS 几千，Redis QPS 十万，中间挡一层，
数据库压力直接掉一个量级。

### 2. 计数器/限流

```bash
INCR api:rate:user:10086        # 这个用户第几次请求
EXPIRE api:rate:user:10086 60   # 每分钟窗口
```

超过阈值就拒。`INCR` + `EXPIRE` 两行搞定固定窗口限流。

### 3. 分布式锁

```bash
SET lock:order:123 "request-id" NX EX 30
```

`NX`（不存在才设）+ `EX`（30 秒过期），保证同一时刻只有一个
客户端拿到锁。秒杀、定时任务单实例执行这类场景用。
释放锁时要校验 value 是不是自己的 request-id，
否则可能删了别人的锁（这个细节坑过无数人）。

## 四、必须知道的坑：缓存穿透

经典三连击：

**缓存穿透**：查一个**根本不存在**的 key（比如 id=-1），
Redis 没有，DB 也没有，每次请求都打到 DB。
恶意刷这种请求，DB 就挂了。

- 防：空结果也缓存（`SET key "" EX 60`），或者布隆过滤器。

**缓存击穿**：某个**热点 key 过期瞬间**，大量请求同时涌向 DB。

- 防：热点 key 不设过期时间，或者加互斥锁只让一个请求回源。

**缓存雪崩**：大量 key **同一时间集体过期**（或者 Redis 挂了），
DB 被洪峰冲垮。

- 防：过期时间加随机值（`TTL = 基础值 + random(0, 300)`），
  高可用上哨兵/集群。

面试问「Redis 相关问题」，八成是这三个。**记住口诀：
穿透查不存在，击穿热点过期，雪崩集体到期。**

## 五、和数据库的分工

一句话：**MySQL 是账本（要准确、要持久），Redis 是便签
（要快、可丢）**。

- 便签丢了不影响账本，所以 Redis 敢纯内存、敢异步持久化；
- 但「敢丢」不等于「能随便丢」：Redis 挂了正在重建缓存时，
  DB 压力会飙起来，所以生产要配持久化（RDB/AOF）和主从。

## 六、本地练手

```bash
# Docker 起一个，随便折腾
docker run -d --name redis -p 6379:6379 redis:7-alpine

# 交互式客户端
docker exec -it redis redis-cli
```

在线教程：[try.redis.io](https://try.redis.io)，浏览器里边玩边学。

## 小结

Redis 日常就这些：**五种数据结构（String/Hash/List/Set/ZSet）、
三个场景（缓存/计数/锁）、三个坑（穿透/击穿/雪崩）**。
入门半天够用，精通要看源码和运维 —— 但日常开发，
真到不了需要精通的地步。
