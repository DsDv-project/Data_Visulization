var swiper = new Swiper('.swiper-container', {
  direction: 'vertical',
  mousewheelControl: true,
  mousewheel: true,
  slidesPerView: 1,
  keyboard: {
      enabled: true,
      onlyInViewport: true,
  },
  pagination: {
      el: '.swiper-pagination',
      clickable: true,
  },
});

window.addEventListener('wheel', function (e) {
  if (e.deltaY > 0) {
      // down
      swiper.slideNext();
  } else {
      // UP
      swiper.slidePrev();
  }
});