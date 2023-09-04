import registerScrollLinkedAnimation from "/scripts/scroll-linked-animations.js";

export default function decorate(block) {
  block.innerHTML = `
      <div class="my-planet"></div>
      <h1>LET'S SPIN YOUR WORLD</h1>
      <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. </p>
      <div class="wrapper-wrapper">
        <div class="word-cloud-wrapper top-top">
          <div class="word-cloud">
            <span class="word">Analyse</span>
            <span class="word">Shop</span>
            <span class="word">E-Commerce</span>
            <span class="word">Kreation</span>
            <span class="word">Vermarktung</span>
          </div>
        </div>
        <div class="word-cloud-wrapper top-bottom">
          <div class="word-cloud">
            <span class="word">Analyse</span>
            <span class="word">Shop</span>
            <span class="word">E-Commerce</span>
            <span class="word">Kreation</span>
            <span class="word">Vermarktung</span>
          </div>
        </div>
        <div class="word-cloud-wrapper bottom-bottom">
          <div class="word-cloud">
            <span class="word">Analyse</span>
            <span class="word">Shop</span>
            <span class="word">E-Commerce</span>
            <span class="word">Kreation</span>
            <span class="word">Vermarktung</span>
          </div>
        </div>
        <div class="word-cloud-wrapper bottom-top">
          <div class="word-cloud">
            <span class="word">Analyse</span>
            <span class="word">Shop</span>
            <span class="word">E-Commerce</span>
            <span class="word">Kreation</span>
            <span class="word">Vermarktung</span>
          </div>
        </div>
      </div>
      <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. </p>
`;

  registerScrollLinkedAnimation(block);
  registerScrollLinkedAnimation(block.querySelector('.word-cloud-wrapper.top-top'), 'top', 'top');
  registerScrollLinkedAnimation(block.querySelector('.word-cloud-wrapper.top-bottom'), 'top', 'bottom');
  registerScrollLinkedAnimation(block.querySelector('.word-cloud-wrapper.bottom-bottom'), 'bottom', 'bottom');
  registerScrollLinkedAnimation(block.querySelector('.word-cloud-wrapper.bottom-top'), 'bottom', 'top');
}
