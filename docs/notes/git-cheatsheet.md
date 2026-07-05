# Git 常用命令

## 基础操作

```bash
# 初始化仓库
git init

# 克隆仓库
git clone <url>

# 查看状态
git status

# 添加文件到暂存区
git add <file>
git add .                    # 添加所有修改

# 提交
git commit -m "commit message"
git commit --amend           # 修改上次提交
```

## 分支管理

```bash
# 查看分支
git branch                   # 本地分支
git branch -r               # 远程分支
git branch -a               # 所有分支

# 创建/切换分支
git branch <name>
git checkout <name>
git checkout -b <name>      # 创建并切换

# 合并分支
git merge <branch>
git rebase <branch>

# 删除分支
git branch -d <name>        # 本地
git push origin --delete <name>  # 远程
```

## 远程仓库

```bash
# 添加远程仓库
git remote add origin <url>

# 推送/拉取
git push origin main
git pull origin main

# 查看远程仓库
git remote -v
```

## 撤销操作

```bash
# 撤销工作区修改
git checkout -- <file>
git restore <file>

# 撤销暂存区
git reset HEAD <file>
git restore --staged <file>

# 回退版本
git reset --soft HEAD^      # 保留修改
git reset --hard HEAD^      # 丢弃修改

# 查看历史
git log --oneline --graph --all
git reflog                   # 查看所有操作记录
```

## 高级技巧

```bash
# 交互式暂存
git add -p

# 挑选提交
git cherry-pick <commit>

# 储藏修改
git stash
git stash pop

# 合并多个提交
git rebase -i HEAD~3
```
