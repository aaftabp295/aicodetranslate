/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://aicodetranslate.com',
  generateRobotsTxt: true,
  exclude: ['/dashboard', '/login', '/auth/callback'],
  transform: async (config, path) => {
    // Custom rules for code converters pages

    // 1. /convert-from/[language] (built internally as /convert-from/[language] but rewritten as /convert-from-[language])
    if (path.startsWith('/convert-from/')) {
      const cleanPath = path.replace('/convert-from/', '/convert-from-')
      return {
        loc: cleanPath,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }
    if (path.startsWith('/convert-from-')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }

    // 2. /converters
    if (path === '/converters') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }
    }

    // 3. /convert/[pair] (built internally as /convert/[pair] but rewritten as /convert-[pair])
    if (path.startsWith('/convert/')) {
      const cleanPath = path.replace('/convert/', '/convert-')
      return {
        loc: cleanPath,
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }
    if (path.startsWith('/convert-')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }

    // Default transform for other pages (like /pricing or /)
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
}
