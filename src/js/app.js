import onChange from 'on-change'
import i18next from 'i18next'
import { v4 as uuidv4 } from 'uuid'
import state from '../models/state.js'
import resources from '../locales/ru.js'
import parser from '../util/parser.js'
import initValidation from '../util/validation.js'
import renderErrors from '../renderers/errors.js'
import renderFeeds from '../renderers/feeds.js'
import renderPosts from '../renderers/posts.js'
import renderModal from '../renderers/modal.js'
import renderViewedPost from '../renderers/post.js'

const i18nInstance = i18next.createInstance()
i18nInstance.init({
  lng: 'ru',
  debug: false,
  resources,
})

const validationSchema = initValidation(i18nInstance)

const formWatcher = onChange(state.form, (path, value) => {
  if (path === 'error') {
    renderErrors(value, i18nInstance, state.process.status)
  }
})

const uiStateWatcher = onChange(state.uiState, (path) => {
  if (path.startsWith('modal')) {
    renderModal(state.uiState.modal, state.data.posts)
  }
})

const handleClose = () => {
  uiStateWatcher.modal.isOpen = false
  uiStateWatcher.modal.postId = null
}

const handleOpenModal = (postId, showModal = true) => {
  uiStateWatcher.viewedPosts.add(postId)
  const posts = document.querySelectorAll('.list-group-item')
  renderViewedPost(posts, postId)

  uiStateWatcher.modal = {
    isOpen: showModal,
    postId,
  }
}

const dataWatcher = onChange(state.data, (path, value) => {
  console.log('Data changed:', path, value)
  if (path === 'feeds') {
    renderFeeds(state.data.feeds)
  }
  if (path === 'posts') {
    renderPosts(state.data.posts, state.uiState.viewedPosts, handleOpenModal)
  }
})

const processWatcher = onChange(state.process, (path, value) => {
  const submitButton = document.querySelector('.rss-form .btn-primary')
  if (path === 'status') {
    submitButton.disabled = state.process.status === 'processing'
  }
  if (path === 'error') {
    renderErrors(value, i18nInstance, state.process.status)
  }
})

const validateUrl = (url) => {
  const schema = validationSchema(state.data.feeds)
  return schema.validate({ url }, { abortEarly: false })
}

const updateFeeds = () => {
  if (state.data.feeds.length === 0) {
    setTimeout(updateFeeds, 5000)
    return
  }

  const promises = state.data.feeds.map((feed) => fetch(
    `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feed.url)}`,
  )
    .then((response) => {
      if (response.ok) return response.json()
      throw new Error('Network response was not ok.')
    })
    .then((data) => {
      const { posts: newPosts } = parser(
        data,
        feed.url,
        i18nInstance,
        feed.id,
      )

      const existingLinks = new Set(
        state.data.posts
          .filter((post) => post.idFeed === feed.id)
          .map((post) => post.link),
      )

      const uniqueNewPosts = newPosts.filter(
        (post) => !existingLinks.has(post.link),
      )

      if (uniqueNewPosts.length > 0) {
        dataWatcher.posts = [...uniqueNewPosts, ...state.data.posts]
      }
    })
    .catch((err) => console.error(`Ошибка обновления фида ${feed.url}:`, err)))
  Promise.all(promises).finally(() => setTimeout(updateFeeds, 5000))
}

export default () => {
  const form = document.querySelector('.rss-form')
  const inputForm = document.getElementById('url-input')

  const handleBtn = (e) => {
    e.preventDefault()
    const { value } = inputForm
    const url = value.trim()
    processWatcher.status = 'filling'
    processWatcher.error = ''
    formWatcher.error = ''

    validateUrl(url)
      .then(({ isValid, error }) => {
        formWatcher.isValid = isValid
        formWatcher.error = error
        if (isValid) {
          processWatcher.status = 'processing'
          return fetch(
            `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`,
          )
            .then((response) => {
              if (response.ok) {
                return response.json()
              }
              throw new Error('Network response was not ok.')
            })
            .then((data) => {
              const feedId = uuidv4()
              const { feed, posts } = parser(data, url, i18nInstance, feedId)
              processWatcher.status = 'success'
              dataWatcher.feeds = [feed, ...state.data.feeds]
              dataWatcher.posts = [...posts, ...state.data.posts]
              processWatcher.error = null

              inputForm.value = ''
              inputForm.focus()
            })
            .catch((err) => {
              processWatcher.status = 'failed'
              if (err.message === i18nInstance.t('error.no_rss')) {
                processWatcher.error = i18nInstance.t('error.no_rss')
              } else {
                processWatcher.error = i18nInstance.t('error.network_error')
              }
            })
        }
      })
  }

  form.addEventListener('submit', handleBtn)
  const closeButtons = document.querySelectorAll('[data-bs-dismiss="modal"]')
  closeButtons.forEach((button) => {
    button.addEventListener('click', handleClose)
  })

  setTimeout(updateFeeds, 5000)
}
