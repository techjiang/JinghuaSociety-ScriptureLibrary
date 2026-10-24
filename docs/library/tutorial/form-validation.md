---
title: 表单验证实战
createTime: 2026-10-22
permalink: /library/tutorial/form-validation/
description: HTML5 原生验证、JS 自定义规则、提交策略——好表单的三层功夫
---

<CategoryTag name="教程" link="/library/tutorial/" />

表单是前端和用户「吵架」最多的地方：用户名格式、密码强度、
手机号位数……验证做得好，用户顺畅；做得糙，用户流失。
这篇分三层讲：**原生验证（免费）→ JS 规则（灵活）→ 提交策略（体验）**。

## 一、第一层：HTML5 原生验证（先薅免费羊毛）

```html
<form>
  <input type="text" name="username" required minlength="3" maxlength="20"
         pattern="[a-zA-Z0-9_]+" title="只允许字母数字下划线">
  <input type="email" name="email" required>
  <input type="password" name="pwd" required minlength="8">
  <input type="tel" name="phone" pattern="1[3-9]\d{9}">
  <input type="number" name="age" min="18" max="120">
  <button>提交</button>
</form>
```

浏览器自动检查，不通过**阻止提交并弹提示**。零 JS。

常用属性：

| 属性 | 作用 |
| --- | --- |
| `required` | 必填 |
| `minlength/maxlength` | 长度范围 |
| `min/max` | 数字范围 |
| `pattern` | 正则（整个值要匹配） |
| `type=email/url/tel/number` | 类型检查 + 移动端键盘适配 |
| `title` | 不匹配时的提示文案 |

**`type` 选对的隐藏福利**：`type="email"` 在手机上弹出
带 @ 的键盘，`type="tel"` 弹数字键盘 —— 输入体验直接上一个档。

自定义提示文案（现代浏览器）：

```js
input.oninvalid = function () {
  this.setCustomValidity('')                      // 先清空
  if (!this.validity.valueMissing) {
    this.setCustomValidity('这栏必填，别空着')      // 再设人话
  }
}
```

## 二、第二层：JS 规则（处理复杂的）

原生搞不定的场景：**确认密码、跨字段校验、异步检查（用户名被占用）、
实时强度条**。思路：定义「规则函数」，输入时跑，错了显示。

```js
// 规则表：字段 → 校验函数数组
const rules = {
  username: [
    { test: (v) => v.length >= 3, msg: '至少 3 个字符' },
    { test: (v) => /^[a-zA-Z0-9_]+$/.test(v), msg: '只允许字母数字下划线' },
    { test: (v) => !v.startsWith('_'), msg: '别以下划线开头' }
  ],
  password: [
    { test: (v) => v.length >= 8, msg: '至少 8 位' },
    { test: (v) => /[A-Z]/.test(v), msg: '要含大写字母' },
    { test: (v) => /\d/.test(v), msg: '要含数字' }
  ]
}

function validateField(field, value) {
  for (const rule of rules[field]) {
    if (!rule.test(value)) return rule.msg       // 返回第一个错误信息
  }
  return ''                                       // 空 = 通过
}

// 绑定：失焦时验（输入中不烦用户）
document.querySelectorAll('input').forEach((input) => {
  input.addEventListener('blur', () => {
    const msg = validateField(input.name, input.value)
    showError(input, msg)
  })
})
```

**时机选择**：`blur`（失焦）验证是体验甜点区 ——
输入中频繁报错很烦，提交时才报很晚。失焦刚好：
用户填完一栏移开时检查。

## 三、第三层：提交策略

```js
form.addEventListener('submit', async (e) => {
  e.preventDefault()                              // 阻止原生提交

  // 1. 全量校验
  let firstError = null
  for (const input of form.elements) {
    if (!input.name) continue
    const msg = validateField(input.name, input.value)
    showError(input, msg)
    if (msg && !firstError) firstError = input
  }
  if (firstError) {
    firstError.focus()                            // 跳到第一个错误
    return
  }

  // 2. 防重复提交
  submitBtn.disabled = true
  submitBtn.textContent = '提交中…'

  try {
    // 3. 发送（用封装好的 request）
    await request.post('/api/register', {
      username: form.username.value,
      email: form.email.value
    })
    showSuccess('注册成功！')
  } catch (err) {
    // 4. 服务端错误映射回表单
    if (err.response?.status === 422) {
      for (const [field, msg] of Object.entries(err.response.data.errors)) {
        showError(form[field], msg)               // 后端校验结果回填
      }
    } else {
      showError(null, '网络问题，稍后再试')
    }
  } finally {
    submitBtn.disabled = false
    submitBtn.textContent = '提交'
  }
})
```

四个要点：**提交前全量校验 + 聚焦第一个错误**、
**按钮防重复（disabled + 文案）**、**服务端校验回填**、
**finally 恢复按钮**。

## 四、异步验证：用户名被占用

```js
// 防抖 + 请求（别用户每敲一个字都发请求）
const checkUsername = debounce(async (value) => {
  if (value.length < 3) return
  const { available } = await request.get('/api/username/check', {
    params: { username: value }
  })
  showError(usernameInput, available ? '' : '这个名字被占了')
}, 500)          // 停 500ms 才查

usernameInput.addEventListener('input', (e) => checkUsername(e.target.value))
```

**必须后端最终校验** —— 前端异步检查只是体验，
直接绕过的成本是零（安全在[Web 安全](../web-security.md)）。

## 五、UI 细节：错误的「礼貌」

```css
/* 错误状态：红色边框 + 图标 + 文字 */
.field.has-error input {
  border-color: #dc2626;
  /* 右侧加个 ⚠ 图标 */
  background-image: url('warn.svg');
  background-position: right 12px center;
  background-repeat: no-repeat;
  padding-right: 36px;
}

.field .error-msg {
  color: #dc2626;
  font-size: 13px;
  margin-top: 4px;
}

/* 通过状态：淡淡的绿勾，给正反馈 */
.field.has-success input { border-color: #16a34a; }
```

- **错误信息说人话**：「密码要 8 位以上，还得有数字」胜过
  「密码格式不正确」；
- **别只红框不说话**：用户不知道错哪；
- **成功也给反馈**：绿勾让人安心；
- **提交失败别清空表单** —— 用户会哭。

## 六、安全底线（前端是体验，后端是安全）

前端验证全部可绕过。**后端必须重新校验所有字段**：

- 类型、长度、范围、格式，后端全查；
- 别信「前端已验证过」；
- 错误信息别泄露内部细节（「SQL 错了」别回给用户）。

## 小结

表单三层功夫：**HTML5 属性（免费的第一层）、JS 规则（灵活的第二层）、
提交策略（体验的第三层：聚焦错误/防重发/后端回填）**。
加上错误文案说人话、异步检查加防抖、后端兜底校验 ——
用户少骂街，你也少背锅。
