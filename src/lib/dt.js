import fecha from "fecha"

const weekNo = day => {
  var oneJan = new Date(day.getFullYear(), 0, 1)
  return Math.ceil(((day - oneJan) / 86400000 + oneJan.getDay() + 1) / 7)
}

export const getYear = day => {
  return fecha.format(new Date(day), "YYYY")
}

export const getWeek = day => {
  const d = new Date(day)
  return getYear(d) * 100 + weekNo(d)
}

export const getNow = () => {
  return fecha.format(new Date(), "YYYY-MM-DDTHH:mm:ssZZ")
}

export const getToday = () => {
  return fecha.format(new Date(), "YYYY-MM-DD")
}

export const dateFmt = day => {
  return fecha.format(new Date(day), "mediumDate")
}
