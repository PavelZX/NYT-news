// «База данных»

const post = {
  title: 'Заголовок статьи',
  body: 'Текст поста о лучшей на свете стране дураков и непуганных идиотов. Все совпадения вымышлены и случайны.'
}

// «Сервер API»

const server = {
  posts(page = 2) {
    const finished = page >= 5
    const next = finished ? null : page + 1
    const posts = Array(100).fill(post)

    return new Promise((resolve) => {
        resolve({posts, next})
    })
  }
}

// Клиент

let nextPage = 2
let isLoading = false
let shouldLoad = true

function appendArticle(articleData) {
  if (!articleData) return;
  const main = document.querySelector('main')
  const articleNode = composeArticle(articleData)
  main.append(articleNode)
}

function composeArticle(articleData) {
  if (!articleData) return
  const template = document.getElementById('article_template')
  const article = template.content.cloneNode(true)

  const {title, body} = articleData
  article.querySelector('h2').innerText = title
  article.querySelector('p').innerText = body

  return article
}

async function fetchArticles() {
  if (isLoading || !shouldLoad) return
  isLoading = true

  const {articles, next} = await server.articles(nextPage)
  nextPage = next

  articles.forEach(appendArticle)

  // Здесь можно менять адресную строку,
  // чтобы сохранить положение прокрутки.

  if (!next) shouldLoad = false
  isLoading = false
}

async function checkPosition() {
  const height = document.body.offsetHeight
  const screenHeight = window.innerHeight
  const scrolled = window.scrollY

  const threshold = height - screenHeight / 4
  const position = scrolled + screenHeight

  if (position >= threshold) {
    await fetchArticles()
  }
}

(() => {
  window.addEventListener('scroll', checkPosition)
  window.addEventListener('resize', checkPosition)
})()
