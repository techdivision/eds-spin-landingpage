const scrollLinkedElements = [];

function calculateScrollPositions() {
  scrollLinkedElements.forEach((element) => {
    const sectionRect = element.getBoundingClientRect();
    const scrollPercentBottom = Math.min(
      Math.max(
        (sectionRect.height
                - (sectionRect.height + sectionRect.top - window.innerHeight))
            / sectionRect.height,
        0,
      ),
      1,
    );
    const scrollPercentTop = Math.min(
      Math.max(
        (sectionRect.height - (sectionRect.height + sectionRect.top))
            / sectionRect.height,
        0,
      ),
      1,
    );
    const scrollPercent = Math.min(
      Math.max(
        (sectionRect.height - (sectionRect.height + sectionRect.top))
            / (sectionRect.height - window.innerHeight),
        0,
      ),
      1,
    );
    element.style.setProperty('--scroll-top', scrollPercentTop);
    element.style.setProperty('--scroll-bottom', scrollPercentBottom);
    element.style.setProperty('--scroll', scrollPercent);
    element.style.setProperty('--container-height', `${sectionRect.height}px`);
    element.style.setProperty('--container-width', `${sectionRect.width}px`);
  });
}

export default function registerScrollLinkedAnimation(element) {
  scrollLinkedElements.push(element);
  calculateScrollPositions();
}

window.addEventListener(
  'scroll',
  calculateScrollPositions,
  { passive: true },
);
