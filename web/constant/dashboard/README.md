## Dashboard文件夹中的JSON配置说明：

每个JSON文件中包含多个面板配置，配置数据存放在`panels`中，`panels`每一项的字段含义如下：

* `title`: 面板标题
* `description`: 面板描述
* `type`(必须): 面板图表类型，目前支持这几种：stat/bargauge/table/timeserise-line
* `gridPos`(必须): 面板的位置信息（24等分）
* `color`: 默认的字体颜色
* `fontSize`: 默认的字体大小
* `unit`: 数值的单位
* `format`: 对返回数据进行格式化处理，支持这几种方式: duration_time/percent/bytes
* `hideTitle`: 是否隐藏面板标题
* `yAxisOverrides`: 在timeserise-line类型的面板中，覆盖默认的图标y轴配置
* `columns`: 在table面板中，所需要的每一列的配置信息
* `targets`(必须): 面板数据请求配置，具体见下方说明


`targets`每一项中的参数说明:

* `datasourceType`(必须): 数据源类型: prometheus/loki
* `expr`(必须): 请求数据表达式
* `refId`: 返回值的Object key，如果没有配置，则使用当前项的索引
* `stepFormat`: 在时间线面板中，需要传入指定的step(单位是秒)数值，对数据进行分割。固定的step值不适用与变化的时间间隔，为了控制返回值的数量，让图表展示更友好，可以通过传入`stepFormat: 'auto'`，进行自动分割，默认分割成40段
* `legendFormat`: 面板图例内容，可以是`{{node}}`，也可以是固定的字符串
* `thresholds`: 数值的阈值规则，大于某个值时，展示什么颜色


i18n说明：
* 涉及到title、description、label、legendFormat等展示文案相关的内容，在前端组件中展示的时候，会优先从`i18n.t(dashboard.${value})`获取，如果在dashboard.js文件中没有定义，那就直接展示`value`

table类型的chart配置说明：
* `columns`：表格中对应的每一列的配置数据
  * `key`(必须): 跟`targets`中的`refId`对应，表示取返回数据中哪个key的数据
  * `label`: 表格中对应列的表头展示，如果设置了 `hidden: true` ，这个值可以忽略
  * `labelTips`: 表头的tooltip提示文案
  * `format`: 当前列数据需要格式化的类型，支持：bytes/percent
  * `align`: 当前列的对齐方式
  * `layout`: 特殊的展示列，对应的前端的组件，当前支持progressBar/resourceColumn。（`progressBar`属于4.0的样式，被4.1中的`resourceColumn`取代了，后续用不上可以删掉）
  * `layoutOptions`: `layout`对应组件中需要的参数



* `templating`: 每个JSON文件中包含多个面板配置，可以共用这一个`templating`
  * `list`: 存放对应面板的筛选项变量配置，如果存在`hidden`不为`true`的项，则会被展示为searchbox在页面上供用户筛选

* `templating list`中每一项的字段含义如下：
  * `name`(必须): 对应的变量名，可用于`targets`的`expr`表达式中
  * `type`: 支持`searchBox`组件所支持的所有筛选项类型
  * `defaultVal`: 默认值
  * `allValue`: 选中‘全部’项的值
  * `label`: 筛选项的文本
  * `options`: 类型为`select`等项所需要的下拉框数组
  * `optionsKey`: 筛选项数组中的`keys`, `label`会从`i18n.t(dashboard.${key})`获取
  * `query`/`datasourceType`: 去请求`prometheus`/`loki`数据，所需要的表达式和类型