const renderErrors = (errorContainer, inputElement, error, i18nInstance, status) => {
  const container = errorContainer
  container.innerHTML = ''

  const messageElement = document.createElement('div')
  container.appendChild(messageElement)

  inputElement.classList.remove('is-invalid')
  container.classList.remove('text-danger', 'text-success')

  switch (status) {
    case 'success':
      container.classList.add('text-success')
      messageElement.textContent = i18nInstance.t('process.success')
      break

    case 'failed':
      container.classList.add('text-danger')
      messageElement.textContent = error
      break

    case 'filling':
      if (error) {
        inputElement.classList.add('is-invalid')
        container.classList.add('text-danger')
        messageElement.textContent = error
      }
      break

    default:
      break
  }
}

export default renderErrors
