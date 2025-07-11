const renderErrors = (error, i18nInstance) => {
  const errorContainer = document.querySelector('.feedback');
  errorContainer.innerHTML = '';

  const errorElement = document.createElement('div');
  errorElement.textContent = error;
  errorContainer.appendChild(errorElement);

  const inputElement = document.querySelector('.form-control');
  inputElement.classList.add('is-invalid');
  const errorMessange = i18nInstance.t('error.no_rss');
  if (!error || error === errorMessange) {
    inputElement.classList.remove('is-invalid');
  }
};

export default renderErrors;
