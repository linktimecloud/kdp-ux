export default {
  config: 'Configuration',
  authType: 'Auth Type',
  switchType: 'Switch @:third.authType',
  commonType: 'COMMON',
  commonTip: '@:third.authType: @:third.commonType',
  openidType: 'OpenID',
  openidUser: '@:third.openidType @:common.user',
  ldapType: 'LDAP',
  ldapUser: '@:third.ldapType @:common.user',
  activeProcessing: '@:third.switchType to {type}..',
  activeSuccess: '@:third.switchType to {type} successfully!'
}
