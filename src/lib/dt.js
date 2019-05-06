import fecha from "fecha"

Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(), 0, 1)
  return Math.ceil(((this - onejan) / 86400000 + onejan.getDay() + 1) / 7)
}

export const getYear = day => {
  return fecha.format(new Date(day), "YYYY")
}

export const getWeek = day => {
  return new Date(day).getWeek()
}

export const getNow = () => {
  return fecha.format(new Date(), "YYYY-MM-DDTHH:mm:ssZZ")
}

export const getToday = () => {
  return fecha.format(new Date(), "YYYY-MM-DD")
}
