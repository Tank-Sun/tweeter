/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  // Hide error message when the page load
  $('.new-tweet .error').hide();

  // create the tweet HTML structure when passing in the tweet object
  const createTweetElement = function(tweet) {
    const escape = function(str) {
      let div = document.createElement("div");
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    };
    const $tweet = $(`
      <article>
        <header>
          <div class="user">
            <div><img src=${tweet.user.avatars}></div>
            <div>${tweet.user.name}</div>
          </div>
          <div class="at">${tweet.user.handle}</div>
        </header>
        <div class="tweet">${escape(tweet.content.text)}</div>
        <footer>
          <div>${timeago.format(Date.now() - tweet.created_at)}</div>
          <div class="icons">
            <i class="fa-solid fa-flag"></i>
            <i class="fa-solid fa-retweet"></i>
            <i class="fa-solid fa-heart"></i>
          </div>
        </footer>
      </article>
    `);
    return $tweet;
  };

  // Loop through the tweets data, turn them into HTML and add them in reverse-chronological order
  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').prepend($tweet);
    }
  };

  // Get the tweets data from /tweets, render them to our page
  const loadTweets = function() {
    $.ajax({
      url: '/tweets',
      method: 'GET'
    })
    .then(function(tweets) {
      renderTweets(tweets);
    })
    .catch((error) => {
      console.log('error:', error);
    });
  };

  loadTweets();

  // When the form is submitted, validate the data,
  // send it to the database and render it dynamically to our page
  $("#new-tweet").submit(function(event) {
    event.preventDefault();

    // Validate the tweet, show or hide the error messages
    $('.new-tweet .error').slideUp('fast');
    const $charLength = $(this).children('#tweet-text').val().length;
    if ($charLength === 0) {
      $('.new-tweet #error-message').text('Empty tweet cannot be submitted.');
      $('.new-tweet .error').slideDown();
    } else if ($charLength > 140) {
      $('.new-tweet #error-message').text('The maximum message length is 140 characters.');
      $('.new-tweet .error').slideDown();
    } else {
      const dataToSend = $(this).serialize();
      $.ajax({
        method: 'POST',
        url: '/tweets',
        data: dataToSend
      })
      .then(() => {
        // Clear the textarea, re-focus on it, reset the counter
        $(this).children('#tweet-text').val('');
        $(this).children('#tweet-text').focus();
        $(this).find('.counter').val(140);

        // Get the new data, render it to our page
        $.ajax({
          url: '/tweets',
          method: 'GET'
        })
        .then(function(tweets) {
          const $tweet = createTweetElement(tweets[tweets.length - 1]);
          $('#tweets-container').prepend($tweet);
        })
        .catch((error) => {
          console.log('error:', error);
        });
      })
      .catch((error) => {
        console.log('error:',error);
      });
    }
  });

});

