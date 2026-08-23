// Captures the currently-centered setlist slide's image + screen rect,
// so another section can fly that exact image out and grow it.
export const flipImage = {
  src: '/setlist/setlist-1-1.jpg',
  rect: null,
  capture(el) {
    if (!el) return;
    const img = el.querySelector('img');
    if (!img) return;
    this.src = img.getAttribute('src');
    this.rect = img.getBoundingClientRect(); // flat pos, ignores coverflow tilt
  },
};
