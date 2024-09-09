import {
  buildBlock, loadBlock, toClassName,
} from '../../scripts/lib-franklin.js';

const allowedNestedBlocks = ['vimeo', 'form', 'svgator', 'deco-planets'];

function buildNestedBlocks(block) {
  const nestedBlocks = block.querySelectorAll('table');
  nestedBlocks.forEach((nestedBlock) => {
    // construct the blockName, sometimes a table has no thead, therefore we search for either, the first th oder td
    const blockName = toClassName(nestedBlock.querySelector('thead tr th, tbody tr td').textContent);

    // skip if this block is not designed to be nested
    if (!allowedNestedBlocks.includes(blockName)) {
      return;
    }

    // sometimes it is possible that a table has no thead, therefore the first "normal" row is the block name and can be
    // removed from the content
    const hasTableHead = !!nestedBlock.querySelector('thead th');
    if (!hasTableHead) {
      nestedBlock.querySelector('tbody > tr:first-of-type').remove();
    }

    // build the content as a 2d array form the table body
    const nestedBlockContent = [];
    nestedBlock.querySelectorAll('tbody > tr').forEach((tr) => {
      const nestedBlockContentColumns = [];
      tr.querySelectorAll('td').forEach((td) => {
        nestedBlockContentColumns.push(td.innerHTML);
      });
      nestedBlockContent.push(nestedBlockContentColumns);
    });

    // replace the table with the actual builded content
    const newBlock = buildBlock(blockName, nestedBlockContent);
    newBlock.dataset.blockName = blockName;
    nestedBlock.replaceWith(newBlock);
    loadBlock(newBlock).then(); // ignore promise
  });
}

function setupImageColumns(block) {
  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture, .svgator');
      if (pic) {
        const picWrapper = pic.parentElement;
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  buildNestedBlocks(block);
  setupImageColumns(block);
}
