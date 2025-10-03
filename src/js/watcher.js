import onChange from 'on-change'
import renderErrors from '../renderers/errors.js'
import renderFeeds from '../renderers/feeds.js'
import renderPosts from '../renderers/posts.js'
import renderModal from '../renderers/modal.js'
import renderViewedPost from '../renderers/post.js'

const initWatchedState = (state, i18nInstance, handlers, elements) => {
  const { handlePostClick } = handlers
  const {
    errorContainer,
    inputForm,
    submitButton,
    postsContainer,
    modalElement,
    feedsContainer,
  } = elements

  const watchedState = onChange(state, (path, value) => {
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

    if (path === 'data.feeds') {
      renderFeeds(state.data.feeds, i18nInstance, feedsContainer)
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
      const post = state.data.posts.find((p) => p.postId === state.uiState.modal.postId)
      renderModal(modalElement, state.uiState.modal, post)
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
