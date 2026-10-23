---
title: SQL 注入：原理与防护
createTime: 2026-10-22
permalink: /library/tech/sql-injection/
description: 一条查询怎么被拖全库，参数化查询为什么能防住，附检测清单
---

<CategoryTag name="技术" link="/library/tech/" />

# SQL 注入：原理与防护

SQL 注入是 Web 安全史上的「经典款」：简单、致命、
至今仍在野生漏洞榜前列。原理五分钟能讲清，
防护也只要一个习惯。这篇都讲。

## 一、攻击是什么样子的

场景：一个登录接口。

```js
// ❌ 危险：字符串拼 SQL
const sql = `SELECT * FROM users WHERE name = '${username}' AND pwd = '${password}'`
```

正常用户输入 `zhangsan` / `123456`，生成的 SQL：

```sql
SELECT * FROM users WHERE name = 'zhangsan' AND pwd = '123456'
```

攻击者在用户名框输入：

```text
' OR '1'='1
```

拼接后：

```sql
SELECT * FROM users WHERE name = '' OR '1'='1' AND pwd = '123456'
```

`'1'='1'` 永真 → **条件被绕过，登录成功**（以第一个用户身份，
通常是管理员）。

这还是温和的。更狠的：

```text
用户名输入：'; DROP TABLE users; --
```

（不同数据库/驱动对多语句支持不同，但思路一致：
把你的输入变成「SQL 代码」而不是「数据」。）

## 二、核心问题：数据被当成了代码

SQL 注入的本质：**用户输入拼进了 SQL 字符串**。
输入里的引号、分号被数据库当作「语法」，于是数据越狱成了代码。

```text
你以为：'abc'    是数据
数据库看到：'abc' 是「字符串 abc」
攻击者输入：a' OR '1'='1
数据库看到：'a' OR '1'='1' ← 三个语法片段，条件永真
```

**所有「拼接 SQL」的代码都是嫌疑犯**，包括：

- `WHERE name = '${name}'`
- `ORDER BY ${field}`（排序字段也能注入！）
- `LIMIT ${page}`
- 表名/列名动态拼（`SELECT * FROM ${table}`）

## 三、防护：参数化查询（唯一正道）

**让数据库把输入当数据，永远不当代码。**

```js
// ✅ 参数化：? 占位，值分开传
const sql = 'SELECT * FROM users WHERE name = ? AND pwd = ?'
const [rows] = await db.query(sql, [username, password])
```

驱动把值「安全地」填进占位符 —— 引号、分号都会被转义成
**普通字符**，绝不可能变成语法。

各语言的写法：

```js
// Node (mysql2)
db.query('SELECT * FROM users WHERE id = ?', [userId])

// Python (sqlite3)
cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))

// Java (JDBC PreparedStatement)
PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?");
ps.setInt(1, userId);

// PHP (PDO)
$stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
$stmt->execute([$userId]);
```

**铁律：SQL 里一个变量都不拼。** 表名/列名这种「不能参数化」
的（语法位置不是值位置），用**白名单**：

```js
const ALLOWED_SORTS = ['created_at', 'price', 'name']

function buildQuery(sortField) {
  if (!ALLOWED_SORTS.includes(sortField)) {
    throw new Error('非法排序字段')
  }
  return `SELECT * FROM products ORDER BY ${sortField}`
}
```

枚举允许值，不在名单里的一律拒绝 —— 别用「过滤黑名单」，
黑名单永远漏。

## 四、ORM 呢？不是免死金牌

Sequelize/Prisma/TypeORM 的参数化方法是安全的：

```js
// ✅ Prisma 默认参数化
await prisma.user.findUnique({ where: { name: username } })
```

但 ORM 也留了「原始 SQL」的口子：

```js
// ❌ Prisma 的 $queryRaw 拼字符串一样中招
await prisma.$queryRaw(`SELECT * FROM users WHERE name = '${username}'`)

// ✅ 用标签模板（自动参数化）
await prisma.$queryRaw`SELECT * FROM users WHERE name = ${username}`
```

**ORM 的 escape 函数也要看清** —— `sequelize.escape()` 之类
用对了安全，用错了（忘了 escape 某个拼接）照样中招。
原则不变：**值走参数，语法走白名单。**

## 五、纵深防御：别只靠一层

参数化是第一道，后面还有：

1. **最小权限**：应用连数据库用只读/有限账号
   （[服务器篇](../linux-server-basic.md)讲过），
   拖库了也删不了表；
2. **错误信息别外泄**：SQL 报错直接返给前端 =
   告诉攻击者表结构。统一错误页，细节进日志；
3. **WAF**：Nginx/CDN 层拦常见注入特征（聊胜于无，
   正经防护还是代码层）；
4. **审计日志**：谁、什么时候、查了什么，
   事后追溯靠它。

## 六、自检清单

```text
□ 全项目搜一遍字符串拼 SQL（'"`+${' 附近的 SELECT/INSERT/UPDATE/DELETE）
□ WHERE/ORDER BY/LIMIT 的值全部参数化或白名单
□ 没有把用户输入直接当表名/列名
□ 数据库账号权限最小化
□ 生产错误信息不返回 SQL 细节
□ 依赖的 ORM/驱动是最新版（老版本有绕过漏洞）
```

「全项目搜一遍」这条最土也最有效 —— 我见过太多项目
以为用了 ORM 就安全，角落里躺着三段三年前手拼的 SQL。

## 七、真被拖库了怎么办

1. **先止损**：下线接口/回滚代码/改防火墙规则；
2. **留证据**：日志、访问记录先导出（后面溯源/报警要用）；
3. **评估影响**：哪些表、多少数据、有没有密码/身份证；
4. **强制重置**：所有用户密码重置（ bcrypt 哈希也得防彩虹表）；
5. **通报**：按法规（国内的《个人信息保护法》）该通知通知，
  该上报上报。**捂着不报，罪加一等。**

## 小结

SQL 注入三句话：**拼接 SQL = 敞开门、参数化查询 = 唯一正道、
白名单管表名列名**。ORM 默认安全但别用 `$queryRaw` 拼字符串。
防护成本是「一个习惯」，中招代价是「一次公开处刑」——
这道数学题，谁都会算。
