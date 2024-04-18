import { describe, expect, it } from 'vitest'
import {
  formatDecimal,
  formatterAxisLabel,
  formatTableChartValue,
  formatTimeseriseLineStepData,
  getTimeseriseLineSeriesData
} from '@/common/dashboard/utils.js'

describe('formatDecimal', () => {
  it('should return the value as is if the value is not a number', () => {
    const input = 'a'
    expect(formatDecimal(input)).toBe(input)
  })

  it('should return a two decimal point number if the value is greater than 1', () => {
    const input = 1.234
    const expectedOutput = 1.23
    expect(formatDecimal(input)).toBe(expectedOutput)
  })

  it('should return a two decimal point number with preceding zeros if the value is less than 1', () => {
    const input = 0.000045678
    const expectedOutput = 0.000045
    expect(formatDecimal(input)).toBe(expectedOutput)
  })
})

describe('formatterAxisLabel', () => {
  it('check type is percent', () => {
    const config = { format: 'percent' }
    expect(formatterAxisLabel(config, 0.123)).toBe('0.1%')
  })

  it('check type is bytes', () => {
    const config = { format: 'bytes' }
    expect(formatterAxisLabel(config, 123456)).toBe('120.6 KiB')
  })

  it('check type is bytes_rate', () => {
    const config = { format: 'bytes_rate' }
    expect(formatterAxisLabel(config, 123456)).toBe('120.56 KiB/s')
  })

  it('check type is time_ms', () => {
    const config = { format: 'time_ms' }
    expect(formatterAxisLabel(config, 123456)).toBe('123456000 ms')
  })

  it('check type is unknown', () => {
    const config = { format: 'unknown' }
    expect(formatterAxisLabel(config, 123456)).toBe(123456)
  })
})

describe('formatTableChartValue', () => {
  it('check type is percent', () => {
    const column = { format: 'percent', key: 'value' }
    const item = { value: 0.123 }
    expect(formatTableChartValue(column, item)).toBe('0.1%')
  })

  it('check type is bytes', () => {
    const column = { format: 'bytes', key: 'value' }
    const item = { value: 123456 }
    expect(formatTableChartValue(column, item)).toBe('120.56 KiB')
  })

  it('check type is bytes_rate', () => {
    const column = { format: 'bytes_rate', key: 'value' }
    const item = { value: 123456 }
    expect(formatTableChartValue(column, item)).toBe('120.56 KiB/s')
  })

  it('check type is duration_time', () => {
    const column = { format: 'duration_time', key: 'value' }
    const item = { value: 123456 }
    expect(formatTableChartValue(column, item)).toBe('1.4 天')
  })

  it('check type is unknown', () => {
    const column = { format: 'unknown', key: 'value' }
    const item = { value: 123456 }
    expect(formatTableChartValue(column, item)).toBe(123456)
  })
})

describe('formatTimeseriseLineStepData', () => {
  it('should return the list as is if the step is not provided', () => {
    const list = [[1, 2], [3, 4]]
    expect(formatTimeseriseLineStepData(list)).toEqual([[1000, 2], [3000, 4]])
  })

  it('should return the list with null values for missing steps', () => {
    const list = [[1, 2], [3, 4]]
    const step = 1
    expect(formatTimeseriseLineStepData(list, step)).toEqual([[1000, 2], [2000, null], [3000, 4]])
  })
})

describe('getTimeseriseLineSeriesData', () => {
  it('should return an empty array if dataResults is not provided', () => {
    expect(getTimeseriseLineSeriesData()).toEqual([])
  })

  it('should return an empty array if dataResults is an empty array', () => {
    expect(getTimeseriseLineSeriesData([])).toEqual([])
  })

  it('should return an array of series data', () => {
    const dataResults = [
      {
        target: {
          chartOptions: { color: 'red' },
          legendFormat: 'count',
          step: 1
        },
        result: [
          {
            metric: { name: 'metric1' },
            values: [[1, 2], [3, 4]]
          }
        ]
      }
    ]
    expect(getTimeseriseLineSeriesData(dataResults)).toEqual([
      {
        smooth: true,
        color: 'red',
        name: 'count',
        data: [[1000, 2], [2000, null], [3000, 4]],
        connectNulls: false
      }
    ])
  })
})