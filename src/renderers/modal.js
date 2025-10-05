const renderModal = (modalElement, modalState, post) => {
  if (!modalElement) return

  const modalTitle = modalElement.querySelector('.modal-title')
  const modalBody = modalElement.querySelector('.modal-body')
  const fullArticleLink = modalElement.querySelector('.full-article')

  if (!post) {
    modalTitle.textContent = ''
    modalBody.textContent = ''
    fullArticleLink.href = '#'
    return
  }

  modalTitle.textContent = post.title
  modalBody.textContent = post.description
  fullArticleLink.href = post.link

  if (modalState.isOpen) {
    modalElement.classList.add('show')
    /* eslint-disable-next-line no-param-reassign */
    modalElement.style.display = 'block'
    modalElement.setAttribute('aria-modal', 'true')
  } else {
    modalElement.classList.remove('show')
    /* eslint-disable-next-line no-param-reassign */
    modalElement.style.display = 'none'
    modalElement.setAttribute('aria-hidden', 'true')
  }
}

export default renderModal
