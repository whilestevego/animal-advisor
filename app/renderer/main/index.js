"use strict";

const Remote = require("remote");
const pathTo = Remote.getGlobal("pathTo");

const Meme    = require(`${pathTo.lib}/meme`);
const Q       = require("q");
const Request = require("request");
const fs      = require("fs");
const lwip    = require("lwip");

const searchQueryInput = document.querySelector("#search-query");
const adviceAnimalImg = document.querySelector("#advice-animal");

searchQueryInput.addEventListener("input", function (event) {
  global.adviceAnimalQuestion = event.target.value;
});

searchQueryInput.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    loading();
    const promise = Meme.say(global.adviceAnimalQuestion);
    promise.delay(200).then(downloadImage).then(setImage).done();
  }
});

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

function downloadImage (response) {
  return Q.Promise(function (resolve, reject, notify) {

    const url = response.request.href;

    if (response.statusCode === 404) {
      console.log("404 – Not Found; Trying again...");
      resolve(Q.resolve(url).then(getResponse));
    } else {

      const extension   = /image\/(\w+)\b/.exec(response.headers["content-type"])[1];
      const filename    = response.headers["meme-text"].replace(/[^A-Za-z+]/g, "").replace(/\+/g,"-");
      const location    = `${pathTo.cache}/${filename}.${extension}`;
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

function verifyImage (writeStream) {
  return Q.Promise(function (resolve, reject, notify) {

    console.log("Verifying image...");
    lwip.open(writeStream.path, function (error, image) {
      if (error) {
        console.log(error);
        resolve(Q.resolve(writeStream.originResponse).delay(200).then(downloadImage));
      } else {
        resolve(writeStream.path);
      }
    });

  })
};

function setImage (path) {
  console.log("Setting image...");
  adviceAnimalImg.src = path;
  adviceAnimalImg.className = "";
  sendNotification(path);
}

function loading () {
  adviceAnimalImg.src = `${pathTo.images}/doge-icon-512.png`;
  adviceAnimalImg.className = "loading";
}

function sendNotification (path) {
  const title = "Animal Advisor says..."
  const options = {
    body: "Image download complete!",
    icon: path
  }
  new Notification(title, options);
}
