const test = require('ava')
const { getAnimePictures, getMangaPictures } = require('../src')

const NS = {
  name: 'Ginga Eiyuu Densetsu',
  id: 820
}

const KITAKAWA = {
  name: 'Kitanai Kimi ga Ichiban Kawaii',
  id: 120492
}

test.beforeEach(async (t) => {
  await new Promise((resolve) => setTimeout(resolve, 5000))
})

test('getPictures returns the pictures for Ginga Eiyuu Densetsu with ID and name', async (t) => {
  try {
    const data = await getAnimePictures({
      name: NS.name,
      id: NS.id
    })

    t.is(typeof data, 'object')
    t.is(
      data[0].imageLink,
      'https://cdn.myanimelist.net/images/anime/8/9568.jpg'
    )
    t.is(
      data[1].imageLink,
      'https://cdn.myanimelist.net/images/anime/13/13225.jpg'
    )
  } catch (e) {
    t.fail()
  }
})

test('getPictures returns the pictures for Kitanai Kimi ga Ichiban Kawaii with ID and name', async (t) => {
  try {
    const data = await getMangaPictures({
      name: KITAKAWA.name,
      id: KITAKAWA.id
    })

    t.is(typeof data, 'object')

    t.is(
      data[0].imageLink,
      'https://cdn.myanimelist.net/images/manga/2/228905.jpg'
    )
    t.is(
      data[1].imageLink,
      'https://cdn.myanimelist.net/images/manga/2/257031.jpg'
    )
  } catch (e) {
    t.fail()
  }
})

test('getPictures returns the pictures for Ginga Eiyuu Densetsu with name only', async (t) => {
  try {
    const data = await getAnimePictures(NS.name)

    t.is(typeof data, 'object')
    t.is(
      data[0].imageLink,
      'https://cdn.myanimelist.net/images/anime/8/9568.jpg'
    )
    t.is(
      data[1].imageLink,
      'https://cdn.myanimelist.net/images/anime/13/13225.jpg'
    )
  } catch (e) {
    t.fail()
  }
})

test('getPictures returns an error if called with no arguments', async (t) => {
  try {
    await getAnimePictures()
  } catch (e) {
    t.true(e.message === '[Mal-Scraper]: No id nor name received.')
  }
})

test('getPictures returns an error if called with malformed object', async (t) => {
  try {
    await getAnimePictures({ name: NS.name })
  } catch (e) {
    t.true(
      e.message ===
        '[Mal-Scraper]: Malformed input. ID or name is malformed or missing.'
    )
  }
})
