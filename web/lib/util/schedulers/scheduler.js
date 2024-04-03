const moment = require('moment')
const cron = require('node-cron')

const DEFAULT_CRON_SET = '0 3 * * *'
const DEFAULT_CRON_SETTINFS = {
  scheduled: true,
  timezone: 'Asia/Shanghai'
}

// DAILY_MORNING、DAILY_EVENING、WEEKLY_START、WEEKLY_END
module.exports = (cronSets = DEFAULT_CRON_SET, callback) => {
  return cron.schedule(cronSets, () => {
    const callStartAt = Date.now()
    if (typeof callback === 'function') callback()
    console.log(
      'End scheduler at time => ',
      new Date(),
      ' cost time',
      moment.duration(Date.now() - callStartAt, 'milliseconds').as('seconds'),
      's'
    )
  }, DEFAULT_CRON_SETTINFS)
}
