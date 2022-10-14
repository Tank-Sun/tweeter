$(document).ready(function() {
  $('#tweet-text').on('input', function() {
    // Count the character limit left
    const charLeft = 140 - $(this).val().length;
    const $counter = $(this).next().children('.counter');
    $counter.val(charLeft);

    // Change color when counter is less than 0
    let colorAttribute = null;
    if (charLeft < 0) {
      colorAttribute = 'negative';
    }
    $counter.attr('id', colorAttribute);
  });
});