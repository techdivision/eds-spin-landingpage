function calculateScrollbarWidth() {
  document.documentElement.style.setProperty(
    '--scrollbar-width',
    `${window.innerWidth - document.documentElement.clientWidth}px`,
  );
}

function selectButton(block, button, row, buttons) {
  block.scrollTo({ top: 0, left: row.offsetLeft - row.parentNode.offsetLeft, behavior: 'smooth' });
  buttons.forEach((r) => r.classList.remove('selected'));
  button.classList.add('selected');
}

function getVisibleSlide(event) {
  const { target } = event;
  const buttons = target.nextElementSibling.querySelectorAll('button');
  const slides = target.querySelectorAll(':scope > div');
  const leftPosition = target.scrollLeft;
  let leftPadding = 0;

  slides.forEach((slide, key) => {
    const offset = slide.offsetLeft;

    // set first offset (extra padding?)
    if (key === 0) leftPadding = offset;

    if (offset - leftPadding === leftPosition) {
      // trigger default functionality
      selectButton(target, buttons[key], slide, buttons);
    }
  });
}

export default function decorate(block) {
  const buttons = document.createElement('div');
  const autoPlayList = [];
  let carouselInterval = null;

  // dots
  buttons.className = 'carousel-buttons';
  [...block.children].forEach((row, i) => {
    // set classes
    [...row.children].forEach((child) => {
      if (child.querySelector('picture')) {
        child.classList.add('carousel-image');
      } else {
        child.classList.add('carousel-text');
      }
    });

    // move icon to parent's parent
    const icon = row.querySelector('span.icon');
    if (icon) icon.parentNode.parentNode.prepend(icon);

    /* buttons */
    const button = document.createElement('button');
    if (!i) button.classList.add('selected');
    button.addEventListener('click', () => {
      window.clearInterval(carouselInterval);
      selectButton(block, button, row, [...buttons.children]);
    });
    buttons.append(button);
    autoPlayList.push({ row, button });
  });
  block.parentElement.append(buttons);

  // attach scroll event
  block.addEventListener('scroll', getVisibleSlide);

  calculateScrollbarWidth();
  window.addEventListener('resize', calculateScrollbarWidth, false);

  carouselInterval = window.setInterval(() => {
    autoPlayList.some((b, i) => {
      const isSelected = b.button.classList.contains('selected');
      if (isSelected) {
        const nextB = (i + 1 >= autoPlayList.length) ? autoPlayList[0] : autoPlayList[i + 1];
        selectButton(block, nextB.button, nextB.row, [b.button]);
      }
      return isSelected;
    });
  }, 5000);
}
