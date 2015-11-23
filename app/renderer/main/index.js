"use strict";

// External Modules
const Request = require("request");

// Node Modules
const FS      = require("fs");
const Path    = require("path");

// Electron Modules
const Shell    = require("shell");
const Remote   = require("remote");
const Menu     = Remote.require("menu");
const MenuItem = Remote.require("menu-item");
const Dialog   = Remote.require("dialog");

const pathTo   = Remote.getGlobal("pathTo");
const AnimalAdvisor = require(`${pathTo.lib}/animal-advisor`);

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

function resetAdviceAnimal () {
  adviceAnimalImg.src = `${pathTo.images}/doge-icon-512.png`;
  adviceAnimalImg.className = "placeholder";
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

const adviceAnimalMenu = new Menu();

adviceAnimalMenu.append(new MenuItem({
  label: "Reset",
  click: resetAdviceAnimal
}));
adviceAnimalMenu.append(new MenuItem({
  label: "Save Image as...",
  click: showSaveImageAsDialog,
  accelerator: "Command+Shift+S"
}));

adviceAnimalImg.addEventListener("contextmenu", function (event) {
  event.preventDefault();
  adviceAnimalMenu.popup(Remote.getCurrentWindow());
}, false);

function showSaveImageAsDialog() {
  const options = { title: "Save Image as..." };
  Dialog.showSaveDialog(Remote.getCurrentWindow(), options, handleSaveDialog);
}

function handleSaveDialog (path) {
  const sourcePath = event.target.src.replace(/file:\/\//,"");
  const extension = Path.extname(sourcePath);
  const destinationPath = path + extension;

  copyFile(sourcePath, destinationPath, handleCopy(destinationPath));
}

function handleCopy (path) {
  return function (error) {
    if (error) {
      Dialog.showErrorBox("Save Image as... failed", error)
    } else if (path) {
      Shell.showItemInFolder(path);
    };
  }
};

function copyFile(source, target, callback) {
  let callbackCalled = false;

  const readStream = FS.createReadStream(source);
  readStream.on("error", function(error) { done(error); });

  const writeStream = FS.createWriteStream(target);
  writeStream.on("error", function(error) { done(error); });
  writeStream.on("close", function(ex) { done(); });

  readStream.pipe(writeStream);

  function done(error) {
    if (!callbackCalled && callback) {
      callback(error);
      callbackCalled = true;
    }
  }
}
