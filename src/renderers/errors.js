const renderErrors = (error) => {
  const errorContainer = document.querySelector('.feedback');
  errorContainer.innerHTML = '';

  const errorElement = document.createElement('div');
  errorElement.textContent = error;
  errorContainer.appendChild(errorElement);
};

export default renderErrors;
