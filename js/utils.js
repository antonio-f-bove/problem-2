export default {
  async sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
}