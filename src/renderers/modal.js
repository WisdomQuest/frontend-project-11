const renderModal = (modalState, posts) => {
  const modalElement = document.getElementById('modal')
  if (!modalElement) return

  const post = posts.find((p) => p.id === modalState.postId)
  if (!post) return

  modalElement.querySelector('.modal-title').textContent = post.title
  modalElement.querySelector('.modal-body').textContent = post.description
  modalElement.querySelector('.full-article').href = post.link

  if (modalState.isOpen) {
    modalElement.classList.add('show')
    modalElement.style.display = 'block'
    modalElement.setAttribute('aria-modal', 'true')
  } else {
    modalElement.classList.remove('show')
    modalElement.style.display = 'none'
    modalElement.setAttribute('aria-hidden', 'true')

    modalElement.querySelector('.modal-title').textContent = ''
    modalElement.querySelector('.modal-body').textContent = ''
  }
}

export default renderModal
