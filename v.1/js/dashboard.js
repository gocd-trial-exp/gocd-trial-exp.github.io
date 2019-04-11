(function(global) {
  var NEW_PIPELINE = queryRegexpCompile("new_pipeline_name");
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
    var mp = document.getElementById("my-pipelines");
    if ("" !== newPipelineParam()) {
      mp.querySelector(".pipeline .name").textContent = newPipelineParam();
      mp.classList.remove("start-with-empty");
      var pipe = mp.querySelector(".pipeline");
      pipe.classList.add("trial-first-created");

      setTimeout(function() {
        pipe.classList.remove("trial-first-created");
      }, 1500)
    }
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
