import Worker from '../worker.js';

var orig = {
  toContainer: Worker.prototype.toContainer
};

Worker.prototype.toContainer = function toContainer() {
  return orig.toContainer.call(this).then(function toContainer_pagebreak() {
    // Enable page-breaks.
    var pageBreaks = this.prop.container.querySelectorAll('.html2pdf__page-break');
    var pxPageHeight = this.prop.pageSize.inner.px.height;
    Array.prototype.forEach.call(pageBreaks, function pageBreak_loop(el) {
      el.style.display = 'block';
      var clientRect = el.getBoundingClientRect();
      el.style.height = pxPageHeight - (clientRect.top % pxPageHeight) + 'px';
    }, this);

    // Enable smart page-breaks.
    var pageBreaks = this.prop.container.querySelectorAll('.html2pdf__smart-page-break');
    Array.prototype.forEach.call(pageBreaks, function smartPageBreak_loop(el, i) {
      el.style.display = 'block';
      var clientRect = el.getBoundingClientRect();
      var space_left = pxPageHeight - (clientRect.top % pxPageHeight);
      var next_break = pageBreaks[i+1];
      if(next_break){
          var parent = next_break.parentElement;
          if((parent.offsetHeight + 100) < space_left) space_left = 0;
          if( space_left ) el.parentElement.parentElement.classList.add('end-page');
          el.style.height = space_left + 'px';
      }
    }, this);
  });
};
