export function validatePermission(type: string): boolean {
  if (type !== 'MANAGER') {
    return false;
  }
  return true
}