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
import renderModal from '../renderers/modal.js';

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

const uiStateWatcher = onChange(state.uiState, (path) => {
  if (path === 'viewedPosts') {
    renderPosts(state.data.posts);
  }
  if (path.startsWith('modal')) {
    renderModal(state.uiState.modal, state.data.posts);
  }
});

const processWatcher = onChange(state.process, () => {
  const submitButton = document.querySelector('[type="submit"]');
  if (!submitButton) return;

  submitButton.disabled = state.process.status === 'processing';
});

const validateUrl = (url) => {
  const schema = validationSchema(state.data.feeds);
  return schema.validate({ url }, { abortEarly: false });
};

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

  const handlePreviewClick = (postId) => {
    uiStateWatcher.viewedPosts.add(postId);
    uiStateWatcher.modal = {
      isOpen: true,
      postId,
    };
  };

  const handleBtn = (e) => {
    e.preventDefault();
    const { value } = inputForm;
    const url = value.trim();

    validateUrl(url).then(({ isValid, error }) => {
      formWatcher.isValid = isValid;
      formWatcher.error = error;

      if (isValid) {
        processWatcher.status = 'processing';
        processWatcher.error = null;
        return fetch(
          `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`
        )
          .then((response) => {
            if (response.ok) return response.json();
            throw new Error('Network response was not ok.');
          })
          .then((data) => {
            const feedId = uuidv4();
            const { feed, posts } = parser(data, url, feedId);

            dataWatcher.feeds = [feed, ...state.data.feeds];
            dataWatcher.posts = [...posts, ...state.data.posts];
            processWatcher.status = 'success';
          })
          .catch((err) => {
            formWatcher.error = [err];
            formWatcher.isValid = false;
            processWatcher.status = i18nInstance.t('network_error');
          });
      }
    });
  };

  form.addEventListener('submit', handleBtn);

  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-bs-toggle="modal"]');
    if (openBtn) {
      const postId = openBtn.dataset.id;
      handlePreviewClick(postId);
    }

    const closeBtn = e.target.closest('[data-bs-dismiss="modal"]');
    if (closeBtn) {
      e.preventDefault();
      uiStateWatcher.modal.isOpen = false;
      uiStateWatcher.modal.postId = null;
    }
  });

  setTimeout(updateFeeds, 5000);
};
