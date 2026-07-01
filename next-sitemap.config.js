/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://aicodetranslate.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/dashboard', '/api/'] },
    ],
    additionalSitemaps: [],
  },
  exclude: ['/dashboard', '/api/*', '/auth/*'],
  priority: 0.7,
  changefreq: 'weekly',
  transform: async (config, path) => {
    let loc = path

    // Homepage and converter tool — highest priority
    if (path === '/' || path === '/free-code-converter') {
      return { loc: path, priority: 1.0, changefreq: 'daily' }
    }
    // /convert/[pair] (built internally as /convert/[pair] but rewritten as /convert-[pair])
    if (path.startsWith('/convert/')) {
      loc = path.replace('/convert/', '/convert-')
      return { loc, priority: 0.9, changefreq: 'weekly' }
    }
    if (path.startsWith('/convert-') && path.includes('-to-')) {
      return { loc: path, priority: 0.9, changefreq: 'weekly' }
    }
    // /convert-from/[language] (built internally as /convert-from/[language] but rewritten as /convert-from-[language])
    if (path.startsWith('/convert-from/')) {
      loc = path.replace('/convert-from/', '/convert-from-')
      return { loc, priority: 0.8, changefreq: 'weekly' }
    }
    if (path.startsWith('/convert-from-')) {
      return { loc: path, priority: 0.8, changefreq: 'weekly' }
    }
    // /converters index
    if (path === '/converters') {
      return { loc: path, priority: 0.8, changefreq: 'weekly' }
    }
    // Default
    return { loc: path, priority: 0.7, changefreq: 'weekly' }
  },
}
