export function stripHtml(value?: string): string {
  return (value ?? '').replace(/<[^>]*>/g, ' ')
}

export function matchesQuery(fields: (string | undefined)[], q: string): boolean {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  return fields.some((field) => (field ?? '').toLowerCase().includes(needle))
}
