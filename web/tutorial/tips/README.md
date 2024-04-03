### Tips 使用方式：
 * 每个字段的tips都需要新建一个md文件，并在map.json中新增一条数据

### map.json：维护了字段与文案说明的映射关系
* path：tips内容文件路径 [required]
* type：前端默认的展示方式，可根据内容多少自行更改：tooltip/msgbox/link [required]
* name：字段名称 [optional,目前没有用到]
* link: 跳转链接, 当类型为link的时候必填

