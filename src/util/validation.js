import * as yup from 'yup'

const checkDuplicateUrl = (url, feeds) => new Promise((resolve) => {
  const isDuplicate = feeds.some(feed => feed.url === url)
  resolve(isDuplicate)
})

export default (i18nInstance) => {
  yup.setLocale({
    mixed: {
      required: () => i18nInstance.t('error.required'),
    },
    string: {
      url: () => i18nInstance.t('error.invalid_url'),
    },
  })

  return feeds => ({
    validate: (input) => {
      const { url } = input
      const schema = yup
        .string()
        .required()
        .url()
        .test(
          'is-unique',
          () => i18nInstance.t('error.duplicate_url'),
          (value) => {
            if (!value) return true
            return checkDuplicateUrl(value, feeds).then(
              isDuplicate => !isDuplicate,
            )
          },
        )

      return schema
        .validate(url, { abortEarly: false })
        .then(() => ({ isValid: true, error: null }))
        .catch(err => ({ isValid: false, error: err.errors }))
    },
  })
}
