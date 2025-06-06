import { v4 as uuidv4 } from 'uuid';

export default function (data) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
  console.log(xmlDoc);
  const error = xmlDoc.querySelector('parseerorr');
  if (error) {
    throw new Error('parser error.');
  }
  const idFeed = uuidv4();

  const title = xmlDoc.querySelector('title').textContent;
  const description = xmlDoc.querySelector('description').textContent;
  const feed = { title, description, id: idFeed };
  const items = xmlDoc.querySelectorAll('item');
  const posts = [];
  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const idPost = uuidv4();
    const link = item.querySelector('link').textContent;
    posts.push({
      title, description, link, id: idPost, feed: idFeed,
    });
  });
  return { feed, posts };
}
