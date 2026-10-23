const BASE = 'https://jinghuasociety-scripturelibrary.asoe.cn'

async function get(path, tries = 6) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(BASE + path, { cache: 'no-store' })
      const text = await res.text()
      return { status: res.status, text }
    } catch {
      await new Promise((r) => setTimeout(r, 2500))
    }
  }
  return null
}

const count = (s, re) => (s.match(re) || []).length

const sm = await get('/sitemap.xml')
if (sm) {
  console.log('sitemap status:', sm.status, 'len:', sm.text.length)
  console.log('  <loc>      :', count(sm.text, /<loc>/g))
  console.log('  /blog/     :', count(sm.text, /\/blog\//g))
  console.log('  hello-site :', count(sm.text, /hello-site/g))
  console.log('  weekly     :', count(sm.text, /weekly/g))
  console.log('  daily      :', count(sm.text, /daily/g))
  console.log('  /go/       :', count(sm.text, /asoe\.cn\/go\//g))
  console.log('  new article:', count(sm.text, /from-url-to-pixels/g))
} else {
  console.log('sitemap: FETCH FAILED')
}

const rss = await get('/rss.xml')
if (rss) {
  console.log('\nrss status:', rss.status, 'len:', rss.text.length)
  console.log('  <item>       :', count(rss.text, /<item>/g))
  console.log('  new article  :', count(rss.text, /from-url-to-pixels/g))
  console.log('  old hello-site:', count(rss.text, /hello-site/g))
} else {
  console.log('rss: FETCH FAILED')
}

const upd = await get('/updates.json')
if (upd) {
  console.log('\nupdates.json status:', upd.status, 'len:', upd.text.length)
  console.log('  entries:', count(upd.text, /"path"/g))
  console.log('  new article:', count(upd.text, /from-url-to-pixels/g))
  console.log('  old hello-site:', count(upd.text, /hello-site/g))
} else {
  console.log('updates.json: FETCH FAILED')
}
