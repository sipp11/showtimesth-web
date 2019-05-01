
export const imgSrc = imgs => {
  const posters = imgs.filter(img => img.type === "Poster")
  if (posters.length === 0)
    return `https://showtimes.everyday.in.th/static/images/poster-blank-w92.png`
  if (posters.length > 0 && posters[0].source === "tmdb") {
    return `https://image.tmdb.org/t/p/w185/${posters[0].url}`
  }
  // own
  let loc = posters[0].location.split(".")[0]
  return `https://s3-ap-southeast-1.amazonaws.com/showtimesth/_s_/${loc}-thumbnail-185x278-85.jpg`
}

