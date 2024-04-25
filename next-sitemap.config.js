module.exports = {
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',
  generateRobotsTxt: true, // (optional)
  exclude: ['/admin', '/admin/*', '/api/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      `${process.env.SITE_URL}/server-sitemap.xml`,
      `${process.env.SITE_URL}/server-sitemap.xml`,
    ],
  },
};
