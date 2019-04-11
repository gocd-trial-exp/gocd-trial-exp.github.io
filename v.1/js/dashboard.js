(function(global) {
  var NEW_PIPELINE = queryRegexpCompile("new_pipeline_name");
  var ROCKET_EMOJI = "\uD83D\uDE80"; // old JS needs surrogate pair to represent U+1F680 (https://mothereff.in/js-escapes#1%F0%9F%9A%80); es6 can do \u{1F680};

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

    detectAndFireReward();
  });

  function detectAndFireReward() {
    if ("" !== newPipelineParam()) {
      oneUp();
      rewardBanner();
    }
  }

  function oneUp() {
    var mp = document.getElementById("my-pipelines");
    mp.querySelector(".pipeline .name").textContent = newPipelineParam();
    mp.classList.remove("start-with-empty");
    var pipe = mp.querySelector(".pipeline");
    pipe.classList.add("trial-first-created");

    setTimeout(function() {
      pipe.classList.remove("trial-first-created");
    }, 1500);
  }

  function rewardBanner() {
    var ESC = 27;
    var banner = crel("div", {class: "bruce-banner"}, [
      ROCKET_EMOJI, ROCKET_EMOJI, ROCKET_EMOJI, ROCKET_EMOJI, " ",
      crel("strong", "Congratulations! You just ran your first pipeline on GoCD!"),
      " ", ROCKET_EMOJI, ROCKET_EMOJI, ROCKET_EMOJI, ROCKET_EMOJI
    ]);

    document.getElementById("root-header").insertAdjacentElement("afterend", banner);
    function removeBanner(e) {
      e.stopPropagation();
      e.preventDefault();
      banner.remove();
    }

    function keyListener(e) {
      if (ESC === e.which) {
        removeBanner(e);
      }
      document.body.removeEventListener("keydown", keyListener);
    }

    setTimeout(function() {
      banner.classList.add("animate");
      banner.addEventListener("click", removeBanner);
      document.body.addEventListener("keydown", keyListener);
    }, 0);
  }

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

  function queryRegexpCompile(key) {
    return new RegExp("(\\?|&)" + key + "=([^&]+)(&|$)");
  }

  function newPipelineParam() {
    var match = window.location.search.match(NEW_PIPELINE);
    return match ? match[2].trim() : "";
  }


})(window);
