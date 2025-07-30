const renderErrors = (errorContainer, inputElement, error, i18nInstance, status) => {
  errorContainer.innerHTML = '';

  const messageElement = document.createElement('div');
  errorContainer.appendChild(messageElement);

  inputElement.classList.remove('is-invalid');
  errorContainer.classList.remove('text-danger', 'text-success');

  switch (status) {
    case 'success':
      inputElement.classList.remove('is-invalid');
      errorContainer.classList.add('text-success');
      messageElement.textContent = i18nInstance.t('process.success');
      break;

    case 'failed':
      inputElement.classList.remove('is-invalid');
      errorContainer.classList.add('text-danger');
      messageElement.textContent = error;
      break;

    case 'filling':
      if (error) {
        inputElement.classList.add('is-invalid');
        errorContainer.classList.add('text-danger');
        messageElement.textContent = error;
      }
      break;

    default:
      break;
  }
};

export default renderErrors;