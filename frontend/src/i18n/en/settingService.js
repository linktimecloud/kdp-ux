export default {
  title: 'BDOS Application Portal',
  description: 'Powerful, secure, and stable data applications and services',
  searchName: 'Search name',
  touchCustomize: 'Initial Configuration',
  shortName: 'Short Name',
  quick: {
    link: 'Link',
    app: 'Cluster Application',
    url: 'URL',
    fromApp: 'From',
    isCluster: 'Configure address using cluster',
    enabldCross: 'Enable single sign-on (SSO)',
    entry: 'Quick Entry',
    addEntry: '@:common.add @:settingService.quick.entry',
    enable: 'enable',
    bgColor: 'Bgcolor',
    selectImg: 'Select Img',
    imgLimit: 'Upload a 60 * 60 pixel png image',
    toConfig: 'To Configuration',
    customParams: 'Custom Params',
    preview: 'App url preview',
    appNamePlaceholder: 'Please enter the correct app name',
    previewUrlTips: 'If the url does not meet the expectation, please confirm whether the selected security group and the entered application name are correct and the application is running',
    emptyUrl: 'Get url is empty'
  },
  quickTag: {
    all: 'All',
    dataops: 'BDOS Dataops Core Tools',
    bigdata: 'Big Data Integration Tools',
    thirdtools: 'Third-party Integration Tool',
    other: 'Other'
  },
  enableClusterDomainTips: 'After the cluster configuration address is enabled, the corresponding application domain in the cluster configuration management data in the PAAS platform will be taken as the URL of the portal. Generally, the currently configured application belongs to the system application under the admin group. When it is not enabled by default, the application settings.lables.BDOS will be selected_ APP_ HOMEPAGE is the URL of the entry.',
  plzSelectCusParamsTemplate: 'Select a custom parameter template',
  plzInputAccordingtoTemplate: 'Please input params according to template:',
  hueSupersetDsc: 'Login_user is the user name of the switched role, onelogin_user is the user name of the current login',
  jupyterlabDsc: 'Token is user third jupyter token',
  mlflowDsc: 'SuffixPath is fixed, token is user third mlfolw token',
  oem: {
    oemName: 'OEM Config',
    touch: 'Create @:settingService.oem.oemName',
    title: 'Title',
    icon: 'LOGO',
    home: 'Home Page',
    favicon: 'Favicon',
    features: 'Global Switch',
    logoTips: '* The options in the drop-down box are sourced from the list of images below, if no data is available, please upload them first. logo is recommended to choose the size: 100 * 40 px, format .png'
  },
  emptyData: 'No data (The system default configuration will be used)',
  clearForm: 'Clear Config',
  settingContent: 'Config Center',
  imgList: 'Image List',
  imgName: 'Image Name',
  imgDeleteTips: 'The current image is being used as a configuration, please change the configuration before deleting',
  uploadImg: 'Upload images',
  uploadTips: 'Uploading files with the same name will be overwritten. The file name cannot contain spaces, if it does, it will be filtered',
  uploadImgTypeTips: 'Can support all image types of files, file names only support Chinese characters, numbers, upper/lower case letters, -, _ combination, and -, _ can not be at the beginning and end',
  uploadImgErrorTips: 'The file name is illegal, @:settingService.uploadImgTypeTips',
  pleaseSelectOrg: 'Please select an organization first',
  featureLabel: {
    LANG: 'Switch Language',
    MANUAL: 'Manual',
    AVATAR: 'User Avatar',
    RSAKEY: 'User RSA',
    TICKETS: 'Tickets',
    ISSUES: 'Issues',
    BDTJ: 'Baidu Statistics',
    BDTJTRACKID: 'Baidu TrackId',
    NODEMANAGER: 'Node Management',
    NODESCALE: 'Node Scale'
  },
  featureTips: {
    LANG: 'After opening, the English and Chinese portal will be displayed in the top navigation bar of the page',
    MANUAL: 'After opening, the operation manual entry will be displayed in the navigation bar at the top of the page',
    AVATAR: 'After opening, the user-defined avatar will be displayed in the upper left corner of the page, and the avatar can be updated',
    RSAKEY: 'After it is enabled and the idRsa field in the current user data has a value, the RSA key will be displayed in the user details pop-up box',
    TICKETS: 'After opening, the entry for submitting work orders will be displayed in the navigation bar at the top of the page',
    ISSUES: 'After opening, the feedback and suggestion entry will be displayed in the navigation bar at the top of the page',
    BDTJ: 'After opening, Baidu statistics script will be used',
    BDTJTRACKID: 'Please enter the trackId of Baidu statistics',
    NODEMANAGER: 'When enabled, users are allowed to add and edit cluster nodes',
    NODESCALE: 'When enabled, users will be allowed to scale the cluster nodes'
  },
  policies: {
    resource: 'Feature/Component',
    people: 'People',
    deny: 'Deny',
    grant: 'Grant',
    readonly: 'Readonly',
    policy: 'Policy',
    menu: 'Menu',
    all: 'All',
    notAdmin: 'Not Admin',
    noOrg: 'No Org User',
    noEnabled: 'No Enabled',
    globalRole: 'Global Role'
  },
  exportPoliciesTips: 'Export the current policy configuration, the export format is .json file',
  importPoliciesTitle: 'Import completion details',
  importPoliciesSuccessNum: 'Import successful policy: {num}',
  importPoliciesFailedNum: 'Import failed policy: {num}',
  exportOemTips: 'Export the current organization\'s personalized configuration, the export format is a compressed package of .zip type',
  exportOemEmptyTips: 'No OEM configuration to export',
  importOemConfirmTips: 'Confirm to import the configuration in the currently selected organization? If there is a configuration file with the same name, it will be overwritten. Continue?',
  importOemEmptyTips: 'The configuration imported at this time does not have any valid data, please confirm and re-import',
  importInitTips: 'Please create OEM configuration for initialization, and then import operation'
}
