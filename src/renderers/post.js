const renderViewedPost = (posts, postId) => {
  posts.forEach((post) => {
    const link = post.querySelector('a')
    console.log(link);
    if (link && link.dataset.postId === postId) {
      link.classList.remove('fw-bold')
      link.classList.add('fw-normal', 'link-secondary')
    }
  })
}

export default renderViewedPost
