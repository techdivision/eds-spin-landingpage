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

export default function decorate(block) {
  block.dataset.formId = block.children[0].children[0].innerHTML;
  block.innerHTML = 'loading';
}

export async function initializeHubspot() {
  await loadScript('https://js.hsforms.net/forms/embed/v2.js');

  const hubspotForms = document.querySelectorAll('.form[data-form-id]');
  hubspotForms.forEach((form, index) => {
    form.dataset.formIndex = `${index}`;
    window.hbspt.forms.create({
      region: 'na1',
      portalId: '3458432',
      formId: form.dataset.formId,
      target: `[data-form-id][data-form-index='${form.dataset.formIndex}']`,
    });
  });

  const debouncedRearrangeInputLabels = debounce(() => rearrangeInputLabels());
  debouncedRearrangeInputLabels();
}
