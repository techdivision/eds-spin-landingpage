export default function decorate(block) {
  const firstRowElements = block.querySelectorAll('.block > div > div:first-child > *');
  const secondRowElements = block.querySelectorAll('.block > div > div:nth-child(2) > *');

  block.innerHTML = '';
  const leftColumn = document.createElement('div');
  leftColumn.classList.add('static-scroll-column');
  leftColumn.classList.add('static-scroll-column-left');
  firstRowElements.forEach((element) => {
    leftColumn.append(element);
  });
  block.append(leftColumn);
  const rightColumn = document.createElement('div');
  rightColumn.classList.add('static-scroll-column');
  rightColumn.classList.add('static-scroll-column-right');
  secondRowElements.forEach((element) => {
    rightColumn.append(element);
  });
  block.append(rightColumn);

  if (firstRowElements.item(0).tagName === 'PICTURE') {
    leftColumn.classList.add('static-scroll-column-pictures');
    rightColumn.classList.add('static-scroll-column-texts');
  } else {
    leftColumn.classList.add('static-scroll-column-texts');
    rightColumn.classList.add('static-scroll-column-pictures');
  }

  const staticScrollIntersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {

    });
  }, { rootMargin: '49% 0px' });
}
