const renderModal = (modalElement, modalState, posts) => {
  if (!modalElement) return

  const modalTitle = modalElement.querySelector('.modal-title')
  const modalBody = modalElement.querySelector('.modal-body')
  const fullArticleLink = modalElement.querySelector('.full-article')

  const post = posts.find((p) => p.postId === modalState.postId)
  if (!post) return

  modalTitle.textContent = post.title
  modalBody.textContent = post.description
  fullArticleLink.href = post.link

  if (modalState.isOpen) {
    modalElement.classList.add('show')
    modalElement.style.display = 'block'
    modalElement.setAttribute('aria-modal', 'true')
  } else {
    modalElement.classList.remove('show')
    modalElement.style.display = 'none'
    modalElement.setAttribute('aria-hidden', 'true')
    modalTitle.textContent = ''
    modalBody.textContent = ''
  }
}

export default renderModal
