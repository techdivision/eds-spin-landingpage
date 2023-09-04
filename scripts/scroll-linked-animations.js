const scrollLinkedElements = [];

function calculateScrollPositions() {
  scrollLinkedElements.forEach((elementData) => {
    const elementRect = elementData.element.getBoundingClientRect();
    const scrollPercent = Math.min(
      Math.max(
        (elementRect.height - (elementRect.height + elementRect.top - elementData.scrollStartOffset))
            / (elementRect.height + elementData.scrollEndOffset),
        0,
      ),
      1,
    );
    elementData.element.style.setProperty('--scroll', scrollPercent);
    elementData.element.style.setProperty('--container-height', `${elementRect.height}px`);
    elementData.element.style.setProperty('--container-width', `${elementRect.width}px`);
  });
}

/**
 *
 * @param element
 * @param scrollStartPosition can be either top or bottom, top is the default
 * @param scrollEndPosition can be either top or bottom, bottom is the default
 */
export default function registerScrollLinkedAnimation(element, scrollStartPosition = 'top', scrollEndPosition = 'bottom') {
  const scrollPositions = ['top', 'bottom'];
  if (!scrollPositions.includes(scrollStartPosition)
      || !scrollPositions.includes(scrollEndPosition)) {
    return;
  }
  let scrollStartOffset = 0;
  let scrollEndOffset = 0;
  if (scrollStartPosition === 'top' && scrollEndPosition === 'bottom') {
    scrollEndOffset = -1 * window.innerHeight;
  } else if (scrollStartPosition === 'bottom' && scrollEndPosition === 'bottom') {
    scrollStartOffset = window.innerHeight;
  } else if (scrollStartPosition === 'bottom' && scrollEndPosition === 'top') {
    scrollStartOffset = window.innerHeight;
    scrollEndOffset = window.innerHeight;
  }
  const elementData = {
    element,
    scrollStartOffset,
    scrollEndOffset,
  };
  scrollLinkedElements.push(elementData);
  calculateScrollPositions();
}

// Test via a getter in the options object to see if the passive property is accessed
let supportsPassive = false;
try {
  const opts = Object.defineProperty({}, 'passive', {
    // eslint-disable-next-line getter-return
    get() {
      supportsPassive = true;
    },
  });
  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
} catch (e) {
  // swallow
}

window.addEventListener(
  'scroll',
  calculateScrollPositions,
  supportsPassive ? { passive: true } : false,
);
