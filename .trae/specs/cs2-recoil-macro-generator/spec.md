# CS2 压枪鼠标宏生成器 - Product Requirement Document

## Overview
- **Summary**: 一个基于Web的CS2压枪鼠标宏生成器，能够从GitHub获取CS2武器压枪数据JSON，根据用户自定义的灵敏度参数，生成适配雷蛇（Razer）和罗技（Logitech）鼠标的宏文件，帮助玩家实现精准压枪。
- **Purpose**: 为CS2玩家提供便捷的鼠标宏生成工具，根据个人游戏灵敏度自动计算压枪轨迹，支持主流游戏鼠标品牌，降低压枪学习成本。
- **Target Users**: CS2玩家，尤其是使用雷蛇或罗技鼠标、希望通过自定义宏辅助压枪的玩家。

## Goals
- 从GitHub开源项目获取并解析CS2武器压枪数据JSON
- 支持自定义游戏灵敏度、鼠标DPI等参数
- 生成雷蛇（Razer Synapse）兼容的宏文件
- 生成罗技（Logitech G HUB）兼容的宏文件
- 提供可视化的压枪轨迹预览
- 支持多武器切换和配置保存

## Non-Goals (Out of Scope)
- 不提供反作弊绕过功能
- 不直接修改游戏内存或数据
- 不提供自动瞄准/透视等作弊功能
- 不支持除雷蛇、罗技以外的其他品牌鼠标
- 不提供在线多人对战辅助功能
- 不开发桌面客户端，纯Web应用

## Background & Context
- CS2（Counter-Strike 2）中每把武器都有固定的压枪模式（recoil pattern），玩家需要通过向下移动鼠标来补偿后坐力
- 雷蛇和罗技是最主流的游戏鼠标品牌，各自有配套的宏管理软件（Razer Synapse、Logitech G HUB）
- GitHub上已有多个开源项目提供CS2/CS:GO的压枪数据JSON格式
- 压枪效果与游戏内灵敏度、鼠标DPI直接相关，需要精确换算
- 本工具仅供技术研究和离线练习使用，使用宏可能违反游戏服务条款

## Functional Requirements
- **FR-1**: 数据获取与管理 - 从GitHub开源仓库获取CS2武器压枪数据JSON，支持本地缓存和手动导入
- **FR-2**: 灵敏度配置 - 用户可配置游戏内灵敏度、鼠标DPI、 polling rate等参数
- **FR-3**: 武器选择 - 支持选择不同武器（AK-47、M4A4、M4A1-S、Galil、FAMAS等）查看和生成宏
- **FR-4**: 轨迹可视化 - 在画布上动态显示压枪轨迹曲线和每发子弹位置
- **FR-5**: 雷蛇宏生成 - 生成Razer Synapse兼容的宏文件格式（.xml或可导入格式）
- **FR-6**: 罗技宏生成 - 生成Logitech G HUB兼容的宏文件格式（.lua脚本）
- **FR-7**: 宏参数调节 - 支持调整压枪强度百分比、起始延迟、平滑度等参数
- **FR-8**: 配置保存/加载 - 支持保存当前配置为预设，方便快速切换
- **FR-9**: 多灵敏度适配 - 支持输入多个灵敏度配置，批量生成对应宏文件

## Non-Functional Requirements
- **NFR-1**: 性能 - 页面加载时间 < 2s，宏生成响应时间 < 500ms
- **NFR-2**: 兼容性 - 支持Chrome、Firefox、Edge等主流浏览器
- **NFR-3**: 可用性 - 界面简洁直观，操作流程不超过3步即可生成宏
- **NFR-4**: 纯前端 - 所有计算在浏览器端完成，无需后端服务器
- **NFR-5**: 响应式 - 适配桌面端和移动端显示

## Constraints
- **技术**: 纯前端Web应用，使用React + TypeScript + Tailwind CSS
- **业务**: 仅供学习研究使用，需在页面显著位置提示风险
- **依赖**: 
  - GitHub上的开源压枪数据（需确认可用数据源）
  - Razer Synapse宏格式规范
  - Logitech G HUB Lua脚本格式规范

