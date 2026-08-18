import sanitizeHtml from 'sanitize-html'

const ALLOWED_TAGS = [
  'p',
  'br',
  'hr',
  'h2',
  'h3',
  'strong',
  'em',
  's',
  'u',
  'ul',
  'ol',
  'li',
  'blockquote',
  'a',
  'code',
  'pre',
  'img',
]

export function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ['href', 'rel', 'target'],
      img: ['src', 'alt', 'title', 'loading'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (tagName, attribs) => {
        if (attribs.target && attribs.target !== '_self') {
          return { tagName, attribs: { ...attribs, rel: 'noopener noreferrer' } }
        }
        return { tagName, attribs }
      },
    },
  })
}
