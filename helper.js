/*
This is where the control script messages get translated to page actions.
The real question is, how do you determine the initial state?
For the Hulu base case it's actually pretty easy.  You can just use the
CSS selector to get the state of the video from the application.
I'll start with that.  The content script should run on each page load, so
I'll need to see how that works.

I can make small adjustments to the currentTime attribute of the video player
and they'll be correctly reflected, so I need to get that grabbed some how.

video-player content-video-player

that's the query selector string for hulu.  The currentTime will be a big part
of the state that is sent to the server so that each player is sure to be within
about 0.5 seconds of each other.  I hope that works out. lol

Because nobody is navigating directly to the video, and the hulu applicaiton is
a SPA with navigation handle without a page load, I'm SOL

So what I think will need to be done is to trigger the video share with the
browser action button.  Once clicked it will restart the video on both ends and
create all the connections to make things work.
*/
var player, networkLatency;
var clientId = getRandomInt(1000)
var browser = browser || chrome
var myPort = browser.runtime.connect({name:"port-from-cs"})
myPort.postMessage({type: "play", data: "I will be video metadata"})

const triggerClick = (node, ) => {

}

const Controller = {
  hulu: () => {
    return document.querySelectorAll("div.controls__playback-button")[0]
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

class Video {
  /*
  So creating my own object for this is fine, but the underlying video element
  has an API that is essentially this.  It works, but the downside is that the
  UI is looking for click events in order to update.  That means that the state
  will flip flop, and the user's keypress will not perform the correct action
  if they were programmaticaly affected.
  Let's say you have Client 1 and Client 2:
  Client 1 - presses pause
  _signal transmits and_
  Client 2 - programmatically paused
  Client 2 - attempts to press play

  Client 2 will have to press twice, because the state is mismatched.
  */

  constructor(site) {
    this.controller = Controller[site]();
    this._video = document.querySelector('video.video-player.content-video-player')
    this.is_playing = true;
  }

  getState() {
    // this is probably dragging ass and making the whole thing screw up.
    return String.prototype.includes(this.controller.className, "paused") ? "paused" : "playing"
  }

  setTime(t) {
    // kinda fragile ATM, the video doesn't like to be set to something that
    // hasn't been buffered yet as far as I can tell.
    this._video.currentTime = t;
  }

  pause() {
    console.log('pause method called')
    console.log("guard is ", this.getState() === "playing")
    if (this.getState() === "playing") {
      this.controller.click()
      this.is_playing = false
    }
  }

  play() {
    console.log('play method called')
    console.log("guard is ", this.getState() === "paused")
    if (this.getState() === "paused") {
      this.controller.click()
      this.is_playing = true
    }
  }

  toggle() {
    this.controller.click()
    this.is_playing = !this.is_playing
  }
}

myPort.onMessage.addListener(({action, timeStamp, originClientId}) => {
  console.log('server enforced state: ', action, timeStamp)
  console.log('client states: ', clientId, originClientId)
  switch (action) {
    case 'sync':
      console.log('sync up')
      player = new Video('hulu');
      player.controller.addEventListener('click', (e) => {
        if (e.target !== player.controller) {
          myPort.postMessage({
            action: player.is_playing ? "pause" : "play",
            timeStamp: player._video.currentTime,
            originClientId: clientId
          })
          player.is_playing = !player.is_playing
        }
      })
      // ensure time is synced to 0
      // eventually it'd be cool to have a "save place" function where the users
      // can mark a timestamp to save and the video URL with it.
      player.setTime(0)
      /*
      this is where I should have a promise that resolves to play
      when the background script gets a signal from the server that
      sync is complete.  Sync should somehow set the network latency
      so that there's an adaptive wait period for any events.
      */
      break;
    case 'pause':
      if (originClientId !== clientId) {
        player.pause()
        // ensure the videos are synced
        player._video.currentTime = timeStamp
      }
      break;
    case 'play':
      if (originClientId !== clientId) {
        player.play()
      }
      break;
    default:
      break;
  }
});
