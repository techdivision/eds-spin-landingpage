import { registerScrollLinkedVariable } from '../../scripts/scroll-linked-variable.js';

export default function decorate(block) {
  const firstRowElements = block.querySelectorAll('.block > div > div:first-child > *');
  const secondRowElements = block.querySelectorAll('.block > div > div:nth-child(2) > *');

  block.innerHTML = '';
  const leftColumn = document.createElement('div');
  leftColumn.classList.add('static-scroll-column');
  leftColumn.classList.add('static-scroll-column-left');
  leftColumn.append(...firstRowElements);
  block.append(leftColumn);
  const rightColumn = document.createElement('div');
  rightColumn.classList.add('static-scroll-column');
  rightColumn.classList.add('static-scroll-column-right');
  rightColumn.append(...secondRowElements);
  block.append(rightColumn);

  let textColumn;
  if (firstRowElements.item(0).tagName === 'PICTURE') {
    leftColumn.classList.add('static-scroll-column-pictures');
    rightColumn.classList.add('static-scroll-column-texts');
    textColumn = rightColumn;
  } else {
    leftColumn.classList.add('static-scroll-column-texts');
    rightColumn.classList.add('static-scroll-column-pictures');
    textColumn = leftColumn;
  }

  const maxNumberOfElements = Math.max(firstRowElements.length, secondRowElements.length);
  const elementHeight = 50;
  const staticScrollColumnsHeight = (maxNumberOfElements + 2) * elementHeight;
  block.style.setProperty('--height-static-scroll-columns', `${staticScrollColumnsHeight}vh`);
  block.style.setProperty('--height-static-scroll-columns-progress-section', `${elementHeight}vh`);

  const scrollProgressSections = [];
  const scrollProgress = document.createElement('div');
  scrollProgress.classList.add('static-scroll-columns-progress');
  for (let i = 0; i < maxNumberOfElements; i += 1) {
    const scrollProgressSection = document.createElement('div');
    scrollProgressSection.classList.add('static-scroll-columns-progress-section');
    scrollProgressSection.dataset.index = i.toString();
    scrollProgress.append(scrollProgressSection);
    scrollProgressSections.push(scrollProgressSection);
  }

  block.append(scrollProgress);

  const ACTIVE_CLASS = 'active';

  const staticScrollIntersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeElements = entry.target.closest('.static-scroll-columns').querySelectorAll(`.${ACTIVE_CLASS}`);
        activeElements.forEach((element) => {
          element.classList.remove(ACTIVE_CLASS);
        });
        firstRowElements.item(entry.target.dataset.index).classList.add(ACTIVE_CLASS);
        secondRowElements.item(entry.target.dataset.index).classList.add(ACTIVE_CLASS);
      }
    });
  }, { rootMargin: '-49% 0px' });

  scrollProgressSections.forEach((progress) => {
    staticScrollIntersectionObserver.observe(progress);
  });

  const resizeObserver = new ResizeObserver((entries) => {
    let textHeight = 0;
    entries.forEach((entry) => {
      textHeight += entry.target.offsetHeight;
    });
    textColumn.style.setProperty('--text-height', `${textHeight}px`);
  });

  // Timeout is the easiest way to work around that the text elements have no height initially
  setTimeout(() => {
    Array.from(textColumn.children).forEach((text) => {
      resizeObserver.observe(text);
    });
  }, 1000);

  registerScrollLinkedVariable(block);
}
