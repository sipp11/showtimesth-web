import fecha from "fecha"

export const getYear = day => {
  return fecha.format(new Date(day), "YYYY")
}