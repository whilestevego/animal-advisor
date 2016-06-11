"use strict";

// External Modules
const Request = require("request");

// Node Modules
const FS      = require("fs");
const Path    = require("path");

// Electron Modules
const {clipboard, shell, remote} = require('electron')
const {Menu, MenuItem, dialog}   = remote

const pathTo   = remote.getGlobal("pathTo");
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
  clipboard.writeImage(path);
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
  const title = "Animal Advisor"
  const options = {
    body: "Copied advice animal to clipboard",
    icon: path
  }
  new Notification(title, options);
}

// Context Menu
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
adviceAnimalMenu.append(new MenuItem({ type: "separator" }));
adviceAnimalMenu.append(new MenuItem({
  label: "Copy",
  click: copyToClipboard,
  accelerator: "Command+C"
}));

adviceAnimalImg.addEventListener("contextmenu", function (event) {
  event.preventDefault();
  adviceAnimalMenu.popup(remote.getCurrentWindow());
}, false);

// Copy to Clipboard
function copyToClipboard () {
  const filePath = event.target.src.replace(/file:\/\//,"");
  clipboard.writeImage(filePath);
}

// Save Image as... Dialog
function showSaveImageAsDialog () {
  const options = { title: "Save Image as..." };
  dialog.showSaveDialog(remote.getCurrentWindow(), options, handleSaveDialog);
}

function handleSaveDialog (path) {
  const sourcePath = event.target.src.replace(/file:\/\//,"");
  const extension = Path.extname(sourcePath);
  const destinationPath = path + extension;

  copyFile(sourcePath, destinationPath, handleFileCopy(destinationPath));
}

function handleFileCopy (path) {
  return function (error) {
    if (error) {
      dialog.showErrorBox("Save Image as... failed", error)
    } else if (path) {
      shell.showItemInFolder(path);
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
