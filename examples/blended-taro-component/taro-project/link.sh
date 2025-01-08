#!/bin/bash

# 检查参数数量
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <0|1>"
  exit 1
fi

# 定义要链接的 npm 包
PACKAGES=(
  "@jdtaro/plugin-component-mock"
  "@jdtaro/plugin-intl"
)

LOG_PREFIX='================================='
LOG_POSTFIX='================================'

# 执行链接或取消链接操作
if [ "$1" -eq 1 ]; then
  echo "${LOG_PREFIX} Linking packages... ${LOG_POSTFIX}"
  for PACKAGE in "${PACKAGES[@]}"; do
    yarn link "$PACKAGE"
    echo "${LOG_PREFIX} Linking $PACKAGE ${LOG_POSTFIX}"
    ls -l node_modules/@jdtaro
  done
elif [ "$1" -eq 0 ]; then
  echo "${LOG_PREFIX} Unlinking packages... ${LOG_POSTFIX}"
  for PACKAGE in "${PACKAGES[@]}"; do
    yarn unlink "$PACKAGE"
    echo "${LOG_PREFIX} Unlinking $PACKAGE ${LOG_POSTFIX}"
    ls -l node_modules/@jdtaro
  done
else
  echo "Invalid argument. Use 0 to unlink or 1 to link."
  exit 1
fi