# CS2 压枪鼠标宏生成器 - The Implementation Plan (Decomposed and Prioritized Task List)

## [x] Task 1: 项目初始化与基础架构搭建
- **Priority**: high
- **Depends On**: None
- **Description**: 
  - 使用 Vite + React + TypeScript 初始化项目
  - 配置 Tailwind CSS
  - 设置项目目录结构（components, hooks, utils, data等）
  - 安装必要依赖（lucide-react图标库等）
- **Acceptance Criteria Addressed**: NFR-1, NFR-2, NFR-4
- **Test Requirements**:
  - `programmatic` TR-1.1: 项目能成功启动，运行 `npm run dev` 无报错
  - `programmatic` TR-1.2: 构建成功，运行 `npm run build` 无报错
  - `human-judgement` TR-1.3: 目录结构清晰，组件/工具/数据分类合理
- **Notes**: 使用 npm 作为包管理器

## [x] Task 2: 压枪数据获取与管理模块
- **Priority**: high
- **Depends On**: Task 1
- **Description**: 
  - 调研并确认GitHub上可用的CS2压枪数据源
  - 实现从GitHub获取JSON数据的功能（使用fetch API）
  - 实现本地数据缓存（localStorage）
  - 支持手动导入JSON数据文件
  - 定义武器数据的TypeScript类型
- **Acceptance Criteria Addressed**: FR-1, AC-1
- **Test Requirements**:
  - `programmatic` TR-2.1: 成功获取至少5种武器的压枪数据
  - `programmatic` TR-2.2: 数据格式正确解析，包含子弹坐标数组
  - `programmatic` TR-2.3: 数据缓存到localStorage，刷新后仍可用
  - `programmatic` TR-2.4: 支持手动导入JSON文件并解析
- **Notes**: 需处理GitHub API速率限制和CORS问题，考虑使用jsdelivr CDN

## [x] Task 3: 灵敏度换算与压枪计算引擎
- **Priority**: high
- **Depends On**: Task 2
- **Description**: 
  - 实现游戏内灵敏度、DPI到鼠标移动像素的换算公式
  - 实现压枪轨迹计算（反向补偿后坐力）
  - 支持压枪强度百分比调节
  - 支持射速/间隔时间计算
  - 实现多灵敏度批量计算
- **Acceptance Criteria Addressed**: FR-2, FR-7, FR-9, AC-2, AC-7, AC-10
- **Test Requirements**:
  - `programmatic` TR-3.1: 灵敏度换算公式正确，可通过已知数值验证
  - `programmatic` TR-3.2: 压枪强度50%-150%缩放正确
  - `programmatic` TR-3.3: 多灵敏度批量计算输出正确数量的结果
  - `human-judgement` TR-3.4: 计算逻辑清晰易读，有注释说明
- **Notes**: 换算公式：鼠标移动距离 = 后坐力角度 / (灵敏度 * m_yaw * (DPI / 2.54)) 需验证

## [x] Task 4: 武器选择与配置UI组件
- **Priority**: high
- **Depends On**: Task 2
- **Description**: 
  - 武器下拉选择器组件
  - 灵敏度配置面板（游戏灵敏度、DPI、polling rate输入）
  - 压枪强度滑块组件
  - 配置预设保存/加载功能
- **Acceptance Criteria Addressed**: FR-3, FR-8, AC-3, AC-8
- **Test Requirements**:
  - `programmatic` TR-4.1: 武器下拉列表展示所有已加载武器
  - `programmatic` TR-4.2: 切换武器后状态正确更新
  - `programmatic` TR-4.3: 保存预设后可从localStorage读取并恢复
  - `programmatic` TR-4.4: 所有输入控件有正确的类型和范围校验
- **Notes**: 使用React hooks管理状态

## [x] Task 5: 压枪轨迹可视化组件
- **Priority**: high
- **Depends On**: Task 3, Task 4
- **Description**: 
  - 使用Canvas或SVG绘制压枪轨迹
  - 显示每发子弹的位置点和序号
  - 支持轨迹缩放和平移查看
  - 实时响应配置参数变化
- **Acceptance Criteria Addressed**: FR-4, AC-4
- **Test Requirements**:
  - `programmatic` TR-5.1: 轨迹正确显示，起点在原点
  - `programmatic` TR-5.2: 子弹点数量与弹夹容量一致
  - `human-judgement` TR-5.3: 可视化效果清晰美观，颜色对比明显
  - `human-judgement` TR-5.4: 缩放/平移操作流畅
