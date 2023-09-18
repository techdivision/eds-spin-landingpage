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
    const content = [];
    nestedBlock.querySelectorAll('tbody > tr').forEach((tr) => {
      const nestedColumns = [];
      tr.querySelectorAll('td').forEach((td) => {
        nestedColumns.push(td.innerHTML);
      });
      content.push(nestedColumns);
    });

    // replace the table with the actual builded content
    const newBlock = buildBlock(blockName, content);
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
