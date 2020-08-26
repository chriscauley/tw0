export const assert = (bool, e) => {
  if (!bool) {
    throw e
  }
}