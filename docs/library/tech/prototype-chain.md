---
title: JavaScript 原型链与继承
createTime: 2026-10-22
permalink: /library/tech/prototype/
description: 原型、原型链、class 语法糖与继承的现代写法，面试必考但要真懂
---

# JavaScript 原型链与继承

JS 没有「类」（ES6 前），对象靠**原型**关联。这是它和
Java/Python 最不一样的地方，也是面试重灾区。
但实际写代码，你可能一年都碰不到一次原型 —— 直到你踩了那个坑：
「我给数组加了个方法，为什么所有数组都有了？」

## 一、从一个现象说起

```js
const arr = [1, 2, 3]
arr.myCustomMethod()  // ❌ 没有这个方法啊
// 但！如果你这么干：
Array.prototype.myCustomMethod = () => 'hi'
// 之后所有数组都能调用了
```

为什么？因为**数组自己不带方法清单，方法在它的「原型」上**。
这个「原型」就是本篇的主角。

## 二、原型：对象的「备胎查找表」

每个对象都有一个隐藏属性 `[[Prototype]]`（`__proto__` 是它的
浏览器遗留访问器）。查找属性时：

```text
obj.name
  → obj 自己有 name？有：返回
  → 没有：去 obj.__proto__ 找
      → 有：返回
      → 没有：继续去 __proto__.__proto__ 找
          → …一直到 null，还没找到：undefined
```

这条查找链就是**原型链**。

```js
const obj = { a: 1 }
obj.toString  // obj 自己没有 toString，但能调用 —— 原型链上有
```

`{}` 的原型是 `Object.prototype`，上面挂着 `toString`、`hasOwnProperty`
这些「对象公共方法」。所以任何对象都能调 toString。

## 三、prototype：函数的神秘属性

只有函数有 `prototype` 属性（箭头函数没有）：

```js
function Person(name) {
  this.name = name
}
Person.prototype.sayHi = function () {
  return `hi, ${this.name}`
}

const p = new Person('张三')
p.sayHi()  // 'hi, 张三' —— p 自己没有 sayHi，原型上有
```

关系图：

```text
p ──__proto__──► Person.prototype ──__proto__──► Object.prototype ──__proto__──► null
```

`new Person()` 干了三件事：

1. 创建空对象 `{}`；
2. 把 `{}` 的 `__proto__` 指向 `Person.prototype`；
3. 用 `{}` 当 `this` 调用 `Person`（所以里面能 `this.name = ...`）。

**把共享方法放 prototype 上**，是所有实例共用一份 ——
这就是「继承」的原始形态。

## 四、class：原型继承的语法糖

ES6 的 class 干的是同一件事，只是好看：

```js
class Person {
  constructor(name) {
    this.name = name
  }

  sayHi() {          // 自动进 Person.prototype
    return `hi, ${this.name}`
  }

  static create(name) {   // 静态方法，挂在类上
    return new Person(name)
  }
}

class Student extends Person {
  constructor(name, grade) {
    super(name)             // 调父类构造函数
    this.grade = grade
  }

  study() {
    return `${this.name} 在学 ${this.grade}`
  }
}

const s = new Student('李四', '三年级')
s.sayHi()    // 'hi, 李四' —— 继承来的
s.study()    // '李四 在学 三年级'
```

`extends` + `super` 背后就是原型链的连接：

```text
s ──► Student.prototype ──► Person.prototype ──► Object.prototype ──► null
```

**class 是糖不是新机制**：它没有私有字段（`#name` 才是真私有）、
没有真正的多态。但写业务代码，class 语法比 function.prototype 清晰十倍，
该用就用。

## 五、实战：五种继承模式速查

### 1. 原型链继承（原始版，有坑）

```js
function Parent() { this.names = ['a'] }
function Child() {}
Child.prototype = new Parent()
// 坑：所有实例共享 names 数组（引用类型），一个改全改
```

### 2. 构造函数借用（解决属性共享）

```js
function Child() {
  Parent.call(this)  // 借父类构造函数跑一遍，属性各一份
}
// 但方法不在原型上，每个实例一份，浪费
```

### 3. 组合继承（经典解法）

```js
function Child() {
  Parent.call(this)          // 属性：构造函数借用
}
Child.prototype = new Parent() // 方法：原型链
Child.prototype.constructor = Child
```

### 4. 寄生组合继承（最优解）

```js
function Child() {
  Parent.call(this)
}
Child.prototype = Object.create(Parent.prototype)  // 只借方法不调构造函数
Child.prototype.constructor = Child
```

### 5. class extends（现代答案）

上面第四节那个。**日常就用它**，前四种了解即可 ——
面试问「手写继承」能写出组合继承就够了。

## 六、必踩的三个坑

**坑一：覆盖原型断链**

```js
function Person() {}
Person.prototype = { sayHi() {} }   // 整个换掉，constructor 丢了
// 修复：Person.prototype.constructor = Person
```

**坑二：在原型上存引用类型**

```js
function Team() {}
Team.prototype.members = []   // 所有实例共享这个数组！
const t1 = new Team(), t2 = new Team()
t1.members.push('a')
t2.members  // ['a'] ← 吓人不
```

引用类型放构造函数里（`this.members = []`），别放 prototype。

**坑三：instanceof 的谎言**

```js
arr instanceof Array      // true
arr instanceof Object     // 也 true（原型链上有 Object.prototype）
```

`instanceof` 查的是原型链，不是「亲生」。跨 iframe 的对象更离谱
（两个 window 的 Array 互相不认）。**精确类型判断用 `Array.isArray()`**
或者 `Object.prototype.toString.call()`。

## 七、和日常开发的关系

说句实话：**现代框架里你几乎不手写原型继承**。class、组合式 API、
TS 接口全帮你封装了。但原型知识在这些地方还在：

- **理解 `this`**：方法查找沿着原型链，`obj.method()` 的 `this` 是
  `obj` 不是 method 的「家」；
- **给内置对象加方法**（生产环境别干，polyfill 除外）；
- **读框架源码**：Vue 的响应式、React 的 Class Component，
  底层全是原型；
- **面试**：这题出现率 90%，但别只会背，能把上面「现象」讲明白即可。

## 小结

原型链三句话：**对象查属性顺 `__proto__` 链往上找、函数的 `prototype`
是给它 `new` 出来的实例当「公共方法区」、class 就是这套机制的语法糖**。
写业务用 class，读源码懂原型，面试能画链。三段够了，别陷进去。
