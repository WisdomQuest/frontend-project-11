const renderViewedPost = (posts, postId) => {
  posts.forEach((post) => {
    const link = post.querySelector('a');

    if (link && link.dataset.id === postId) {
      link.classList.remove('fw-bold');
      link.classList.add('fw-normal', 'link-secondary');
    }
  });
};

export default renderViewedPost;
