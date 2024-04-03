/* eslint-disable no-useless-escape */
const PATTERNS = {
  // required
  filled: /.+/,
  // At least one upper case english letter, (?=.*?[A - Z])
  // At least one lower case english letter, (?=.*?[a - z])
  // At least one digit, (?=.*?[0 - 9])
  // At least one special character, (?=.*?[\.#?!@$%^&*-])
  // Minimum 8 in length.{8,} (with the anchors)
  password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\.#?!@$%^&*-]).{8,}$/,
  // a key name of user defined variable
  keyname: /^[\w.-]*$/,
  linux_user: /^[a-z][a-z0-9-]{7,21}$/,
  // Chinese mobilde number
  mobile: /^1[3|4|5|7|8][0-9]\d{8}$/,
  // email
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  // Chinese ID card number
  idcard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  // local ip hosts
  local_url: /^http:\/\/(localhost)|(127\.)|(192\.168\.)|(10\.)|(172\.1[6-9]\.)|(172\.2[0-9]\.)|(172\.3[0-1]\.)|(::1$)|([fF][cCdD])(:[0-9]+)?\/?(\/[.\w]*)*$/,
  // pure number
  digital: /^[0-9]+$/,
  // number
  numeric: /^[-+]?[0-9]+$/,
  // natural number
  natural: /^\+?[1-9][0-9]*$/,
  // number >= 0
  gte: /^(0|[1-9][0-9]*)$/,
  // amount of money, tofixed(2)
  price: /(^[-+]?[1-9]\d*(\.\d{1,2})?$)|(^[-+]?[0]{1}(\.\d{1,2})?$)/,
  // web address
  url: /^(http\:\/\/|https\:\/\/)(.{4,})$/,
  // custom app name
  app_name: /(^([a-z0-9])([a-z0-9-]*)([a-z0-9])$)|(^[a-z0-9]$)/,
  // 节点标签名以数字、大小写字母开头和结尾，仅支持数字、大小写字母、破折号(-)、下划线(_)、点(.)、斜线(/)的组合，长度小于63
  nodes_key: /^([A-Za-z0-9][\w.\-_/]{0,61})?[A-Za-z0-9]$|^$/,
  // 节点标签值以数字、大小写字母开头和结尾，仅支持数字、大小写字母、破折号(-)、下划线(_)、点(.)的组合，长度小于63
  nodes_value: /^([A-Za-z0-9][\w.\-_]{0,61})?[A-Za-z0-9]$|^$/,
  // 安全组名称 仅可使用小写字母及数字，总长度不可超过 16 个字符
  group_name: /^[a-z][a-z0-9]{0,15}$/,
  // dockerfile应用的网络配置中端口号为数字
  dockerfile_port_regex: /^[1-9]\d*$/,
  // 长度为2-16个字符，以小写字母或数字开头和结尾，且只能包含数字、小写字母和`-`
  bdc_name: /^[a-z0-9](?!.*--)[a-z0-9-]{0,14}[a-z0-9]$/,
  // 长度为2-30个字符，以小写字母或数字开头和结尾，且只能包含数字、小写字母和`-`
  ctx_setting_name: /^[a-z0-9](?!.*--)[a-z0-9-]{0,28}[a-z0-9]$/,
  // 以大小写字母或数字开头和结尾，仅支持数字、大小写字母、破折号(-)、下划线(_)、点(.)、斜线(/)的组合，长度为2-63
  docker_key: /^([A-Za-z0-9][\w.\-_/]{0,61})[A-Za-z0-9]$|^$/,
  // 以大小写字母或数字开头, 以大小写字母结尾，仅支持数字、大小写字母、破折号(-)、下划线(_)、点(.)的组合，长度为2-63
  docker_value: /^(?=[a-zA-Z0-9])[a-zA-Z0-9\-\.\_]{1,61}[a-zA-Z]$/,
  // bdc标签名限制 详情查看 i18n cluster.labelKeyRegText
  bdc_key: /^(((([a-z0-9]([-a-z0-9]*[a-z0-9])?)\.)*([a-z0-9]([-a-z0-9]*[a-z0-9])?))\/)?([a-z0-9]([a-zA-Z0-9\-\.\_]{0,61}[a-z0-9])?)$/
}

export default PATTERNS
