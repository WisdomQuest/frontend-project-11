const renderErrors = (error, containerSelector = '.feedback') => {
  const errorContainer = document.querySelector(containerSelector);
  errorContainer.innerHTML = '';

  const errorElement = document.createElement('div');
  errorElement.textContent = error;
  errorContainer.appendChild(errorElement);
};

export default renderErrors;
