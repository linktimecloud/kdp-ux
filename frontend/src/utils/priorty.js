/* istanbul ignore file */
export const priorityToName = (priority) => {
  let p = ''
  switch (priority) {
    case 1:
      p = 'low'
      break
    case 2:
      p = 'medium'
      break
    case 3:
      p = 'high'
      break
    case 4:
      p = 'highest'
      break
    default:
      p = 'medium'
  }
  return p
}