- **Notes**: 优先使用Canvas以获得更好性能

## [x] Task 6: 雷蛇宏生成器
- **Priority**: high
- **Depends On**: Task 3
- **Description**: 
  - 研究Razer Synapse宏文件格式
  - 实现将压枪轨迹转换为雷蛇宏格式
  - 生成可下载的宏文件
  - 支持自定义宏名称和触发键
- **Acceptance Criteria Addressed**: FR-5, AC-5
- **Test Requirements**:
  - `programmatic` TR-6.1: 生成的宏文件格式符合Razer Synapse标准
  - `programmatic` TR-6.2: 宏文件包含正确数量的鼠标移动事件
  - `programmatic` TR-6.3: 移动量与计算结果一致
  - `human-judgement` TR-6.4: 下载功能正常，文件名清晰
- **Notes**: 雷蛇宏通常为XML格式，需确认具体结构

## [x] Task 7: 罗技宏生成器
- **Priority**: high
- **Depends On**: Task 3
- **Description**: 
  - 研究Logitech G HUB Lua脚本格式
  - 实现将压枪轨迹转换为罗技Lua脚本
  - 生成可下载的.lua文件
  - 支持自定义触发键和切换逻辑
- **Acceptance Criteria Addressed**: FR-6, AC-6
- **Test Requirements**:
  - `programmatic` TR-7.1: 生成的Lua脚本语法正确
  - `programmatic` TR-7.2: 使用Logitech G系列API（MoveMouseRelative等）
  - `programmatic` TR-7.3: 移动量与计算结果一致
  - `human-judgement` TR-7.4: 脚本结构清晰，有注释说明用法
- **Notes**: 罗技宏使用Lua脚本，调用G-series Lua API

## [x] Task 8: 风险提示与页面整体布局
- **Priority**: medium
- **Depends On**: Task 1
- **Description**: 
  - 实现首次访问的风险提示弹窗
  - 设计整体页面布局（Header、侧边栏、主内容区）
  - 响应式设计，适配不同屏幕尺寸
  - 页脚添加免责声明
- **Acceptance Criteria Addressed**: AC-9, NFR-3, NFR-5
- **Test Requirements**:
  - `programmatic` TR-8.1: 首次访问显示风险提示，确认后隐藏
  - `programmatic` TR-8.2: 确认状态保存在localStorage
  - `human-judgement` TR-8.3: 页面布局美观，信息层级清晰
  - `human-judgement` TR-8.4: 移动端适配良好
- **Notes**: 风险提示需明确说明可能违反游戏服务条款

## [x] Task 9: 多灵敏度批量生成与下载
- **Priority**: medium
- **Depends On**: Task 6, Task 7
- **Description**: 
  - 多灵敏度输入界面（逗号分隔或多行输入）
  - 批量生成对应宏文件
  - 打包为ZIP下载
  - 文件名包含灵敏度标识
- **Acceptance Criteria Addressed**: FR-9, AC-10
- **Test Requirements**:
  - `programmatic` TR-9.1: 输入N个灵敏度生成N个宏文件
  - `programmatic` TR-9.2: ZIP包解压后文件完整
  - `programmatic` TR-9.3: 文件名包含灵敏度值便于区分
  - `human-judgement` TR-9.4: 批量生成操作流畅，有进度提示
- **Notes**: 使用JSZip库实现打包功能

## [x] Task 10: 整体测试与优化
- **Priority**: medium
- **Depends On**: Task 5, Task 6, Task 7, Task 8, Task 9
- **Description**: 
  - 端到端功能测试
  - 性能优化（减少不必要的重渲染）
  - 边界情况处理（无效输入、网络错误等）
  - 代码清理和优化
- **Acceptance Criteria Addressed**: NFR-1, NFR-2, NFR-3
- **Test Requirements**:
  - `programmatic` TR-10.1: 所有核心功能正常工作
  - `programmatic` TR-10.2: 无效输入有友好提示
  - `programmatic` TR-10.3: 网络失败时有降级方案（使用缓存数据）
  - `human-judgement` TR-10.4: 整体使用体验流畅
- **Notes**: 此任务为集成测试和质量保证
