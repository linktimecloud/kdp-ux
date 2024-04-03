export const TOKEN_PATTERN = /Bearer /g
export const TOKEN_PREFIX = 'Bearer '
export const TOKEN_KEY = 'AUTH_TOKEN'

export const tokenClean = token => {
  if (token && token.includes(TOKEN_PREFIX)) {
    token = token.replace(TOKEN_PATTERN, '').trim()
  }
  return token
}
