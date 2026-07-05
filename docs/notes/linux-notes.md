# Linux 笔记

## 常用命令

```bash
# 文件操作
ls -la                      # 列出所有文件
find . -name "*.ts"        # 查找文件
grep -r "keyword" .        # 递归搜索文本
chmod +x script.sh         # 添加执行权限

# 进程管理
ps aux | grep node          # 查找进程
kill -9 <pid>              # 强制终止
htop                        # 交互式进程查看

# 磁盘/内存
df -h                       # 磁盘使用情况
du -sh *                   # 目录大小
free -h                     # 内存使用情况
```

## Shell 脚本

```bash
#!/bin/bash
set -euo pipefail           # 安全模式

# 变量
NAME="world"
echo "Hello, $NAME"

# 条件判断
if [ -f "file.txt" ]; then
    echo "文件存在"
fi

# 循环
for i in {1..5}; do
    echo $i
done

# 函数
greet() {
    echo "Hello, $1"
}
greet "world"
```

## SSH

```bash
# 生成密钥
ssh-keygen -t ed25519 -C "email@example.com"

# 添加到服务器
ssh-copy-id user@host

# 配置文件 ~/.ssh/config
Host myserver
    HostName 123.456.789.0
    User root
    IdentityFile ~/.ssh/id_ed25519
```

## 常用工具

| 工具 | 用途 |
|------|------|
| `tmux` | 终端复用器 |
| `rsync` | 文件同步 |
| `cron` | 定时任务 |
| `systemd` | 服务管理 |
| `journalctl` | 日志查看 |
