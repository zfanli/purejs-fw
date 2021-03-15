# purejs-fw

一些项目由于特殊需求，要求使用比较窄的技术栈实现通用的功能。

通常这些要求可能是：

- 使用纯 JS 作业（没有 node.js 环境）
- 导入框架受限（可以使用 jQuery，或者不能）
- 需求功能复杂（复杂的 stateful 组件、动画等）

在 React.js 或 Vue.js 下难度较低的作业突然转到纯 JS 上，也是有点措手不及，在找回熟悉度之前进展都不算理想。

这里记录一个插件框架在仅使用 jQuery 的场景满足这些业务需求。

- 闭包，避免命名空间污染
- 标准化，统一注册和调用接口
- 扩展性，最小受限

## jQuery UI Widget 框架

在深入了解之后发现，jQuery UI 的 Widget 框架足够完善，可以覆盖一般项目的需求。

而仔细思考下决定，对 Widget 框架的插件绑定和参数校验方面进行一些扩展，对插件对使用进行简化，定义严格的类型校验缩短排错时间。

- 插件绑定：使用 `data-*` 前缀属性进行插件绑定
  - 好处：方便简洁、无需额外 JS 代码绑定
  - 弊端：命名空间限制，只能同时绑定一个插件，如需多个插件绑定到同一个元素还是需要 JS 代码
- 参数校验：对插件初始化、状态变更时的传参进行校验，校验条件在插件开发时决定
  - 好处：参数类型不匹配时第一时间报错，加速排错
  - 弊端：应用校验需要在开发时定义参数的校验条件

> 一个小插曲。
>
> 在没有深入了解 jQuery UI 之前，我的想法是构思一个能覆盖大部分场景的插件系统，插件可以保存状态、进行参数校验，并且针对每次数据的变动进行 UI 的刷新。
>
> 这个思路来源于使用 React 等前端框架的直觉和经验，但是随着深入阅读 jQuery UI 的文档发现，它构建的 Widget 框架几乎覆盖了我的思路，并且对其中很多不完善的地方都有独特的思考。
>
> 让我意识到学习它的实现方法对使用纯 JS 开发来说是非常有益的。
>
> 于是我开始转变思路，决定完全使用 Widget 框架作为 base 进行开发，将项目的独特需求作为扩展加入其中。
>
> 以此达到最小作业量实现最多功能的目的。

## License

- jQuery, jQuery UI -> MIT
