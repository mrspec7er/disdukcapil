export function dateTimeConverter(dateStringify: string) {
  return new Date(dateStringify).toLocaleString();
}
