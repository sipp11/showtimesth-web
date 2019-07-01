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

export const isJwtExpired = (error, client, basic, history) => {
  if (error && error.name === "Error" && error.message.indexOf("JWTExpired")) {
    setTimeout(() => {
      basic.logout(client)
      history.push("/login")
    }, 500)
    return false
  }
  return true
}
