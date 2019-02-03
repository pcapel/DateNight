/*
The process from the backend script needs to be, inspect the localstorage
variables for the relevant values, pass them to the content script.  All the
logic on the content will need to be wrapped such that I can re-send a message
with new variables and have them updated for consumption.
*/
var portFromCS, socket;

function connected(p) {
  portFromCS = p;
  portFromCS.onMessage.addListener(function(message) {
    if (!!socket) {
      socket.send(JSON.stringify(message))
    }
  });
}

browser.runtime.onConnect.addListener(connected);

browser.browserAction.onClicked.addListener(() => {
  if (portFromCS === undefined) {
    throw console.error('Content Script port is not opened, is the content script loaded?')
  }
  let host = browser.storage.sync
             .get('hostUrl')
             .then(setSocket)
  portFromCS.postMessage({action: "sync"});
});

const setSocket = (obj) => {
  let host = obj.hostUrl
  if (!socket) {
    if (host.includes('ws:')){
      socket = new WebSocket(host, "host")
    }
    else {
      socket = new WebSocket('ws:' + host)
    }
    socket.onmessage = (message) => {
      // message contains the stringified "action" object as the data prop
      portFromCS.postMessage(JSON.parse(message.data))
    }
    return;
  }
}

browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync') {
    let keys = Object.keys(changes);
    if (keys.indexOf('hostUrl') >= 0) {
      console.log("content update", changes.hostUrl.newValue)
    }
    if (keys.indexOf('serviceName') >= 0) {
      let newName = changes.serviceName.newValue
      portFromCS.postMessage({action: 'updateService', data: newName})
    }
  }
})
