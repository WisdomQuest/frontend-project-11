import onChange from 'on-change';
import i18next from 'i18next';
import state from '../models/state.js';
import resources from '../locales/ru.js';
import parser from '../util/parser.js';
import initValidation from '../util/validation.js';
import renderErrors from '../renderers/errors.js';
import renderFeeds from '../renderers/feeds.js';
import renderPosts from '../renderers/posts.js';

const i18nInstance = i18next.createInstance();
i18nInstance.init({
  lng: 'ru',
  debug: false,
  resources,
});

const validationSchema = initValidation(i18nInstance);

const formWatcher = onChange(state.form, (path, value) => {
  if (path === 'error') {
    renderErrors(value);
  }
});

const dataWatcher = onChange(state.data, (path) => {
  if (path === 'feeds') {
    renderFeeds(state.data.feeds);
  }
  if (path === 'posts') {
    renderPosts(state.data.posts);
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
    const cleanedValue = value.trim();

    validateUrl(cleanedValue).then(({ isValid, error }) => {
      formWatcher.isValid = isValid;
      formWatcher.error = error;

      if (isValid) {
        return fetch(
          `https://allorigins.hexlet.app/get?url=${encodeURIComponent(
            cleanedValue
          )}`
        )
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .then((data) => {
            const { feed, posts } = parser(data);
            dataWatcher.feeds = [
              ...state.data.feeds,
              { url: cleanedValue, feed },
            ];
            dataWatcher.posts = [...state.data.posts, ...posts];
          })
          .catch((err) => {
            console.log(err);
            formWatcher.error = [err];
            formWatcher.isValid = false;
          });
      }
    });
  };

  form.addEventListener('submit', handleBtn);
};
