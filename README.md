## process
Two users are online to watch something, they both have access to the service.
For example, hulu:

They navigate to the video they want to watch together.
They then pause it at some arbitrary amount of time into the video.
They press the browserAction button to initialize syncing of the video's state.


Sync:
  - The videos are assumed to be paused
    - checks are possible, but it's easier for the MVP to just assume
  - The onClick for the browserAction sets up the WebSocket, and messages the
    content script so that the video player control is setup.
