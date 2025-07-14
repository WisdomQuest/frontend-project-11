const renderErrors = (error, i18nInstance) => {
  const inputElement = document.querySelector('.form-control');
  const errorRssText = i18nInstance.t('error.no_rss');
  const errorNetworkText = i18nInstance.t('error.network_error');
  const errorElement = document.createElement('div');
  const errorContainer = document.querySelector('.feedback');

  errorContainer.innerHTML = '';
  errorElement.textContent = error;
  errorContainer.appendChild(errorElement);
console.log(error);
  if (!error) {
    inputElement.classList.remove('is-invalid');
    errorContainer.classList.remove('text-danger');
    errorContainer.classList.add('text-success');
    errorElement.textContent = i18nInstance.t('process.success');
    return;
  }
  if (error === errorRssText || error === errorNetworkText) {
    inputElement.classList.remove('is-invalid');
    errorContainer.classList.add('text-danger');
    return;
  }
  // errorContainer.classList.remove('text-success');
  errorContainer.classList.add('text-danger');
  inputElement.classList.add('is-invalid');
};

export default renderErrors;
