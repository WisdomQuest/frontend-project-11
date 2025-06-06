import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import state from '../models/state.js';
import resources from '../locales/ru.js';
import parser from '../util/parser.js';

const i18nInstance = i18next.createInstance();
i18nInstance.init({
  lng: 'ru',
  debug: false,
  resources,
});

yup.setLocale({
  mixed: {
    required: () => i18nInstance.t('error.required'),
  },
  string: {
    url: () => i18nInstance.t('error.invalid_url'),
  },
});

const checkDuplicateUrl = (url, feeds) =>
  new Promise((resolve) => {
    const isDuplicate = feeds.includes(url);
    resolve(isDuplicate);
  });

const validationSchema = (feeds) =>
  yup.object().shape({
    url: yup
      .string()
      .url()
      .required()
      .test(
        'is-unique',
        () => i18nInstance.t('error.duplicate_url'),
        (value) => {
          if (!value) return true;
          return checkDuplicateUrl(value, feeds).then(
            (isDuplicate) => !isDuplicate
          );
        }
      ),
  });

const renderErrors = (error) => {
  const errorContainer = document.querySelector('.feedback');
  errorContainer.innerHTML = '';

  const errorElement = document.createElement('div');
  errorElement.textContent = error;
  errorContainer.appendChild(errorElement);
};

const observedState = onChange(state.form, (path, value) => {
  if (path === 'error') {
    renderErrors(value);
  }
});

const validateUrl = (url) => {
  const schema = validationSchema(state.data.feeds);
  return schema.validate({ url }, { abortEarly: false });
};

export default () => {
  const form = document.querySelector('.rss-form');
  const inputForm = document.getElementById('url-input');

  const handleBtn = (e) => {
    e.preventDefault();
    const { value } = inputForm;

    validateUrl(value)
      .then(() => {
        state.data.feeds.push(value);
        observedState.isValid = true;

        observedState.errors = '';
        fetch(
          `https://allorigins.hexlet.app/get?url=${encodeURIComponent(value)}`
        )
          .then((response) => {
            if (response.ok) return response.json();
            throw new Error('Network response was not ok.');
          })
          .then((data) => {
            console.log(parser(data));
          });
      })
      .catch((err) => {
        observedState.error = err.error;
        observedState.isValid = false;
        console.log(2);
      });
  };

  form.addEventListener('submit', handleBtn);
};
