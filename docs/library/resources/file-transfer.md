---
title: 文件传输与共享工具
createTime: 2026-10-22
permalink: /resources/file-transfer/
description: 局域网传输、临时网盘、P2P 分享——程序员的高效传文件方案
---

<CategoryTag name="资源" link="/library/resources/" />

「微信传文件被压画质」「网盘要登录」「发个大文件给同事」
——传文件这事，程序员有更优雅的方案。这篇按场景收。

## 一、局域网互传：最快

### LocalSend（开源跨平台）

[localsend.org](https://localsend.org) —— **开源版「隔空投送」**，
Win/macOS/Linux/Android/iOS 全平台。

**场景**：手机传电脑、同事电脑互传、会议室投文件。
**优点**：不走公网（快且隐私）、无需账号、端到端加密。
**本站作者装机必备。**

### 其他局域网方案

- **闪电互传**（国产，快但闭源）；
- **SMB/NFS 共享**（公司内网老方案，配置略烦）；
- **`python3 -m http.server`** —— 零安装！
  在文件目录跑一句，同网段浏览器访问 `IP:8000` 下载。
  **临时传文件的极客方案**：

```bash
cd ~/Downloads
python3 -m http.server 8000
# 手机/同事访问 http://你的IP:8000
```

## 二、临时传大文件：免登录网盘

###  wormhole（浏览器版）

[wormhole.app](https://wormhole.app) —— 端到端加密，
10GB 以内，链接或二维码分享。

**特点**：文件不长期存（阅后即焚风格）、免费无账号、
传输走 P2P（不经过服务器存内容）。

### 其他

- **[tmp.link](https://tmp.link)**：国内，免登录临时网盘；
- **[文叔叔](https://wenshushu.cn)**：老牌免登录传文件；
- **[奶牛快传](https://cowtransfer.com)**：曾经的神，
  现在有限制但还能用；
- **Send（Mozilla 已停）**、**Firefox Send 继任者们**：
  理念相同。

**注意**：临时网盘适合「一次性传大文件」，
**别当备份**（说删就删）。

## 三、P2P 与自建：进阶

### send（基于 wormhole 命令行）

```bash
npx magic-wormhole send 文件名
# 生成一个码，对方 npx magic-wormhole 收
```

终端党传输，端到端加密，不经过第三方存储。

### 自建：MinIO / 文件服务器

```bash
# MinIO：S3 兼容的对象存储，Docker 一条命令
docker run -p 9000:9000 minio/minio server /data
```

团队/家庭 NAS 场景。想「自己的百度网盘」：
**Nextcloud**（Docker 部署）或 **Cloudreve**。

## 四、同步与备份：另一回事

「传文件」是一次性，「同步」是持续性：

| 需求 | 工具 |
| --- | --- |
| 个人多设备 | OneDrive/iCloud/坚果云（国内快） |
| 团队协作 | 飞书/钉钉/企业网盘 |
| 代码/文档版本 | **git**（本站就是这么管的） |
| 系统级备份 | Syncthing（P2P 同步，开源）/ restic |
| 相册 | Immich（自建 Google Photos） |

**程序员的核心资产**：代码（git）、笔记（Markdown +
git）、照片（定期冷备）。**网盘是副本不是备份** ——
3-2-1 原则：3 份拷贝、2 种介质、1 份异地。

## 五、命令行传文件（服务器场景）

```bash
# scp：单文件/目录
scp -r ./dist deploy@服务器:/var/www/

# rsync：增量（反复部署用它）
rsync -avz --delete dist/ deploy@服务器:/var/www/

# 断点续传大文件：rsync 的 --partial 或 sz/rz
rsync -avzP big.iso server:/tmp/
```

（服务器部署细节在
[Linux 服务器篇](../linux-server-basic.md)。）

## 六、安全红线

1. **敏感文件别走公共网盘**（临时网盘说泄露就泄露）；
2. **传前想好「这东西公开了会怎样」** ——
   身份证、合同、密钥，走加密通道或线下；
3. **链接设过期/密码**（能设就设）；
4. **公司文件用公司许可的工具**（合规）——
   个人网盘传公司资料，出事背锅。

## 小结

传文件按场景选：**局域网（LocalSend，最快）→
临时大文件（wormhole，免登录）→ 反复部署
（rsync，增量）→ 持续同步（网盘/git）**。
最推荐的三个：LocalSend + wormhole + rsync ——
覆盖九成场景。文件安全一句话：**默认它可能公开，
再决定传什么。**
