import { v4 as uuidv4 } from 'uuid';

export default function Parser(data, url, i18nInstance, feedId = uuidv4()) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data.contents, 'application/xml');
  const error = xmlDoc.querySelector('parsererror');
  if (error) {
    throw new Error(i18nInstance.t('error.no_rss')); // Бросаем Error с сообщением
  }

  const title = xmlDoc.querySelector('title')?.textContent || '';
  const description = xmlDoc.querySelector('description')?.textContent || '';

  const feed = {
    title, description, id: feedId, url,
  };

  const items = xmlDoc.querySelectorAll('item');
  const posts = [];
  items.forEach((item) => {
    const title = item.querySelector('title')?.textContent || '';
    const description = item.querySelector('description')?.textContent || '';
    const idPost = uuidv4();
    const link = item.querySelector('link')?.textContent || '';
    posts.push({
      title,
      description,
      link,
      id: idPost,
      idFeed: feedId,
    });
  });
  return { feed, posts };
}
