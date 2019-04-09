(function(global) {
  document.addEventListener("DOMContentLoaded", function() {
    initLinkStubs("a[href='#stub'],.run-ctl,.stage", [
      "*chuckles* I'm not functional!",
      "tee-hee, that tickles!",
      "oh stop it, you.",
      "and for my next trick: pull my finger!",
      "all play and no work makes me...lazy.",
      "et, voila.",
      "yep. still ignoring you."
    ]);
  });

  function initLinkStubs(selector, phrases) {
    var timer;
    var msg = document.getElementById("messages");

    function randomPhrase() {
      return phrases[Math.floor(Math.random() * phrases.length)];
    }

    function noWorky() {
      if ("number" === typeof timer) {
        clearTimeout(timer);
      }
      msg.innerText = randomPhrase();
      timer = setTimeout(function() {
        msg.innerText = "";
      }, 1500);
    }

    var clickables = document.querySelectorAll(selector);

    for (var i = 0, len = clickables.length; i < len; i++) {
      clickables[i].addEventListener("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        noWorky();
      })
    }
  }
})(window);
