import jwtDecode from "jwt-decode"

export const getUserRole = token => {
  if (!token) return -1
  const decoded = jwtDecode(token)
  return decoded["https://hasura.io/jwt/claims"]["x-hasura-default-role"]
}

export const getUserId = token => {
  if (!token) return -1
  const decoded = jwtDecode(token)
  return +decoded["https://hasura.io/jwt/claims"]["x-hasura-user-id"]
}
