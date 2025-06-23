import onChange from 'on-change';
import i18next from 'i18next';
import { v4 as uuidv4 } from 'uuid';
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

// 🔄 Функция для обновления фидов (проверка новых постов)
const updateFeeds = () => {
  if (state.data.feeds.length === 0) {
    setTimeout(updateFeeds, 5000);
    return;
  }

  const promises = state.data.feeds.map((feed) =>
    fetch(
      `https://allorigins.hexlet.app/get?url=${encodeURIComponent(feed.url)}`
    )
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        // Используем существующий ID фида при обновлении
        const { posts: newPosts } = parser(data, feed.url, feed.id);

        const existingLinks = new Set(
          state.data.posts
            .filter((post) => post.idFeed === feed.id)
            .map((post) => post.link)
        );

        const uniqueNewPosts = newPosts.filter(
          (post) => !existingLinks.has(post.link)
        );

        if (uniqueNewPosts.length > 0) {
          dataWatcher.posts = [...uniqueNewPosts, ...state.data.posts];
        }
      })
      .catch((err) => console.error(`Ошибка обновления фида ${feed.url}:`, err))
  );

  Promise.all(promises).finally(() => setTimeout(updateFeeds, 5000));
};

export default () => {
  const form = document.querySelector('.rss-form');
  const inputForm = document.getElementById('url-input');

  const handleBtn = (e) => {
    e.preventDefault();
    const { value } = inputForm;
    const url = value.trim();

    validateUrl(url).then(({ isValid, error }) => {
      formWatcher.isValid = isValid;
      formWatcher.error = error;

      if (isValid) {
        return fetch(
          `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`
        )
          .then((response) => {
            if (response.ok) return response.json();
            throw new Error('Network response was not ok.');
          })
          .then((data) => {
            // Генерируем ID фида один раз перед парсингом
            const feedId = uuidv4();
            const { feed, posts } = parser(data, url, feedId); // Передаем feedId в парсер

            dataWatcher.feeds = [feed, ...state.data.feeds];
            dataWatcher.posts = [...posts, ...state.data.posts];
          })
          .catch((err) => {
            console.error(err);
            formWatcher.error = [err];
            formWatcher.isValid = false;
          });
      }
    });
  };

  form.addEventListener('submit', handleBtn);

  // Запускаем периодическую проверку
  setTimeout(updateFeeds, 5000);
};
