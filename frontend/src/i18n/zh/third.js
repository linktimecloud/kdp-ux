export default {
  config: '配置',
  authType: '验证类型',
  switchType: '切换@:third.authType',
  commonType: '普通',
  commonTip: '@:third.authType: @:third.commonType',
  openidType: 'OpenID',
  openidUser: '@:third.openidType @:common.user',
  ldapType: 'LDAP',
  ldapUser: '@:third.ldapType @:common.user',
  activeProcessing: '正在@:third.switchType至 {type} ..',
  activeSuccess: '成功@:third.switchType为{type}'
}
