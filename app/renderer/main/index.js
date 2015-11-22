"use strict";

const Remote = require("remote");
const pathTo = Remote.getGlobal("pathTo");

const AnimalAdvisor = require(`${pathTo.lib}/meme`);
const Request       = require("request");

const searchQueryInput = document.querySelector("#search-query");
const adviceAnimalImg  = document.querySelector("#advice-animal");

searchQueryInput.addEventListener("input", function (event) {
  global.adviceAnimalQuestion = event.target.value;
});

searchQueryInput.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    loading();
    const advisor = AnimalAdvisor.create(pathTo.cache);
    advisor.say(global.adviceAnimalQuestion).then(setImage).done();
  }
});

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
