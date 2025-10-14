import { v4 as uuidv4 } from 'uuid'

const getTextContent = (element, selector) => element.querySelector(selector)?.textContent?.trim() || ''

export default function Parser(data, url, i18nInstance, feedId = uuidv4()) {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(data.contents, 'application/xml')

  if (xmlDoc.querySelector('parsererror')) {
    throw new Error(i18nInstance.t('error.no_rss'))
  }

  const feed = {
    title: getTextContent(xmlDoc, 'title'),
    description: getTextContent(xmlDoc, 'description'),
    feedId,
    url,
  }

  const items = xmlDoc.querySelectorAll('item')

  const posts = Array.from(items).map(item => ({
    title: getTextContent(item, 'title'),
    description: getTextContent(item, 'description'),
    link: getTextContent(item, 'link'),
    postId: uuidv4(),
    feedId,
  }))

  return { feed, posts }
}
