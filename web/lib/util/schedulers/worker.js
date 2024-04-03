const moment = require('moment')

const { Op, Log } = require(global.MODELPATH)

const schedulerWorker = () => {
  return async () => {
    const schedules = [
      {
        type: 'NIGHTLY',
        name: '数据库 Logs 表自动清理任务',
        func: async () => {
          const where = {
            level: {
              [Op.notIn]: ['ERROR', 'SUCCESS', 'CRITICAL', 'FATAL']
            },
            updatedAt: {
              [Op.lt]: moment().subtract(1, 'months').toDate()
            }
          }
          const count = await Log.destroy({ where })
          console.log(`Prune ${count} logs <== `, where)
        }
      }
    ]

    schedules.forEach(s => {
      schedulerExecuter(s)
    })
  }
}

const schedulerExecuter = async (schedule, force = false) => {
  if (!schedule) return

  if (!force) { // 强制执行时略过筛选执行的判断条件
    if (!['NIGHTLY'].includes(schedule.type)) return // 当前仅支持每日工作汇总
  }

  console.log(`${schedule.type} Scheduler ${schedule.name} started`)

  if (typeof schedule.func === 'function') await schedule.func()
}

module.exports = { schedulerWorker, schedulerExecuter }
