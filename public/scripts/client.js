/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  $('.new-tweet .error').hide();

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

  const createTweetElement = function(tweet) {
    const escape = function (str) {
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
  }

  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').prepend($tweet);
    }
  }

  $("#new-tweet").submit(function(event) {
    event.preventDefault();
    $('.new-tweet .error').slideUp('fast');
    const $charLength = $(this).children('#tweet-text').val().length;
    if ($charLength === 0) {
      // alert(`Empty tweet cannot be submitted.`);
      $('.new-tweet #error-message').text('Empty tweet cannot be submitted.');
      $('.new-tweet .error').slideDown();
    } else if ($charLength > 140) {
      // alert(`The maximum message length is 140 characters.`);
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
        $(this).children('#tweet-text').val('');
        $(this).children('#tweet-text').focus();
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
  })

});

