"use strict";

const Captain = require("node-memecaptain-api");
const Q       = require("q");
const _       = require("lodash");
const fs      = require("fs");
const jimp      = require("jimp");

function create (cachePath) {
  const adviceAnimals = [
    {
      // Match custom "x|y|z" meme first or it may get matched by another pattern.
      pattern: /^(?:(https?:\/\/[^|\s]+\.(?:jpe?g|gif|png)[^|\s]*)|([^|]+))\s*\|\s*([^|]*)\s*\|\s*([^|]*)/i,
      help: "<b>{image url or search}</b> | <b>{top text}</b> | <b>{bottom text}</b>",
      run: function () {
        if (this.$1) {
          return generate(this.$1, this.$3, this.$4);
        } else {
          let image = images.search({
            query: this.$2,
            first: true
          });
          if (image) {
            return generate(image.unescapedUrl, this.$3, this.$4);
          } else {
            //TODO Return as resolved promise error
            return "Sorry, your search didn't yield any usable images";
          }
        }
      }
    }, {
      pattern: /^(y u no) (.*)/i,
      help: "y u no <b>{text}</b>",
      url: "NryNmg",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^aliens? guy (.+)/i,
      help: "aliens guy <b>{text}</b>",
      url: "sO-Hng",
      run: function () {
        return generate(this.url, "", this.$1);
      }
    }, {
      pattern: /^((?:prepare|brace) (?:yourself|yourselves)) (.+)/i,
      help: "brace yourself <b>{text}</b>",
      url: "_I74XA",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(.*) (all the .*)/i,
      help: "<b>{text}</b> all the <b>{things}</b>",
      url: "Dv99KQ",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(i don'?t (?:always|normally) .*) (but when i do,? .*)/i,
      help: "I don't always <b>{something}</b> but when I do <b>{text}</b>",
      url: "V8QnRQ",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(.*) (\w+\stoo damn .*)/i,
      help: "<b>{text}</b> too damn <b>{something}</b>",
      url: "RCkv6Q",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(not sure if .*) (or .*)/i,
      help: "not sure if <b>{something}</b> or <b>{something else}</b>",
      url: "CsNF8w",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(yo dawg,? .*) (so .*)/i,
      help: "yo dawg <b>{text}</b> so <b>{text}</b>",
      url: "Yqk_kg",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(all your .*) (are belong to .*)/i,
      help: "all your <b>{text}</b> are belong to <b>{text}</b>",
      url: "76CAvA",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(one does not simply) (.*)/i,
      help: "one does not simply <b>{text}</b>",
      url: "da2i4A",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(if you .*\s)(.* gonna have a bad time)/i,
      help: "if you <b>{text}</b> gonna have a bad time",
      url: "lfSVJw",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(if .*), ((?:are|can|do|does|how|is|may|might|should|then|what|when|where|which|who|why|will|won't|would) .*)/i,
      help: "if <b>{text}</b>, <b>{word that can start a question}</b> <b>{text}</b>?",
      url: "-kFVmQ",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^((?:how|what|when|where|who|why) the (?:hell|heck|fuck|shit|crap|damn)) (.*)/i,
      help: "<b>{word that can start a question}</b> the <b>{expletive}</b> <b>{text}</b>",
      url: "z8IPtw",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(?:success|nailed it) when (.*) then (.*)/i,
      help: "success when <b>{text}</b> then <b>{text}</b>",
      url: "AbNPRQ",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(?:fwp|cry) when (.*) then (.*)/i,
      help: "cry when <b>{text}</b> then <b>{text}</b>",
      url: "QZZvlg",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^bad luck when (.*) then (.*)/i,
      help: "bad luck when <b>{text}</b> then <b>{text}</b>",
      url: "zl3tgg",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^scumbag(?: steve)? (.*) then (.*)/i,
      help: "scumbag <b>{text}</b> then <b>{text}</b>",
      url: "RieD4g",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(what if i told you) (.+)/i,
      help: "what if I told you <b>{text}</b>",
      url: "fWle1w",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(i hate) (.+)/i,
      help: "I hate <b>{text}</b>",
      url: "_k6JVg",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(why can'?t (?:i|we|you|he|she|it|they)) (.+)/i,
      help: "why can't <b>{personal pronoun}</b> <b>{text}</b>",
      url: "gdNXmQ",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(.+),? (so i(?:(?:(?:'?ve)? got)|(?: have)) that going for me(?:,? which is nice)?)/i,
      help: "<b>{text}</b> so I got that going for me",
      url: "h9ct5g",
      run: function () {
        let text2 = this.$2;
        if (!/\bwhich is nice$/.test(text2)) {
          text2 += ", which is nice";
        }
        return generate(this.url, this.$1, text2);
      }
    }, {
      pattern: /^(.+),? (how (?:do (?:they|I)|does (?:he|she|it)) work\??)/i,
      help: "<b>{things}</b>, how do they work?",
      url: "3V6rYA",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(.+?(?:a{3,}|e{3,}|i{3,}|o{3,}|u{3,}|y{3,}).*)/i,
      help: "{text}<b>{3 x a|e|i|o|u|y}</b>{text}",
      url: "L50mqA",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(do you want .*) (because that'?s how .*)/i,
      help: "do you want <b>{text}</b> because that'?s how <b>{text}</b>",
      url: "bxgxOg",
      run: function () {
        return generate(this.url, this.$1, this.$2);
      }
    }, {
      pattern: /^(i should .*)/i,
      help: "i should <b>{text}</b>",
      url: "LPTw8A",
      run: function () {
        return generate(this.url, "", this.$1);
      }
    }
  ];

  function say (what) {
    what = what ? what.trim() : null;

    if (what) {
      let match;

      let adviceAnimal = _.find(adviceAnimals, function (value) {
        match = value.pattern.exec(what);
        return !!match;
      });

      if (match) {
        _.forOwn(match, function (value, key) { adviceAnimal["$" + key] = value })
        return adviceAnimal.run();
      } else {
        //TODO: Resolve as a promise
        return "Sorry, I didn't understand that";
      }
    } else {
      return helper(exports);
    }
  }

  function generate (sourceImage, topText, bottomText) {
    return Captain.createMeme(sourceImage, topText, bottomText).delay(200).then(downloadImage);
  }

  function downloadImage (response) {
    return Q.Promise(function (resolve, reject, notify) {
      const url = response.request.href;

      if (response.statusCode === 404) {
        console.log("404 – Not Found; Trying again...");
        resolve(Q.resolve(url).then(getResponse));
      } else {

        const extension   = /image\/(\w+)\b/.exec(response.headers["content-type"])[1];
        const filename    = response.headers["meme-text"].replace(/[^A-Za-z+]/g, "").replace(/\+/g,"-");
        const location    = `${cachePath}/${filename}.${extension}`;
        const writeStream = fs.createWriteStream(location);

        console.log(`Downloading ${url}...`);
        Request(url).pipe(writeStream);

        writeStream.on("finish", function () {
          this.originResponse = response;
          resolve(verifyImage(this));
        });

        writeStream.on("error", function (error) { reject(new Error(error)) });
      }
    })
  };

  function getResponse (url) {
    return Q.Promise(function (resolve, reject, notify) {

      console.log("Getting response...");
      Request(url, function (error, response) {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(Q.resolve(response).delay(200).then(downloadImage));
        }
      });

    })
  };

  function verifyImage (writeStream) {
    return Q.Promise(function (resolve, reject, notify) {

      jimp.read(writeStream.path, function (err, image) {
        if (err) {
          console.error(err)
          resolve(Q.resolve(writeStream.originResponse).delay(200).then(downloadImage))
        } else {
          resolve(writeStream.path)
        }
      });
    })
  };

  return {
    say: say
  }
}

exports.create = create;
