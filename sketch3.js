const scrollItems = document.querySelectorAll('.scroll-item');

  function revealOnScroll() {
    const triggerPoint = window.innerHeight * 0.85;

    scrollItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();

      // Reveal when visible
      if (rect.top < triggerPoint) {
        setTimeout(() => item.classList.add('visible'), index * 250);
      }

      // Parallax float effect while in view
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top - window.innerHeight / 2) * -0.1;
        item.style.setProperty('--float-offset', `${offset}px`);
        item.classList.add('floating');
      } else {
        item.classList.remove('floating');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();