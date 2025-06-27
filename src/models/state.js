const state = {
  data: {
    feeds: [],
    posts: [],
  },
  form: {
    error: '',
    isValid: false,
  },
  process: {
    state: 'validating',
    error: '',
  },
  uiState: {
    viewedPosts: new Set(),
    modal: {
      isOpen: false,
      postId: null,
    },
  },
};

export default state;
