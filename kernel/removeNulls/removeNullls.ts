export function removeNulls(object: object) {
  for (let key in object) {
    if (object[key] === null) {
      delete object[key];
    }
  }
}