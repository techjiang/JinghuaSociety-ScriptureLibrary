---
title: SQL 十分钟入门
createTime: 2026-10-21
permalink: /library/tutorial/sql-basics/
description: 只会增删改查也能干活——一篇够用的 SQL 速成，附练习环境
---

# SQL 十分钟入门

不管前端后端，迟早要跟数据库打交道。SQL 这门语言，
日常用到的就那几条。这篇按「使用频率」讲，
十分钟能上手，够你写完毕业设计。

> 示例基于 MySQL 8.0，PostgreSQL/SQLite 语法 95% 通用，
> 有差别的地方会注明。

## 一、先建一张表

SQL 操作的对象是「表」—— 想象成一张带表头的 Excel：

```sql
CREATE TABLE users (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(50)  NOT NULL,
    email       VARCHAR(100) UNIQUE,
    age         INT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

读法：

- `id INT PRIMARY KEY AUTO_INCREMENT`：主键，自增 ID。
  每张表都该有个主键，找行、关联、防重都靠它；
- `VARCHAR(50)`：最长 50 的字符串；
- `NOT NULL`：必填；
- `UNIQUE`：不能重复（邮箱场景）；
- `DEFAULT CURRENT_TIMESTAMP`：不填就存当前时间。

## 二、增：INSERT

```sql
INSERT INTO users (name, email, age) VALUES ('张三', 'zhangsan@example.com', 25);
```

一次插多行：

```sql
INSERT INTO users (name, email, age) VALUES
    ('李四', 'lisi@example.com', 30),
    ('王五', 'wangwu@example.com', 28);
```

字段名写全是个好习惯 —— 表结构将来加字段时，
不写全的 INSERT 会因为「列数不匹配」报错。

## 三、查：SELECT（重点）

SQL 里 SELECT 是用得最多的，值得花五分钟细看。

### 查全部

```sql
SELECT * FROM users;
```

`*` 是「所有列」。正式代码里别用 `*`，列出需要的列，
数据量大时差别巨大，而且表结构变了代码不崩。

### 查指定列 + 条件

```sql
SELECT name, age FROM users WHERE age >= 18;
```

- `WHERE` 后面的条件跟写代码的 if 一样；
- 常用操作符：`=`、`>`、`<`、`>=`、`!=`（或 `<>`）；
- `AND` / `OR` 组合条件：

```sql
SELECT name, age FROM users
WHERE age >= 18 AND age <= 35 AND name LIKE '张%';
```

`LIKE '张%'` 是模糊匹配：`%` 匹配任意多个字符，
`_` 匹配单个字符。注意：`LIKE '%xx%'` 这种前后都通的，
大表上慢得钻心，能不用就不用。

### 排序和限量

```sql
SELECT name, age FROM users ORDER BY age DESC LIMIT 10;
```

- `ORDER BY age DESC`：按年龄倒序（`ASC` 是正序，默认）；
- `LIMIT 10`：只要前 10 条。分页就是 `LIMIT 10 OFFSET 20`
  （跳过 20 条取 10 条）。

### 聚合：COUNT / AVG / SUM

```sql
SELECT COUNT(*) FROM users;                    -- 总人数
SELECT AVG(age) FROM users WHERE age > 0;      -- 平均年龄
SELECT SUM(age) FROM users;                    -- 年龄总和（什么鬼场景）
```

### 分组统计：GROUP BY

```sql
SELECT age, COUNT(*) AS cnt
FROM users
GROUP BY age
HAVING cnt > 1
ORDER BY cnt DESC;
```

读法：按年龄分组，数每组多少人，只要人数超过 1 的组，
按人数倒序。`AS cnt` 是给计算结果起个名，
后面 `HAVING` 和 `ORDER BY` 就能引用它。

**WHERE 和 HAVING 的区别**（经典面试题）：WHERE 在分组**前**过滤
原始行，HAVING 在分组**后**过滤分组。要「人数大于 1 的年龄组」，
只能 HAVING，因为分组前还没有「人数」这个数。

## 四、改：UPDATE

```sql
UPDATE users SET age = 26 WHERE name = '张三';
```

** UPDATE 和 DELETE 的铁律：WHERE 千万别忘。**
`UPDATE users SET age = 26;` 没有 WHERE，
是把**全表**的年龄都改成 26。生产环境这么干，职业生涯就交代了。
我的习惯：先写 `SELECT ... WHERE ...` 确认影响行数，
再原样改成 UPDATE 执行。

```sql
SELECT * FROM users WHERE name = '张三';   -- 先查，确认就一行
UPDATE users SET age = 26 WHERE name = '张三';  -- 再改
```

## 五、删：DELETE

```sql
DELETE FROM users WHERE name = '张三';
```

软删除思想：正式项目很少真删，一般加个 `is_deleted` 字段标记，
查询时过滤。数据删了容易，想恢复难于上青天。

## 六、多表关联：JOIN

单表不够用的场景。比如订单表 `orders` 和用户表 `users`：

```sql
SELECT o.id, u.name, o.amount
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.amount > 100;
```

- `FROM orders o`：给表起个短别名 `o`，后面少打好多字；
- `JOIN users u ON o.user_id = u.id`：两张表按「订单的 user_id
  等于用户的 id」拼起来；
- JOIN 还有几个变种：`LEFT JOIN`（左边表全保留，
  右边没匹配的填 NULL）、`RIGHT JOIN`（反过来）、
  `INNER JOIN`（只留两边都有的，默认就是这个）。

## 七、练习环境

看书学不会 SQL，动手才行：

- **[SQLBolt](https://sqlbolt.com)**：浏览器里边学边练，
  交互式课程，免费，最适合零基础；
- **[SQL Zoo](https://sqlzoo.net)**：题目由浅入深，有中文版；
- 本地装 [DB Browser for SQLite](https://sqlitebrowser.org)，
  拿个真实数据库文件随便练，不怕搞坏。

## 八、安全一句话

**永远不要用字符串拼接 SQL**，要用参数化查询：

```js
// 危险：SQL 注入！
db.query(`SELECT * FROM users WHERE name = '${userInput}'`)

// 安全：参数化
db.query('SELECT * FROM users WHERE name = ?', [userInput])
```

用户输入 `' OR '1'='1` 这种串，拼接版直接让你全表裸奔。
这是 Web 安全的基本功，和 [XSS/CSRF](./web-security.md)
并列的必修课。

## 小结

SQL 日常就六条：**INSERT 加、SELECT 查、UPDATE 改、
DELETE 删、JOIN 关联、GROUP BY 统计**。加上 WHERE 条件
和 ORDER BY / LIMIT 排序限量，够应付九成场景。
剩下的（索引优化、执行计划、窗口函数）等真遇到慢查询再学，
不迟。
