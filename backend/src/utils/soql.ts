export function escapeSoqlString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

export function toLikePattern(value: string): string {
  return `%${escapeSoqlString(value.trim())}%`;
}
