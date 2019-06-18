(function(global) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function() {
    initMaterialSection();
    initTaskTerminal(document.querySelector(".exec-editor"));
    setTimeout(function() {
      document.querySelector('.fillable input').focus();
    }, 10);

    document.getElementById("save-and-run").addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      var pipelineName = (document.querySelector("input[name='pipeline-name']").value || "").trim();

      if ("" !== pipelineName) {
        window.location = e.currentTarget.getAttribute("href") + "?new_pipeline_name=" + pipelineName;
      } else {
        empty(document.getElementById("validation-msg")).textContent = "Pipeline name is missing!";
      }
    });

    initLinkStubs("a[href='#stub']", [
      "Pay no mind to the nerd behind the curtain!"
    ]);
  });

  function initMaterialSection() {
    var matType = document.getElementById("material-type");
    var matField = closest(matType, ".field");

    matField.setAttribute("data-type", matType.value);
    matType.addEventListener("change", function() {
      matField.setAttribute("data-type", matType.value);
    });

    document.getElementById("test-connection").addEventListener("click", function(e) {
      var url = (document.querySelector("input[name='url']").value || "").trim();
      var result = document.getElementById("connection-result");
      var button = e.currentTarget;
      connectionTest(url, function before() {
        button.setAttribute("disabled", "disabled");
        empty(result).appendChild(document.createTextNode("..."))
      }, function success() {
        button.removeAttribute("disabled");
        writeConnectionResult(result, "Connection succeeded!",
          crel("i", {class: "fas fa-check success"}));
      }, function fail(message) {
        button.removeAttribute("disabled");
        writeConnectionResult(result, message,
          crel("i", {class: "fas fa-times fatal"}));
      });
    });

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

        if (url.match(/\bbad-url\b/i)) {
          setTimeout(function() {
            fail("Connection failed!");
            connectionTest.running = false;
          }, 400);
        } else {
          setTimeout(function() {
            done();
            connectionTest.running = false;
          }, 400);
        }
      }
    }
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

  function initTaskTerminal(term) {
    var ENTER = 13;
    var EDITOR = term.querySelector(".current-editor");

    (function setup() {
      document.body.addEventListener("click", function(e) {
        saveCommand(EDITOR, true);
      });

      document.getElementById("save-and-run").addEventListener("click", function(e) {
        saveCommand(EDITOR, true);
      });

      term.addEventListener("keydown", function(e) {
        if (e.target.matches(".current-editor")) {
          keybindings(e);
        }
      });

      term.addEventListener("click", function(e) {
        if (e.target.matches(".current-editor")) {
          e.stopPropagation(); // prevents need to click twice to focus caret in contenteditable on page load
        }

        if (e.target.matches(".task,.task *")) {
          editCommand(e, EDITOR);
        }
      });

      document.querySelector(".hideable").addEventListener("dblclick", function(e) {
        e.currentTarget.classList.toggle("closed");
        e.stopPropagation();
        e.preventDefault();
      });

      // setTimeout(function() { EDITOR.focus(); }, 0);
    })();

    function editCommand(e, editEl) {
      e.stopPropagation();console.log("c")
      var el = closest(e.target, ".task");
      saveCommand(editEl);
      editEl.textContent = [ // be sure to use textContent to preserve newlines
        el.querySelector(".cmd").textContent,
        el.querySelector(".args").textContent
      ].join(" ").trim();

      el.parentNode.insertBefore(editEl, el);
      el.parentNode.removeChild(el);
      setTimeout(function(){ editEl.focus(); }, 0);
    }

    function saveCommand(el, moveToBottom) {
      if (!el) {
        el = EDITOR;
      }
      var line = el.innerText.trim(); // preserves newlines in FF vs textContent

      if ("" !== line) {
        var cmdStr = line, argStr = "";
        var extractedCommand = false;
        var args = Shellwords.split(line, function(token) {
          if (!extractedCommand) {
            // get the raw cmd string and argStr to
            // preserve exactly what the user typed, so as
            // to include whitespace and escape chars
            cmdStr = line.slice(0, token.length).trim();
            argStr = line.slice(token.length).trim();
            extractedCommand = true;
          }
        });
        var cmd = args.shift();
        var saved = crel("pre", {class: "task"}, [
          crel("span", {class: "cmd", "data-cmd": JSON.stringify(cmd)}, cmdStr),
          crel("span", {class: "args", "data-cmd": JSON.stringify(args)}, argStr)
        ]);

        log("Parsed command that can be sent to server:", {
          cmd: cmd,
          args: args
        });

        el.parentNode.insertBefore(saved, empty(el));
      }

      if (moveToBottom && el !== el.parentNode.lastChild) {
        el.parentNode.appendChild(el)
      }
    }

    function keybindings(e) {
      switch (e.which) {
        case ENTER:
          if (e.shiftKey) {
          } else {
            e.preventDefault();
            e.stopPropagation();
            saveCommand(e.target);
          }
          break;
      }
    }

    function log(msg, obj) {
      // var frag = document.createDocumentFragment();
      // frag.appendChild(crel("h3", "Debugging messages"));
      // if (arguments.length > 1) {
      //   msg += " " + JSON.stringify(obj, null, 2);
      // }
      // frag.appendChild(document.createTextNode(msg));
      // empty(document.getElementById("messages")).appendChild(frag);
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
})(window);

// Gratuitously nabbed (and modified to work in browser) from https://raw.githubusercontent.com/jimmycuadra/shellwords/master/lib/shellwords.js
(function(exports) {
  var scan;

  scan = function(string, pattern, callback) {
    var match, result;
    result = "";
    while (string.length > 0) {
      match = string.match(pattern);
      if (match) {
        result += string.slice(0, match.index);
        result += callback(match);
        string = string.slice(match.index + match[0].length);
      } else {
        result += string;
        string = "";
      }
    }
    return result;
  };

  exports.split = function(line, callback) {
    var field, words;
    if (line == null) {
      line = "";
    }
    words = [];
    field = "";
    rawParsed = "";
    scan(line, /\s*(?:([^\s\\\'\"]+)|'((?:[^\'\\]|\\.)*)'|"((?:[^\"\\]|\\.)*)"|(\\.?)|(\S))(\s|$)?/, function(match) {
      var dq, esc, garbage, raw, seperator, sq, word;
      raw = match[0], word = match[1], sq = match[2], dq = match[3], esc = match[4], garbage = match[5], seperator = match[6];
      if (garbage != null) {
        throw new Error("Unmatched quote");
      }
      rawParsed += match[0];
      field += word || (sq || dq || esc).replace(/\\(?=.)/, "");
      if (seperator != null) {
        words.push(field);
        if ("function" === typeof callback) {
          callback(rawParsed);
        }
        rawParsed = "";
        return field = "";
      }
    });
    if (field) {
      words.push(field);
    }
    return words;
  };

  exports.escape = function(str) {
    if (str == null) {
      str = "";
    }
    if (str == null) {
      return "''";
    }
    return str.replace(/([^A-Za-z0-9_\-.,:\/@\n])/g, "\\$1").replace(/\n/g, "'\n'");
  };

})(window.Shellwords = {});
