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
    state: 'processing',
    error: '',
  },
  stateUi: {
    showedPost: [],
    openModal: false,
  },
};

export default state;
