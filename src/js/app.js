import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import state from '../models/state.js'
import resources from '../locales/ru.js'
import parser from '../util/parser.js'
import initValidation from '../util/validation.js'
import initWatchedState from './watcher.js'

const fetchFeed = async (url) => {
  const response = await fetch(
    `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`,
  )
  if (!response.ok) throw new Error('Network response was not ok.')
  return response.json()
}

const createUpdateFeeds = (watchedState, i18nInstance) => async () => {
  if (watchedState.data.feeds.length === 0) {
    setTimeout(createUpdateFeeds(watchedState, i18nInstance), 5000)
    return
  }

  try {
    const promises = watchedState.data.feeds.map(async (feed) => {
      try {
        const data = await fetchFeed(feed.url)
        const { posts: newPosts } = parser(data, feed.url, i18nInstance, feed.feedId)

        const existingLinks = new Set(
          watchedState.data.posts
            .filter((post) => post.feedId === feed.feedId)
            .map((post) => post.link),
        )

        const uniqueNewPosts = newPosts.filter(
          (post) => !existingLinks.has(post.link),
        )

        if (uniqueNewPosts.length > 0) {
          watchedState.data.posts = [...uniqueNewPosts, ...watchedState.data.posts]
        }
      } catch (err) {
        console.error(`Ошибка обновления фида ${feed.url}:`, err)
      }
    })

    await Promise.all(promises)
  } finally {
    setTimeout(createUpdateFeeds(watchedState, i18nInstance), 5000)
  }
}

const createValidateUrl = (validationSchema, watchedState) => async (url) => {
  const schema = validationSchema(watchedState.data.feeds)
  return schema.validate({ url }, { abortEarly: false })
}

export default () => {
  const i18nInstance = i18next.createInstance()
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  })

  const initDOM = () => ({
    form: document.querySelector('.rss-form'),
    inputForm: document.getElementById('url-input'),
    closeButtons: document.querySelectorAll('[data-bs-dismiss="modal"]'),
    errorContainer: document.querySelector('.feedback'),
    submitButton: document.querySelector('.rss-form .btn-primary'),
    postsContainer: document.querySelector('.posts'),
    modalElement: document.getElementById('modal'),
    feedsContainer: document.querySelector('.feeds'),
  })

  const { form, inputForm, closeButtons, errorContainer, submitButton, postsContainer, modalElement, feedsContainer } = initDOM()

  const validationSchema = initValidation(i18nInstance)

  const elements = {
    errorContainer,
    inputForm,
    submitButton,
    postsContainer,
    modalElement,
    feedsContainer,
  }

  const watchedState = initWatchedState(state, i18nInstance, {
    handlePostClick: (postId, isModalClick = false) => {
      watchedState.uiState.viewedPosts.add(postId)
      if (isModalClick) {
        watchedState.uiState.modal = {
          isOpen: true,
          postId,
        }
      }
    },
  }, elements)

  const validateUrl = createValidateUrl(validationSchema, watchedState)
  const updateFeeds = createUpdateFeeds(watchedState, i18nInstance)
  const handleClose = () => {
    watchedState.uiState.modal.isOpen = false
    watchedState.uiState.modal.postId = null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { value } = inputForm
    const url = value.trim()
    watchedState.process.status = 'filling'
    watchedState.process.error = ''
    watchedState.form.error = ''

    try {
      const { isValid, error } = await validateUrl(url)
      watchedState.form.isValid = isValid
      watchedState.form.error = error

      if (!isValid) return

      watchedState.process.status = 'processing'

      const data = await fetchFeed(url)
      const feedId = uuidv4()
      const { feed, posts } = parser(data, url, i18nInstance, feedId)

      watchedState.process.status = 'success'
      watchedState.data.feeds = [feed, ...watchedState.data.feeds]
      watchedState.data.posts = [...posts, ...watchedState.data.posts]
      watchedState.process.error = null
      inputForm.value = ''
      inputForm.focus()
    } catch (err) {
      watchedState.process.status = 'failed'
      watchedState.process.error = err.message === i18nInstance.t('error.no_rss')
        ? i18nInstance.t('error.no_rss')
        : i18nInstance.t('error.network_error')
    }
  }

  form.addEventListener('submit', handleSubmit)
  closeButtons.forEach((button) => {
    button.addEventListener('click', handleClose)
  })

  setTimeout(updateFeeds, 5000)
}
