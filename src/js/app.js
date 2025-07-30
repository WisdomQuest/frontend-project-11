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
import renderViewedPost from '../renderers/post.js';

const i18nInstance = i18next.createInstance();
i18nInstance.init({
  lng: 'ru',
  debug: false,
  resources,
});

// Инициализация DOM элементов
const initDOM = () => {
  const form = document.querySelector('.rss-form');
  const inputForm = document.getElementById('url-input');
  const submitButton = document.querySelector('.rss-form .btn-primary');
  const closeButtons = document.querySelectorAll('[data-bs-dismiss="modal"]');
  const postsContainer = document.querySelector('.posts');
  const modalElement = document.getElementById('modal');
  const errorContainer = document.querySelector('.feedback');

  return {
    form,
    inputForm,
    submitButton,
    closeButtons,
    postsContainer,
    modalElement,
    errorContainer,
  };
};

const {
  form,
  inputForm,
  submitButton,
  closeButtons,
  postsContainer,
  modalElement,
  errorContainer,
} = initDOM();

const validationSchema = initValidation(i18nInstance);

// Единый вотчер для всего состояния приложения
const watchedState = onChange(state, (path, value) => {
  // Обработка ошибок формы и процесса
  if (path === 'form.error' || path === 'process.error' || path === 'process.status') {
    const error = state.form.error || state.process.error;
    renderErrors(
      errorContainer, 
      inputForm, 
      error, 
      i18nInstance, 
      state.process.status
    );
  }

  // Обработка состояния формы
  if (path === 'process.status') {
    submitButton.disabled = state.process.status === 'processing';
  }

  // Обработка данных фидов
  if (path === 'data.feeds') {
    renderFeeds(state.data.feeds);
  }

  // Обработка данных постов
  if (path === 'data.posts') {
    renderPosts(
      postsContainer,
      state.data.posts,
      state.uiState.viewedPosts,
      handlePostClick
    );
  }

  // Обработка модального окна
  if (path.startsWith('uiState.modal')) {
    renderModal(modalElement, state.uiState.modal, state.data.posts);
  }

  // Обработка просмотренных постов
  if (path.startsWith('uiState.viewedPosts')) {
    // Получаем ID просмотренного поста
    const postId = typeof value === 'string' ? value : [...value].pop();
    
    // Находим все элементы постов в DOM
    const postElements = document.querySelectorAll('.list-group-item');
    
    // Обновляем только измененный пост
    if (postId) {
      renderViewedPost(postElements, postId);
    }
  }
});

const handleClose = () => {
  watchedState.uiState.modal.isOpen = false;
  watchedState.uiState.modal.postId = null;
};

// Изменяем handleOpenModal - теперь он только открывает модалку
const handleOpenModal = (postId, showModal = true) => {
  watchedState.uiState.modal = {
    isOpen: showModal,
    postId,
  };
};

// Добавляем новый обработчик для клика по посту
const handlePostClick = (postId, isModalClick = false) => {
  // Добавляем пост в просмотренные
  watchedState.uiState.viewedPosts.add(postId);
  
  // Если это клик для открытия модалки - открываем ее
  if (isModalClick) {
    handleOpenModal(postId, true);
  }
};

const validateUrl = async (url) => {
  const schema = validationSchema(watchedState.data.feeds);
  return schema.validate({ url }, { abortEarly: false });
};

const fetchFeed = async (url) => {
  const response = await fetch(
    `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`
  );
  if (!response.ok) throw new Error('Network response was not ok.');
  return response.json();
};

const updateFeeds = async () => {
  if (watchedState.data.feeds.length === 0) {
    setTimeout(updateFeeds, 5000);
    return;
  }

  try {
    const promises = watchedState.data.feeds.map(async (feed) => {
      try {
        const data = await fetchFeed(feed.url);
        const { posts: newPosts } = parser(data, feed.url, i18nInstance, feed.id);

        const existingLinks = new Set(
          watchedState.data.posts
            .filter((post) => post.idFeed === feed.id)
            .map((post) => post.link)
        );

        const uniqueNewPosts = newPosts.filter(
          (post) => !existingLinks.has(post.link)
        );

        if (uniqueNewPosts.length > 0) {
          watchedState.data.posts = [...uniqueNewPosts, ...watchedState.data.posts];
        }
      } catch (err) {
        console.error(`Ошибка обновления фида ${feed.url}:`, err);
      }
    });

    await Promise.all(promises);
  } finally {
    setTimeout(updateFeeds, 5000);
  }
};

// Инициализация приложения
export default () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { value } = inputForm;
    const url = value.trim();
    watchedState.process.status = 'filling';
    watchedState.process.error = '';
    watchedState.form.error = '';

    try {
      const { isValid, error } = await validateUrl(url);
      watchedState.form.isValid = isValid;
      watchedState.form.error = error;

      if (!isValid) return;

      watchedState.process.status = 'processing';
      
      const data = await fetchFeed(url);
      const feedId = uuidv4();
      const { feed, posts } = parser(data, url, i18nInstance, feedId);
      
      watchedState.process.status = 'success';
      watchedState.data.feeds = [feed, ...watchedState.data.feeds];
      watchedState.data.posts = [...posts, ...watchedState.data.posts];
      watchedState.process.error = null;
      inputForm.value = '';
      inputForm.focus();
    } catch (err) {
      watchedState.process.status = 'failed';
      watchedState.process.error = 
        err.message === i18nInstance.t('error.no_rss')
          ? i18nInstance.t('error.no_rss')
          : i18nInstance.t('error.network_error');
    }
  };

  form.addEventListener('submit', handleSubmit);
  closeButtons.forEach((button) => {
    button.addEventListener('click', handleClose);
  });

  setTimeout(updateFeeds, 5000);
};