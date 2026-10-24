---
title: Redis 常用命令速查
createTime: 2026-10-22
permalink: /library/tutorial/redis-commands/
description: 按场景组织的 Redis 命令清单，配 Docker 一条命令练手
---

<CategoryTag name="教程" link="/library/tutorial/" />

原理在[技术区的 Redis 入门](../../tech/redis-basics.md)讲过，
这篇是**操作手册**：按「我要干什么」组织，忘了来查。
建议配合本地 Docker 实例边敲边学。

## 一、起一个本地 Redis

```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
docker exec -it redis redis-cli
```

进去之后是个交互式 shell，敲 `PING` 回 `PONG` 就成了。

## 二、通用操作

```bash
KEYS pattern          # 按模式查 key（⚠️ 生产禁用！数据多时卡死。用 SCAN）
SCAN 0 MATCH user:*   # 渐进式遍历（生产用这个）
EXISTS key            # key 存在吗（1/0）
TYPE key              # key 是什么类型
DEL key               # 删
EXPIRE key 3600       # 设过期（秒）
TTL key               # 看还剩多久（-1 永久，-2 不存在）
PERSIST key           # 去掉过期
RENAME old new        # 改名
FLUSHDB               # ⚠️ 删当前库所有 key（生产核武器）
```

**`KEYS` 是线上事故常客**：百万 key 的库执行 `KEYS *`，
Redis 单线程直接卡死，所有请求超时。生产环境一律 `SCAN`。

## 三、String：计数器与简单缓存

```bash
SET user:1:name "张三"           # 设值
GET user:1:name                  # 取值
SETEX code:13800138000 300 123456    # 设值 + 300 秒过期（验证码场景）
SETNX lock:order:1 "uuid"        # 不存在才设（分布式锁）

INCR page:views                  # +1（原子）
INCRBY page:views 10             # +10
DECR stock:1001                  # -1（库存扣减）
MSET a 1 b 2                     # 批量设
MGET a b                         # 批量取（一次网络往返）
```

**场景对照**：验证码（SETEX）、计数器（INCR）、
限流（INCR + EXPIRE）、分布式锁（SETNX + 过期）。

## 四、Hash：存对象

```bash
HSET user:1 name "张三" age 25 city "北京"    # 设字段（可多个）
HGET user:1 name                            # 取单字段
HMGET user:1 name age                       # 取多字段
HGETALL user:1                              # 取整个对象
HDEL user:1 city                            # 删字段
HINCRBY user:1 age 1                        # 字段数字自增
HLEN user:1                                 # 几个字段
```

**什么时候用 Hash 而不是 String 存 JSON**：

- 要单独改某几个字段 → Hash（不用整体读改写）；
- 要频繁读整个对象 → 都行，JSON 字符串更省事。

用户信息、商品信息、配置项，Hash 是常用选择。

## 五、List：队列

```bash
LPUSH queue:tasks "task1"         # 左进
RPUSH queue:tasks "task2"         # 右进
LPOP queue:tasks                  # 左出（FIFO 队列：RPUSH 生产 + LPOP 消费）
RPOP queue:tasks                  # 右出（栈）
LRANGE queue:tasks 0 -1           # 看全部
LRANGE queue:tasks 0 9            # 前 10 个
LLEN queue:tasks                  # 长度
LREM queue:tasks 1 "task1"        # 删指定值
```

**场景**：简单任务队列、最新 N 条（LPUSH + LTRIM 0 99 截断）、
文章评论流。要求「可靠投递」的队列请上 RabbitMQ/RocketMQ，
Redis List 是「够用就好」档。

## 六、Set：去重与集合运算

```bash
SADD tags:post:1 vue redis        # 加成员
SREM tags:post:1 vue              # 删
SISMEMBER tags:post:1 vue         # 在吗（1/0）
SMEMBERS tags:post:1              # 全部成员
SCARD tags:post:1                 # 数量
SPOP tags:post:1                  # 随机弹一个（抽奖）

SINTER setA setB                  # 交集（共同关注）
SUNION setA setB                  # 并集
SDIFF setA setB                   # 差集
SINTERSTORE result setA setB      # 交集存起来
```

**场景**：点赞去重（用户点过没）、共同好友、标签、
抽奖（SPOP/SRANDMEMBER）。

## 七、ZSet：排行榜

```bash
ZADD leaderboard 100 "player1" 95 "player2" 110 "player3"
ZSCORE leaderboard "player1"            # 查分
ZINCRBY leaderboard 5 "player1"         # 加分
ZRANGE leaderboard 0 -1 WITHSCORES      # 升序全部
ZREVRANGE leaderboard 0 9 WITHSCORES    # 降序前 10（Top 10）
ZRANK leaderboard "player1"             # 排名（从 0 开始）
ZREVRANK leaderboard "player1"          # 倒序排名
ZRANGEBYSCORE leaderboard 100 200       # 分数区间
ZREM leaderboard "player2"              # 删
```

**场景**：热榜 Top N、延迟队列（score 存执行时间戳，
定时 `ZRANGEBYSCORE` 捞到期的）、范围统计。

## 八、事务与流水线（了解）

```bash
MULTI                    # 开事务
SET a 1
INCR a
EXEC                     # 执行（原子，但中间不能有条件判断）

# 流水线：一批命令一次发（省 RTT，不保证原子）
# redis-cli --pipe 或客户端 API
```

日常开发事务用得少（业务逻辑放代码里），
知道有这回事就行。

## 九、五个救命命令

```bash
INFO memory              # 内存占用
INFO stats               # 命中率等统计
SLOWLOG GET 10           # 最近 10 条慢命令（排查性能）
CLIENT LIST              # 看谁连着（排查连接数）
CONFIG GET maxmemory     # 看内存上限配置
```

线上卡了先敲这五个，信息量比日志大。

## 十、练习建议

```bash
# 用 redis-cli 模拟三个场景：
# 1. 验证码：SETEX phone 300 123456，TTL 看倒计时
# 2. 排行榜：ZADD 三个玩家，ZREVRANGE 看 Top 3
# 3. 点赞：SADD 几个用户，SISMEMBER 查某人点没点
```

敲十遍比看十篇记得牢。命令忘了就 `redis-cli help @string`
（按类型查帮助）。

## 小结

速查定位：**计数器→String、对象→Hash、队列→List、
去重→Set、排行→ZSet、过期→EXPIRE、遍历→SCAN**。
生产三禁令：**别用 KEYS、小心 FLUSHDB、大 value 要拆分**。
日常够用的就这些，剩下的（Lua、Stream、Geo）等真实需求。
