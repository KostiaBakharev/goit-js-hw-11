let prevScrollPos = window.scrollY;

window.onscroll = function () {
  const currentScrollPos = window.scrollY;

  if (prevScrollPos > currentScrollPos) {
    document.getElementById('search-form').style.top = '0';
  } else {
    document.getElementById('search-form').style.top = '-80px';
  }

  prevScrollPos = currentScrollPos;
};
