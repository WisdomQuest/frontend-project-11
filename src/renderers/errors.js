const renderErrors = (error, i18nInstance, status) => {
  const inputElement = document.getElementById('url-input')
  const errorContainer = document.querySelector('.feedback')
  errorContainer.innerHTML = ''

  const messageElement = document.createElement('div')
  errorContainer.appendChild(messageElement)

  inputElement.classList.remove('is-invalid')
  errorContainer.classList.remove('text-danger', 'text-success')
  switch (status) {
    case 'success':
      inputElement.classList.remove('is-invalid')
      errorContainer.classList.add('text-success')
      messageElement.textContent = i18nInstance.t('process.success')
      break

    case 'failed':
      console.log(messageElement)
      inputElement.classList.remove('is-invalid')
      errorContainer.classList.add('text-danger')
      messageElement.textContent = error
      break

    case 'filling':
      if (error) {
        inputElement.classList.add('is-invalid')
        errorContainer.classList.add('text-danger')
        messageElement.textContent = error
      }
      break

    default:
      break
  }
}

export default renderErrors
