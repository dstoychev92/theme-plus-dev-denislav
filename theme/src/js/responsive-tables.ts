import {onDocumentReady} from '@theme/utils';

/*
  Wraps all tables inside RTE wrappers (.prose, .richtext, and Shopify's default
  .rte class) in a .rte-table-wrapper class.
  .richtext is included because typed richtext settings can't contain tables, but
  a richtext wrapper can receive them from a dynamic source (e.g. a collection
  description).
  Watches newly added content for .prose elements and wraps its tables too.
  Tables without any <th> are marked role="presentation" so screen readers
  treat them as layout, not data — RTE editors often emit header-less tables
  for layout, and AT heuristics for unmarked tables are unpredictable.
*/
function wrapTables(container: HTMLElement) {
  container.querySelectorAll('.prose table, .richtext table, .rte table').forEach((table) => {
    if (!table.hasAttribute('role') && !table.querySelector('th')) {
      table.setAttribute('role', 'presentation');
    }

    const wrapperClass = 'rte-table-wrapper';
    const tableAlreadyWrapped = table.closest(`.${wrapperClass}`);
    if (tableAlreadyWrapped) return;

    const parent = table.parentNode;
    const wrapper = document.createElement('div');
    wrapper.classList.add(wrapperClass);

    if (parent) {
      parent.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }
  });
}

// Search the newly added content for .prose tables and wrap them too
let observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.target instanceof HTMLElement) {
      if (mutation.target.classList.contains('prose') && mutation.target.parentNode instanceof HTMLElement) {
        wrapTables(mutation.target.parentNode);
      } else {
        wrapTables(mutation.target);
      }
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

onDocumentReady(() => {
  // Wrap all initially rendered .prose tables
  wrapTables(document.body);
});
