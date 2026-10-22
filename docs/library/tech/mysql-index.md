---
title: MySQL 索引原理与优化
createTime: 2026-10-22
permalink: /library/tech/mysql-index/
description: B+ 树、聚簇索引、最左前缀、EXPLAIN 实战与慢查询优化
---

# MySQL 索引原理与优化

「查询怎么变慢了」—— 十有八九是索引没用上，或者用错了。
索引是 MySQL 性能优化的第一杠杆，也是面试必考。
这篇讲原理（够用为止）加实战（EXPLAIN 怎么看、慢查询怎么救）。

## 一、没有索引的世界

```sql
SELECT * FROM orders WHERE user_id = 12345
```

没有索引：MySQL 把 orders 表**从头到尾扫一遍**（全表扫描）。
表里一千万行？扫一千万行。有了索引：直接跳到匹配行，
O(log n) 对 O(n)，天壤之别。

索引的代价：**写变慢、占空间**（每次 insert/update 都维护索引）。
所以索引不是越多越好，是「按查询模式建」。

## 二、底层：为什么是 B+ 树

InnoDB 用 **B+ 树**存索引。特点：

```text
               [30 | 60 | 90]              ← 非叶子节点，只存键
              /    |    \
    [10|20|25]  [40|50|55]  [70|80|85|95]   ← 叶子节点，存完整数据
        └──────链表串起来─────┘
```

- **树矮**：三层的 B+ 树能存千万级数据，查一次只要 3 次磁盘 IO；
- **叶子链表**：范围查询（`BETWEEN`、`>`、`<`）顺着链表走，
  不用回树；
- 数据都在叶子：非叶子节点只存键，一页能放更多键，树更矮。

对比：哈希索引（Memory 引擎）等值查询 O(1) 但不支持范围、
不适合磁盘。二叉树退化成链表。所以 MySQL 选 B+ 树，是工程上的正确。

## 三、聚簇索引与非聚簇索引

InnoDB 的两个概念，必须分清：

### 聚簇索引（主键索引）

**叶子节点存的是整行数据**。表按主键组织。
InnoDB 要求必须有主键（没有会自建隐藏的）。

### 非聚簇索引（二级索引/辅助索引）

```sql
CREATE INDEX idx_user ON orders(user_id)
```

叶子节点存的是**主键值**，不是整行。

所以查询路径：

```sql
SELECT * FROM orders WHERE user_id = 123
```

① 走 `idx_user` 找到 `user_id=123` 的叶子 → 拿到主键 id；
② **回表**：拿 id 去聚簇索引查整行数据。

**回表是二级索引的固有成本**。优化手段：覆盖索引 ——
查询的列全在索引里，不用回表：

```sql
SELECT id, user_id FROM orders WHERE user_id = 123
-- id 和 user_id 都在索引里，不用回表，快一倍
```

`EXPLAIN` 的 Extra 列出现 `Using index` 就是覆盖索引生效了。

## 四、联合索引与最左前缀

```sql
CREATE INDEX idx_name_age ON users(name, age)
```

这条索引对以下查询有效：

```sql
WHERE name = '张三'                    ✅ 用上（最左列）
WHERE name = '张三' AND age = 25      ✅ 全用上
WHERE age = 25                        ❌ 跳过了 name，用不上
WHERE name LIKE '张%'                 ✅ 范围查询，前缀部分有效
WHERE name LIKE '%三'                 ❌ 前置通配，索引失效
```

**最左前缀原则**：联合索引像电话簿 —— 先按姓排，同姓按名排。
你只知道「名」，没法在按姓排的簿子里快速找。

### 范围查询断点

```sql
WHERE name = '张三' AND age > 20 AND city = '北京'
-- name 等值 ✅ → age 范围 ✅（到这里还能用索引排序）
-- → city ❌（范围之后的列，索引定不了顺序，只能逐行过滤）
```

范围列之后的索引列用不上（定位用），但**覆盖索引**仍可能省回表。

## 五、EXPLAIN：看得懂执行计划

慢查询先 `EXPLAIN`：

```sql
EXPLAIN SELECT * FROM orders WHERE user_id = 123 AND status = 'paid'
```

关注几列：

| 列 | 看什么 |
| --- | --- |
| `type` | **ALL = 全表扫描（最差）**、index = 扫全索引、range = 范围、ref = 索引查找、eq_ref = 唯一索引、const = 主键等值 |
| `key` | 实际用了哪个索引。NULL = 没用上（重点排查） |
| `rows` | 预计扫多少行。越少越好 |
| `Extra` | `Using filesort`（额外排序，慢）、`Using temporary`（临时表，慢）、`Using index`（覆盖索引，好） |

目标：`type` 至少到 `range`/`ref`，`Extra` 没有 filesort/temporary。

## 六、常见索引失效的场景

建了索引但不用的「灵异事件」，多半是这些：

```sql
-- 1. 对列用函数/运算
WHERE YEAR(create_time) = 2026        -- ❌ 索引失效
WHERE create_time >= '2026-01-01' AND create_time < '2027-01-01'  -- ✅

-- 2. 隐式类型转换
WHERE phone = 13800138000             -- phone 是 varchar，数字比较导致全表扫
WHERE phone = '13800138000'           -- ✅ 加引号

-- 3. 前置通配
LIKE '%keyword%'                      -- ❌（除非全文索引）

-- 4. OR 两边不全是索引列
WHERE user_id = 1 OR remark = 'x'     -- remark 没索引，整个走全表

-- 5. 不等于有时不用（优化器觉得扫的多不如全表）
WHERE status <> 'deleted'             -- 可能全表，看数据分布
```

规律：**索引是为「比较原值」服务的，你把列包进函数、改类型、
加通配，优化器就不认了**。

## 七、慢查询优化实战

某天接口超时，`EXPLAIN` 一条：

```sql
SELECT * FROM orders
WHERE user_id = 123
ORDER BY create_time DESC
LIMIT 10
-- type: ref, key: idx_user, rows: 5000, Extra: Using filesort
```

问题：用索引找到了 user 的 5000 单，但 `ORDER BY create_time`
要额外排序（filesort）—— 5000 行排序取 10 条，慢。

解法：建**联合索引**，让顺序直接来自索引：

```sql
CREATE INDEX idx_user_time ON orders(user_id, create_time)
```

查询不变。原理：`user_id` 等值定位后，`create_time` 在索引里天然有序，
顺着读 10 条就是结果 —— filesort 消失，10 毫秒变 1 毫秒。

**套路总结**：`WHERE 等值列, ORDER BY 列` 的模式，
联合索引把 `(等值列, 排序列)` 建上，消 filesort。

## 八、建索引的 checklist

- [ ] WHERE 的等值列建索引（高选择性的优先，状态位这种低选择性不加）；
- [ ] ORDER BY / GROUP BY 列考虑进联合索引；
- [ ] JOIN 的关联列（`ON a.user_id = b.id`）两边都建；
- [ ] 用 `EXPLAIN` 验证每条慢查询；
- [ ] 别建重复索引（`(a)` 和 `(a,b)` 重复了，留后者）；
- [ ] 单表索引一般不超过 5 个，写多读少的大表慎重加。

## 小结

索引三板斧：**B+ 树查得快、联合索引守最左前缀、EXPLAIN 验身**。
遇到慢查询先别加索引 —— 先 `EXPLAIN` 看懂它怎么扫的，
九成问题（函数包列、类型不匹配、缺联合索引）一眼可见。
盲目加索引是把写性能也搭进去的下下策。
