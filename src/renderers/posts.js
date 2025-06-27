import state from '../models/state.js';

const renderPosts = (posts) => {
  const postsContainer = document.querySelector('.posts');
  postsContainer.innerHTML = '';

  const { viewedPosts } = state.uiState;

  const card = document.createElement('div');
  card.className = 'card border-0';

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  const cardTitle = document.createElement('h2');
  cardTitle.className = 'card-title h4';
  cardTitle.textContent = 'Посты';

  cardBody.appendChild(cardTitle);
  card.appendChild(cardBody);

  const listGroup = document.createElement('ul');
  listGroup.className = 'list-group border-0 rounded-0';

  posts.forEach((post) => {
    const listItem = document.createElement('li');
    listItem.className =
      'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';

    const postLink = document.createElement('a');
    postLink.href = post.link;
    postLink.className = viewedPosts.has(post.id)
      ? 'fw-normal'
      : 'fw-bold';
    postLink.textContent = post.title;
    postLink.setAttribute('target', '_blank');
    postLink.setAttribute('rel', 'noopener noreferrer');
    postLink.dataset.id = post.id;

    const viewButton = document.createElement('button');
    viewButton.type = 'button';
    viewButton.className = 'btn btn-outline-primary btn-sm';
    viewButton.textContent = 'Просмотр';
    viewButton.dataset.id = post.id;
    viewButton.dataset.bsToggle = 'modal';
    viewButton.dataset.bsTarget = '#modal';

    listItem.appendChild(postLink);
    listItem.appendChild(viewButton);
    listGroup.appendChild(listItem);
  });

  card.appendChild(listGroup);
  postsContainer.appendChild(card);
};

export default renderPosts;
