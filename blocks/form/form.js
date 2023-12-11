import { loadScript } from '../../scripts/lib-franklin.js';
import { debounce } from '../../scripts/utilities.js';

function rearrangeInputLabels() {
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    const inputWrappers = form.querySelectorAll('.hs-fieldtype-text, .hs-fieldtype-phonenumber, .hs-fieldtype-booleancheckbox');
    inputWrappers.forEach((input) => {
      const inputElement = input.querySelector('input');
      const inputLabel = input.querySelector('label');
      if (inputElement && inputLabel) {
        input.prepend(inputLabel);
        input.prepend(inputElement);
        input.querySelector('.input').remove();
      }
    });
  });
}

export default async function decorate() {
  await loadScript('https://js.hsforms.net/forms/embed/v2.js');

  window.hbspt.forms.create({
    region: 'na1',
    portalId: '3458432',
    formId: 'a9f10e4b-6c50-442b-ae10-df1b06d21e6f',
    target: '.form',
  });

  const debouncedRearrangeInputLabels = debounce(() => rearrangeInputLabels());
  debouncedRearrangeInputLabels();
}
