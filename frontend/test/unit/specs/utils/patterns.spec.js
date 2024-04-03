import PATTERNS from '@/utils/patterns'

describe('PATTERNS', () => {
  test('loaded', () => {
    expect(typeof PATTERNS).toBe('object')
  })
  // not false
  test('filled ok', () => {
    expect(PATTERNS.filled.test('')).toBe(false)
    expect(PATTERNS.filled.test('s')).toBe(true)
  })
  // At least one upper case english letter, (?=.*?[A - Z])
  // At least one lower case english letter, (?=.*?[a - z])
  // At least one digit, (?=.*?[0 - 9])
  // At least one special character, (?=.*?[\.#?!@$%^&*-])
  // Minimum 8 in length.{8,} (with the anchors)
  test('password ok', () => {
    expect(PATTERNS.password.test('')).toBe(false)
    expect(PATTERNS.password.test('s1232!ab.caA')).toBe(true)
  })
  // check chinese mobile number
  test('mobile ok', () => {
    expect(PATTERNS.mobile.test('13300000000')).toBe(true)
    expect(PATTERNS.mobile.test('110')).toBe(false)
  })
  // check email
  test('email ok', () => {
    expect(PATTERNS.email.test('test123@163.co.uk')).toBe(true)
    expect(PATTERNS.email.test('abc')).toBe(false)
  })
  // check Chinese ID card number
  test('idcard ok', () => {
    expect(PATTERNS.idcard.test('42010119990909654X')).toBe(true)
    expect(PATTERNS.idcard.test('6785')).toBe(false)
  })
  // check pure number
  test('digital ok', () => {
    expect(PATTERNS.digital.test('000222111')).toBe(true)
    expect(PATTERNS.digital.test('s')).toBe(false)
  })
  // check numeric
  test('numeric ok', () => {
    expect(PATTERNS.numeric.test('-222111')).toBe(true)
    expect(PATTERNS.numeric.test('11.22')).toBe(false)
  })
  // check natural number
  test('natural number ok', () => {
    expect(PATTERNS.natural.test('222111')).toBe(true)
    expect(PATTERNS.natural.test('0')).toBe(false)
  })
  // check number >= 0
  test('gte ok', () => {
    expect(PATTERNS.gte.test('222111')).toBe(true)
    expect(PATTERNS.gte.test('-1')).toBe(false)
  })
  // check amount of money, tofixed(2)
  test('price ok', () => {
    expect(PATTERNS.price.test('22211.21')).toBe(true)
    expect(PATTERNS.price.test('2222.2222')).toBe(false)
  })
  // check web address
  test('web address ok', () => {
    expect(PATTERNS.url.test('https://mail.google.co.jp/chrome')).toBe(true)
    expect(PATTERNS.url.test('baidu.com')).toBe(false)
  })

  test('nodes_key ok', () => {
    expect(PATTERNS.nodes_key.test('a.a/test_test/test-test.test')).toBe(true)
    expect(PATTERNS.nodes_key.test('a.a/test_test/test-test.test-')).toBe(false)
  })

  test('nodes_value ok', () => {
    expect(PATTERNS.nodes_value.test('a.a-test_test-test-test.test')).toBe(true)
    expect(PATTERNS.nodes_value.test('a.a/test_test/test-test.test')).toBe(false)
  })

  test('group_name ok', () => {
    expect(PATTERNS.group_name.test('test111')).toBe(true)
    expect(PATTERNS.group_name.test('TEST')).toBe(false)
    expect(PATTERNS.group_name.test('testtesttesttesttest1111111111111111')).toBe(false)
  })

  test('dockerfile_port_regex ok', () => {
    expect(PATTERNS.dockerfile_port_regex.test('11.//')).toBe(false)
    expect(PATTERNS.dockerfile_port_regex.test('12345')).toBe(true)
  })
})
