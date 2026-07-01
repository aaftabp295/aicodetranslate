export const INDEXNOW_KEY = '76203cf3f99e4b7b848c9df484ad6a15'

/**
 * Submits a list of URLs to the IndexNow API for instant search engine indexing.
 * Silently catches errors so it does not block the main request execution flow.
 */
export async function pingIndexNow(urls: string[]): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aicodetranslate.com'
  const key = process.env.INDEXNOW_KEY || INDEXNOW_KEY

  try {
    const hostname = new URL(appUrl).hostname
    const keyLocation = `${appUrl.replace(/\/$/, '')}/${key}.txt`

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: hostname,
        key: key,
        keyLocation: keyLocation,
        urlList: urls,
      }),
    })

    if (!response.ok) {
      console.error(`IndexNow ping failed with status: ${response.status}`)
    } else {
      console.log(`Successfully submitted ${urls.length} URLs to IndexNow!`)
    }
  } catch (err) {
    console.error('Error submitting URLs to IndexNow:', err)
  }
}
