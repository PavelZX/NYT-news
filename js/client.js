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

  const {title, body, likes, rearticles} = articleData
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

function throttle(callee, timeout) {
  let timer = null

  return function perform(...args) {
    if (timer) return

    timer = setTimeout(() => {
      callee(...args)

      clearTimeout(timer)
      timer = null
    }, timeout)
  }
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
  window.addEventListener('scroll', throttle(checkPosition))
  window.addEventListener('resize', throttle(checkPosition))
})()