import { tokenClean } from '@/store/utils/token'

const NONE_TOKEN = null
const DUPLICATED_PRIFIX = 'Bearer Bearer Bearer Bearer Bearer Bearer Bearer       12345      '
const NO_PRIFIX = '12345'

describe('Token.js', () => {
  test('tokenClean is OK', done => {
    expect(tokenClean(NONE_TOKEN)).toBe(null)

    expect(tokenClean(DUPLICATED_PRIFIX)).toBe('12345')

    expect(tokenClean(NO_PRIFIX)).toBe('12345')

    done()
  })
})
