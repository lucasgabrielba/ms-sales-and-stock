export function transformToUppercase(payload) {
  const transformedPayload = {};

  for (const key in payload) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      const value = payload[key];
      transformedPayload[key] = typeof value === 'string' ? value.toUpperCase() : value;
    }
  }

  return transformedPayload;
}
