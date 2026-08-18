import type { FetchOptions } from 'ofetch'

export function useAdminFetch() {
  const { user } = useAuth()

  async function adminFetch<T>(url: string, opts: FetchOptions = {}): Promise<T> {
    const token = user.value ? await user.value.getIdToken() : ''
    const headers = new Headers(opts.headers)
    headers.set('Authorization', `Bearer ${token}`)
    return $fetch<T>(url, { ...opts, headers })
  }

  return adminFetch
}
