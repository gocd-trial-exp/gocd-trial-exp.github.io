(function(global) {
  document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("test-connection").addEventListener("click", function(e) {
      var url = (document.querySelector("input[name='url']").value || "").trim();
      var result = document.getElementById("connection-result");
      var button = e.currentTarget;
      connectionTest(url, function before() {
        button.setAttribute("disabled", "disabled");
        empty(result).appendChild(document.createTextNode("..."))
      }, function success() {
        button.removeAttribute("disabled");
        writeConnectionResult(result, "Connection successful!",
          crel("i", {class: "fas fa-check success"}));
      }, function fail(message) {
        button.removeAttribute("disabled");
        writeConnectionResult(result, message,
          crel("i", {class: "fas fa-times fatal"}));
      });
    });

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

  function writeConnectionResult(el, message, fontawesome) {
    var frag = document.createDocumentFragment();
    frag.appendChild(document.createTextNode(message));
    frag.appendChild(fontawesome);
    empty(el).appendChild(frag);
  }

  function connectionTest(url, before, done, fail) {
    if (!connectionTest.running) {
      connectionTest.running = true;

      if ("" === url) {
        connectionTest.running = false;
        return fail("URL is blank");
      }

      before();
      setTimeout(function() {
        done();
        connectionTest.running = false;
      }, 400);
    }
  }

  // function asyncStub(fn, time, ontimeup) {
  //   var running = false;
  //   return function() {
  //     if (running) { return; }
  //     running = true;
  //     fn.apply(this, arguments);
  //     setTimeout()
  //   }
  // }

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
