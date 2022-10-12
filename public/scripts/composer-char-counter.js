$(document).ready(function() {
  $('#tweet-text').on('input', function() {
    const charLeft = 140 - $(this).val().length;
    const $counter = $(this).next().children('.counter');
    let colorAttribute = null;
    $counter.val(charLeft);
    if (charLeft < 0) {
      colorAttribute = 'negative';
    } 
    $counter.attr('id', colorAttribute);
  });
});