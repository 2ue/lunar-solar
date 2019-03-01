#!/bin/sh

echo "拉取项目更新===>"
git pull -p
echo "开始添加文件===>"
git add .
echo -n "请填写提交信息（默认信息为updated）："
read remarks
if [ ! -n "$remarks" ];then
	remarks="updated"
fi
git commit -m "$remarks"
echo "开始提交代码====>"
git push
echo "=== END 代码提交成功，正在关闭 END ==="
