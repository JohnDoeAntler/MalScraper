const axios = require('axios')
const cheerio = require('cheerio')
const { getResultsFromSearch } = require('./info.js')

const ANIME_BASE_URI = 'https://myanimelist.net/anime/'
const MANGA_BASE_URI = 'https://myanimelist.net/manga/'

const parsePage = ($) => {
  const items = $('#content .js-picture-gallery img')
  const result = []

  items.each(function () {
    result.push({
      imageLink: $(this).attr('data-src').trim()
    })
  })

  return result
}

const searchPage = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(({ data }) => {
        const $ = cheerio.load(data)
        const res = parsePage($)
        resolve(res)
      })
      .catch(/* istanbul ignore next */ (err) => reject(err))
  })
}

const getPicturesFromName = (type, name) => {
  return new Promise((resolve, reject) => {
    getResultsFromSearch(name, type)
      .then((items) => {
        const { url } = items[0]

        searchPage(`${encodeURI(url)}/pics`)
          .then((data) => resolve(data))
          .catch(/* istanbul ignore next */ (err) => reject(err))
      })
      .catch(/* istanbul ignore next */ (err) => reject(err))
  })
}

const getPicturesFromNameAndId = (type, id, name) => {
  return new Promise((resolve, reject) => {
    const baseUrl = type === 'anime' ? ANIME_BASE_URI : MANGA_BASE_URI

    searchPage(`${baseUrl}${id}/${encodeURI(name)}/pics`)
      .then((data) => resolve(data))
      .catch(/* istanbul ignore next */ (err) => reject(err))
  })
}

const getPictures = (type) => (obj) => {
  return new Promise((resolve, reject) => {
    if (!obj) {
      reject(new Error('[Mal-Scraper]: No id nor name received.'))
      return
    }

    if (typeof obj === 'object' && !obj[0]) {
      const { id, name } = obj

      if (!id || !name || isNaN(+id) || typeof name !== 'string') {
        reject(
          new Error(
            '[Mal-Scraper]: Malformed input. ID or name is malformed or missing.'
          )
        )
        return
      }

      getPicturesFromNameAndId(type, id, name)
        .then((data) => resolve(data))
        .catch(/* istanbul ignore next */ (err) => reject(err))
    } else {
      getPicturesFromName(type, obj)
        .then((data) => resolve(data))
        .catch(/* istanbul ignore next */ (err) => reject(err))
    }
  })
}

const getMangaPictures = getPictures('manga')
const getAnimePictures = getPictures('anime')

module.exports = {
  getPictures,
  getAnimePictures,
  getMangaPictures
}
