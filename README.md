# Date Night!
I'm in a long distance relationship.  It sucks, but making it easier to watch
things together makes it suck a little less!

This was inspired by the inevitable countdown to starting a movie, or episode of
Bob's Burgers between me and my SO via skype.  After doing some side projects
with WebSockets, I realized that the amount of data that actually needed to be
traded between hosts to sync the video state was trivial.  Especially if the
bar was set by what could be communicated via skype.

## How it works:
Right now?  Not very well.

I basically inspected the Hulu player for the controls and setup a system to
pass the state of the player to a WebSocket server via the background script of
a web extension.  That data is then propogated to all the connected clients.
Right now, the only guard against bouncing the heck out of the video state is the
fact that there's a node overlaying the control that I found.  Pure luck that...

Anyway.  For testing I use ngrok to portal directly to my localhost and I run the
server there.  But in a more "production" env I would finalize the server spec
and then have it up on AWS or similar.  Ideally there'd be some cloud jiggery
pokery that would let the whole instance be spun up via the extension.  Like an
"Activate Host" button... yeah.  That'd be dang sweet.  In fact, that's going on
the to do list.

# To Do:
0. It looks like the WebSocket times out after a certain period of time.  That's
not ideal.  I need to look into that and make sure that if it does, then it will
re-connect, or somehow check itself back in.

1. The serviceName isn't required, you can just inspect it from the window
location when the content script is loaded.

2. Figure out if it's possible to have a deployed cloud server that is activated
and deactivated at a specific IP or host name via the background script.  Prolly
depends on the HTTP API for the provider, but most of them are probably gonna
have a way...

3. Get the correct controller data for Amazon Prime Video and Netflix.

4. Look into creating a context menu that lets the user define the controller.  
They're probably going to need to select something with an ID on it.  If that isn't
the case, I could use a selection menu populated with the parent and siblings of
the node that they did select....  may be harder than I thought...
