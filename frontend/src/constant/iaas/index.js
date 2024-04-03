export const MODE_LIST = () => (['add', 'scale'])

export const DEFAULT_STACKNAME = () => 'Linktime_Aliyun_Default_Stack_To_Scale'
export const DEFAULT_REGION = () => 'cn-shanghai'

export const UP_FORM = () => ({
  accessKeyID: '',
  accessKeySecret: '',
  scaleMode: 'up',
  scaleNodes: '5'
})

export const DOWN_FORM = () => ({
  accessKeyID: '',
  accessKeySecret: '',
  scaleMode: 'down',
  scaleNodes: '0'
})
