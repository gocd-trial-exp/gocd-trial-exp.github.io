(function(global) {
  var NEW_PIPELINE = queryRegexpCompile("new_pipeline_name");
  var ROCKET_EMOJI = "\uD83D\uDE80"; // old JS needs surrogate pair to represent U+1F680 (https://mothereff.in/js-escapes#1%F0%9F%9A%80); es6 can do \u{1F680};

  document.addEventListener("DOMContentLoaded", function() {
    document.body.addEventListener("click", function(e) {
      if (e.target.matches("a[href='index.html']")) {
        e.stopPropagation();
        e.preventDefault();
        window.location.reload(); // preserve query params to keep the facade
      }
    });

    initLinkStubs("a[href='#stub'],.run-ctl,.stage", [
      "Pay no mind to the nerd behind the curtain!"
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

      crel(empty(msg), {class: "anim-fast"}, [
        crel("img", {src: "img/nerd.jpg"}),
        crel("span", [
          randomPhrase(),
          crel("br"),
          crel("br"),
          "(I'm not actually functional)"
        ])
      ]);

      timer = setTimeout(function() {
        empty(msg).classList.remove("anim-fast");
      }, 1500);
    }

    document.body.addEventListener("click", function(e) {
      console.log(e.type)
      console.log(e.target)
      console.log(selector)
      console.log(e.target.matches(selector))

      if (e.target.matches(selector) || closest(e.target, selector)) {
        e.stopPropagation();
        e.preventDefault();
        noWorky();
      }
    });
  }

  function empty(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild)
    }
    return el;
  }

  function closest(el, selector) {
    while (!el.matches(selector)) {
      el = el.parentNode;
    }
    return el;
  }

  function queryRegexpCompile(key) {
    return new RegExp("(\\?|&)" + key + "=([^&]+)(&|$)");
  }

  function newPipelineParam() {
    var match = window.location.search.match(NEW_PIPELINE);
    return match ? match[2].trim() : "";
  }


})(window);
