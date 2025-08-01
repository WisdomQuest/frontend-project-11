import onChange from 'on-change'
import renderErrors from '../renderers/errors.js'
import renderFeeds from '../renderers/feeds.js'
import renderPosts from '../renderers/posts.js'
import renderModal from '../renderers/modal.js'
import renderViewedPost from '../renderers/post.js'

const initWatchedState = (state, i18nInstance, handlers) => {
  const { handlePostClick } = handlers

  const watchedState = onChange(state, (path, value) => {
    const errorContainer = document.querySelector('.feedback')
    const inputForm = document.getElementById('url-input')
    const submitButton = document.querySelector('.rss-form .btn-primary')
    const postsContainer = document.querySelector('.posts')
    const modalElement = document.getElementById('modal')

    if (path === 'form.error' || path === 'process.error' || path === 'process.status') {
      const error = state.form.error || state.process.error
      renderErrors(
        errorContainer,
        inputForm,
        error,
        i18nInstance,
        state.process.status,
      )
    }

    if (path === 'process.status') {
      submitButton.disabled = state.process.status === 'processing'
    }

    // Обработка данных фидов
    if (path === 'data.feeds') {
      renderFeeds(state.data.feeds)
    }

    if (path === 'data.posts') {
      renderPosts(
        postsContainer,
        state.data.posts,
        state.uiState.viewedPosts,
        handlePostClick,
      )
    }

    if (path.startsWith('uiState.modal')) {
      renderModal(modalElement, state.uiState.modal, state.data.posts)
    }

    if (path.startsWith('uiState.viewedPosts')) {
      const postId = typeof value === 'string' ? value : [...value].pop()
      const postElements = document.querySelectorAll('.list-group-item')

      if (postId) {
        renderViewedPost(postElements, postId)
      }
    }
  })

  return watchedState
}

export default initWatchedState
