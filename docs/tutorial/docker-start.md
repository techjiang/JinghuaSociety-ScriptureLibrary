---
title: Docker 快速上手
createTime: 2026-10-21
permalink: /tutorial/docker-start/
description: 镜像、容器、Dockerfile 与 compose 入门，专治「我这明明能跑」
---

# Docker 快速上手

「我这明明能跑啊！」—— 程序员史上最著名的谎言之一，而 Docker 就是
这句谎言的终结者。它把你的程序和它依赖的一切（库、配置、运行时）
打成一个包，换台机器照样跑。

这篇只讲上手必需的东西。Docker 很深，但日常用到的就那几条命令。

> 测试环境：Docker Desktop 4.x，Windows 11 + WSL2。

## 一、两个核心概念

**镜像（Image）**：一个只读的打包文件，相当于「软件安装包」。
比如 `nginx` 镜像里装着 nginx 和它需要的全部东西。

**容器（Container）**：镜像跑起来的实例，相当于「装好并运行中的程序」。
一个镜像可以同时跑出好几个容器，互不影响。

关系大概是：镜像是类，容器是对象。学过面向对象的应该秒懂。

![镜像与容器的关系](/images/docker-arch.svg)

*图：一个镜像跑出多个互相隔离的容器，删容器不心疼，数据在卷里*

## 二、安装

- **Windows/macOS**：装 Docker Desktop，图形界面，装完重启；
- **Linux**：`sudo apt install docker.io`，然后把当前用户加进 docker 组
  （`sudo usermod -aG docker $USER`，重新登录生效），免得每次敲 `sudo`。

验证：

```bash
docker --version
docker run hello-world
```

第二条命令会拉一个测试镜像跑一下，看到 "Hello from Docker!" 就成了。

## 三、常用命令

```bash
docker ps              # 看正在跑的容器
docker ps -a           # 看所有容器（包括停掉的）
docker images          # 看本地有哪些镜像
docker logs 容器名      # 看容器日志（排查问题第一现场）
docker exec -it 容器名 bash   # 钻进容器里开个 shell
docker stop 容器名      # 停容器
docker rm 容器名        # 删容器（得先停）
docker rmi 镜像名       # 删镜像
```

`docker exec -it` 是神器 —— 程序在容器里跑挂了，直接钻进去看现场，
`ls`、`cat`、`env` 随便查，比在容器外猜强得多。

## 四、第一个 Dockerfile

Dockerfile 就是个「镜像制作说明书」。举个 Node 小项目的例子：

```dockerfile
# 基础镜像：Node 22 官方镜像
FROM node:22-alpine

# 工作目录：容器内的 /app
WORKDIR /app

# 先拷依赖清单，利用缓存加速
COPY package*.json ./
RUN npm ci --only=production

# 再拷源代码
COPY . .

# 声明端口（仅文档作用，实际映射靠 -p）
EXPOSE 3000

# 容器启动时跑什么
CMD ["node", "server.js"]
```

几个注意点：

- `node:22-alpine` 的 alpine 是精简版 Linux，体积小，是首选；
- 先拷 `package.json` 再 `npm install`、最后拷源码 —— 这个顺序能
  最大程度利用构建缓存，源码改了不用重装依赖；
- 一行注释都没白写，Dockerfile 里写注释是好习惯。

构建和运行：

```bash
docker build -t my-node-app .     # -t 给镜像起名，. 是上下文目录
docker run -p 3000:3000 my-node-app
```

`-p 3000:3000` 是端口映射：冒号左边是你电脑的端口，右边是容器里的端口。
少了它，容器跑得再欢你也访问不到。

## 五、数据卷：容器里的数据别当真

容器是「用后即焚」的设计，删了容器，里面产生的数据跟着没。
要持久化，用卷（volume）挂载：

```bash
docker run -p 3000:3000 -v 数据卷名:/app/data my-node-app
```

左边是卷名（Docker 帮你管），右边是容器内的路径。数据库容器必须挂卷，
不然重建一次容器，用户数据全部归零，现场极其惨烈。

开发时还有个常用玩法，把宿主机代码目录挂进去，容器内代码跟着你编辑器
实时变，改完刷新页面就行，不用重启容器：

```bash
docker run -p 3000:3000 -v $(pwd):/app my-node-app
```

> Windows PowerShell 里 `$(pwd)` 不好使，用 `${PWD}` 替代。

## 六、docker-compose：一键起一组

真实项目很少是单容器：Web 服务 + 数据库 + 缓存，一个 `docker-compose.yml`
全管起来：

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:123456@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=123456

volumes:
  pgdata:
```

然后：

```bash
docker compose up -d       # 后台起所有服务
docker compose logs -f     # 看日志
docker compose down        # 全停并删掉
```

`depends_on` 只保证启动顺序，不保证数据库「就绪」。严谨做法是在 web
服务里加重试逻辑，或者用健康检查。生产环境别偷这个懒。

## 七、踩坑记录

**端口被占**：`docker run -p` 报 port is already allocated，说明你电脑上
有程序占了那个端口。换个左边端口，或者 `netstat -ano | findstr 端口号`
（Windows）查是谁。

**容器里连不上 localhost**：容器里的 `127.0.0.1` 是容器自己，不是你的电脑。
要访问宿主机服务，用 `host.docker.internal`（Desktop 版内置）。

**镜像越用越多，磁盘告急**：定期打扫：

```bash
docker system df      # 看看 Docker 占了多大地方
docker system prune   # 清理没用的容器、网络、悬空镜像
```

## 小结

Docker 上手路径：装 Desktop → 跑通 hello-world → 抄一个 Dockerfile →
学会 `-p` 端口映射和 `-v` 数据卷 → 用 compose 起多服务。
剩下的（多阶段构建、网络模式、安全加固）等真实需求来了再查。
记住那句至理名言：**容器是消耗品，数据放卷里**。
