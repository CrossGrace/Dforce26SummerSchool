import { getStore } from '@netlify/blobs'

const initial = { version: 1, booths: {} }
const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }

export default async (request) => {
  const store = getStore('dforce-live-state')
  if (request.method === 'GET') {
    const state = await store.get('live', { type: 'json' }) || initial
    return new Response(JSON.stringify(state), { headers })
  }
  if (request.method === 'POST') {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') return new Response(JSON.stringify({error:'invalid body'}), {status:400,headers})
    const state = { ...body, version: Date.now() }
    await store.setJSON('live', state)
    return new Response(JSON.stringify(state), { headers })
  }
  return new Response('Method not allowed', {status:405,headers})
}
