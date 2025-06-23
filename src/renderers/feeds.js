const renderFeeds = (feeds, containerSelector = '.feeds') => {
  const feed = document.querySelector(containerSelector);
  feed.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'card border-0';

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  const cardTitle = document.createElement('h2');
  cardTitle.className = 'card-title h4';
  cardTitle.textContent = 'Фиды';

  cardBody.appendChild(cardTitle);
  card.appendChild(cardBody);

  const listGroup = document.createElement('ul');
  listGroup.className = 'list-group border-0 rounded-0';

  feeds.forEach((feed) => {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item border-0 border-end-0';

    const itemTitle = document.createElement('h3');
    itemTitle.className = 'h6 m-0';
    itemTitle.textContent = feed.title;

    const itemText = document.createElement('p');
    itemText.className = 'm-0 small text-black-50';
    itemText.textContent = feed.description;

    listItem.appendChild(itemTitle);
    listItem.appendChild(itemText);
    listGroup.appendChild(listItem);
  });

  card.appendChild(listGroup);
  feed.appendChild(card);
};

export default renderFeeds;
