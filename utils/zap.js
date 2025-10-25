export function sliceSHA(sha) {
  if (sha.length <= 7) {
    return sha;
  }
  return sha.slice(0, 7);
}