## Assumptions
- GitHub上存在可用的CS2压枪数据JSON开源项目
- 雷蛇和罗技的宏格式有公开的文档或逆向工程资料
- 压枪轨迹可以通过像素移动量精确表示
- 用户了解使用鼠标宏的风险并自愿承担

## Acceptance Criteria

### AC-1: 数据获取与解析
- **Given**: 用户打开应用
- **When**: 应用初始化完成
- **Then**: 成功从GitHub获取至少5种主流武器的压枪数据并展示在武器列表中
- **Verification**: `programmatic`
- **Notes**: 数据需包含AK-47、M4A4、M4A1-S等主流步枪

### AC-2: 灵敏度配置
- **Given**: 用户在灵敏度配置区域输入参数
- **When**: 用户修改游戏内灵敏度、DPI等参数后
- **Then**: 压枪轨迹预览实时更新，移动量按比例换算
- **Verification**: `programmatic`
- **Notes**: 需验证换算公式的正确性

### AC-3: 武器切换
- **Given**: 用户已加载武器数据
- **When**: 用户从下拉列表中选择不同武器
- **Then**: 压枪轨迹预览区域立即更新为对应武器的压枪曲线
- **Verification**: `programmatic`

### AC-4: 轨迹可视化
- **Given**: 用户选择了某把武器
- **When**: 查看轨迹预览区域
- **Then**: 显示清晰的压枪轨迹曲线，标注子弹序号，支持缩放查看
- **Verification**: `human-judgment`
- **Notes**: 轨迹应从原点开始，方向与压枪方向相反（显示补偿方向）

### AC-5: 雷蛇宏生成
- **Given**: 用户配置好灵敏度并选择武器
- **When**: 用户点击"生成雷蛇宏"按钮
- **Then**: 生成可下载的Razer Synapse兼容宏文件，包含正确的鼠标移动序列
- **Verification**: `programmatic`
- **Notes**: 宏文件格式需符合Razer Synapse导入标准

### AC-6: 罗技宏生成
- **Given**: 用户配置好灵敏度并选择武器
- **When**: 用户点击"生成罗技宏"按钮
- **Then**: 生成可下载的Logitech G HUB Lua脚本文件，包含正确的压枪逻辑
- **Verification**: `programmatic`
- **Notes**: Lua脚本需符合Logitech G系列脚本API规范

### AC-7: 压枪强度调节
- **Given**: 用户拖动压枪强度滑块（50%-150%）
- **When**: 调整强度后
- **Then**: 轨迹预览和生成的宏文件中的移动量按比例缩放
- **Verification**: `programmatic`

### AC-8: 配置预设管理
- **Given**: 用户已配置好多组灵敏度参数
- **When**: 用户保存当前配置为预设，之后重新加载
- **Then**: 配置参数完整恢复，与保存时一致
- **Verification**: `programmatic`
- **Notes**: 使用localStorage存储

### AC-9: 风险提示
- **Given**: 用户首次打开应用
- **When**: 页面加载完成
- **Then**: 在显著位置显示使用风险提示，用户需确认后才能使用核心功能
- **Verification**: `human-judgment`

### AC-10: 多灵敏度批量生成
- **Given**: 用户输入多个灵敏度值（如1.0, 1.5, 2.0）
- **When**: 点击批量生成
- **Then**: 打包下载对应每个灵敏度的宏文件，文件名包含灵敏度标识
- **Verification**: `programmatic`

## Open Questions
- [ ] GitHub上具体使用哪个开源项目的压枪数据？需要确认数据格式和可用性
- [ ] 雷蛇宏文件的具体格式是什么？.xml还是其他格式？
- [ ] 罗技宏是使用Lua脚本还是其他格式？
- [ ] 压枪数据的单位是什么（角度？像素？），需要如何换算到鼠标移动量？
- [ ] 是否需要考虑射击间隔（射速）与宏执行延迟的对应关系？
