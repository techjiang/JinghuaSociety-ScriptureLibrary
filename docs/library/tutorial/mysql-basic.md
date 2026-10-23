---
title: MySQL 基础操作速成
createTime: 2026-10-22
permalink: /library/tutorial/mysql-basic/
description: 建库建表、增删改查、常用函数与导入导出，一个下午学会用 MySQL
---

<CategoryTag name="教程" link="/library/tutorial/" />

# MySQL 基础操作速成

后端绕不开数据库，MySQL 是必修课。这篇按「使用顺序」讲：
先跑起来，再建库建表，然后 CRUD，最后常用技巧。
目标是**能干活**，不是 DBA。

## 一、跑起来

```bash
# Docker 一条命令（推荐，干净）
docker run -d --name mysql -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=你的密码 \
  mysql:8

# 连上去
docker exec -it mysql mysql -uroot -p
```

或者本地装 MySQL Workbench / Navicat 图形客户端。
**新手建议命令行先练** —— 图形界面藏着太多，命令行逼你懂语法。

## 二、建库建表

```sql
-- 建数据库（字符集选 utf8mb4，支持 emoji）
CREATE DATABASE shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shop;

-- 建表
CREATE TABLE users (
  id          INT PRIMARY KEY AUTO_INCREMENT,   -- 主键自增
  name        VARCHAR(50)  NOT NULL,
  email       VARCHAR(100) UNIQUE,               -- 唯一约束
  age         TINYINT     DEFAULT 0,
  created_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE orders (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  user_id     INT NOT NULL,
  amount      DECIMAL(10,2) NOT NULL,            -- 金额用 DECIMAL，别用 FLOAT！
  status      ENUM('pending','paid','shipped') DEFAULT 'pending',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)     -- 外键关联
);
```

三个要点：

1. **金额必须 `DECIMAL`**。`FLOAT`/`DOUBLE` 有精度问题，
   0.1 + 0.2 ≠ 0.3（详见[浮点数那篇](../float-precision.md)），
   算错钱是事故；
2. **字符集 utf8mb4**。老 `utf8` 不支持 emoji 和部分生僻字；
3. **主键用自增 INT 或 BIGINT**。UUID 也行但有争议（索引碎片），
   新手用自增最稳。

## 三、CRUD：每天就这几条

### 增

```sql
INSERT INTO users (name, email, age) VALUES ('张三', 'zs@example.com', 25);

-- 一次多行（比逐行快得多）
INSERT INTO users (name, email) VALUES
  ('李四', 'ls@example.com'),
  ('王五', 'ww@example.com');

-- 查刚插入的 ID（业务里常用）
SELECT LAST_INSERT_ID();
```

### 查

```sql
SELECT * FROM users;                          -- 全部
SELECT name, age FROM users WHERE age >= 18;  -- 指定列 + 条件
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;   -- 最新十条

-- 模糊、范围、多条件
SELECT * FROM users WHERE name LIKE '张%' AND age BETWEEN 18 AND 30;

-- 聚合统计
SELECT status, COUNT(*) AS cnt, SUM(amount) AS total
FROM orders
GROUP BY status;                              -- 每种状态多少单、多少钱

-- 两表关联（JOIN）
SELECT u.name, o.amount, o.status
FROM orders o
JOIN users u ON o.user_id = u.id              -- 关联条件
WHERE o.status = 'paid';
```

### 改

```sql
UPDATE users SET age = 26 WHERE name = '张三';
-- ⚠️ WHERE 千万别忘！忘了就是全表更新
```

### 删

```sql
DELETE FROM users WHERE id = 5;
-- ⚠️ 同理，先 SELECT 确认影响行数，再 DELETE
```

**安全习惯**：UPDATE/DELETE 前先写对应的 SELECT 看会动到哪些行。
这个习惯能防 99% 的生产事故。

## 四、常用函数

```sql
-- 字符串
CONCAT('订单', id)                    -- 拼接
LEFT(name, 1)                         -- 截取
TRIM(email)                           -- 去空格

-- 数字
ROUND(amount, 2)                      -- 四舍五入
CEIL(x) / FLOOR(x)                    -- 上/下取整

-- 日期
NOW()                                 -- 当前时间
DATE(created_at)                      -- 取日期部分
DATE_FORMAT(created_at, '%Y-%m-%d')   -- 格式化
DATE_SUB(NOW(), INTERVAL 7 DAY)       -- 七天前

-- 条件判断
CASE WHEN status = 'paid' THEN '已付' ELSE '未付' END
```

## 五、索引与性能：现在就要有的意识

```sql
-- 给常用查询条件加索引
CREATE INDEX idx_user ON orders(user_id);
CREATE INDEX idx_status_time ON orders(status, created_at);

-- 看查询怎么执行的（性能排查神器）
EXPLAIN SELECT * FROM orders WHERE user_id = 5;
```

看到 `type: ALL`（全表扫描）就是没走索引 ——
数据量大时会很慢。索引的深入内容在
[MySQL 索引原理与优化](../mysql-index.md)，入门先记住：
**WHERE 和 JOIN 的列，该加索引**。

## 六、导入导出

```bash
# 导出整个库
docker exec mysql sh -c 'exec mysqldump -uroot -p密码 shop' > shop.sql

# 导入
docker exec -i mysql mysql -uroot -p密码 shop < shop.sql
```

备份就这一条命令。**定期备份，异地多存一份** ——
硬盘坏了哭都来不及。

## 七、权限：别都用 root

```sql
-- 给应用建专用账号，只给需要的库和权限
CREATE USER 'appuser'@'%' IDENTIFIED BY '密码';
GRANT SELECT, INSERT, UPDATE ON shop.* TO 'appuser'@'%';
FLUSH PRIVILEGES;
```

应用连数据库用这个受限账号。root 只留给自己维护用 ——
应用被拖库时，损失能小一点。安全话题在
[Web 安全入门](../web-security.md)。

## 八、学习资源

- **[SQLBolt](https://sqlbolt.com)**：交互式练习，零基础友好；
- **[SQL Zoo](https://sqlzoo.net)**：题目由浅入深；
- 本站的 [SQL 十分钟入门](../sql-basics.md)：语法速查。

## 小结

MySQL 日常：**建库（utf8mb4）→ 建表（主键+类型选对）→
CRUD（WHERE 命根子）→ JOIN/GROUP BY 统计 → 索引 + EXPLAIN**。
一个下午能上手，配合 SQLBolt 刷题巩固。
记住两条保命习惯：**改删先 SELECT，定期备份**。
