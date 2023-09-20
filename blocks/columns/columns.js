import {
  buildBlock, loadBlock, toClassName,
} from '../../scripts/lib-franklin.js';

const allowedNestedBlocks = ['vimeo'];

function buildNestedBlocks(block) {
  const nestedBlocks = block.querySelectorAll('table');
  nestedBlocks.forEach((nestedBlock) => {
    // construct the blockName
    const blockName = toClassName(nestedBlock.querySelector('thead th').textContent);

    // skip if this block is not designed to be nested
    if (!allowedNestedBlocks.includes(blockName)) {
      return;
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

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  buildNestedBlocks(block);
}
