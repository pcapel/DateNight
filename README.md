# Date Night!
I was in a long distance relationship for nearly 2 years  One of the things that
helped to make it feel like it wasn't so bad was watching television/movies
together while we were on a video call. The only problem with that was that we
had a devil of a time keeping the videos in sync!

This was inspired by the inevitable countdown to starting a movie, or episode of
Bob's Burgers between me and my SO via skype. After doing some side projects
with WebSockets, I realized that the amount of data that actually needed to be
traded between hosts to sync the video state was trivial.

## How does it work?
At the moment, it doesn't really work all that well. I'll be the first to admit
that I don't know all that much about the domain. However, I have some ideas
that I think will really set this up to succeed.

Initially, I basically inspected the Hulu player for the controls and setup a
system to pass the state of the player to a WebSocket server via the background
script of a web extension. That data is then propogated to all the connected clients.
I did run into an issue where the sync of the player state wasn't really being kept
anywhere, so they just bounced messages back and forth pausing an playing in a loop.

I think I need to model the system better. So what I'm planning to do is create a
TLA+ spec of the system. It's a really simple system, so this is basically an
excuse for me to write some TLA+. On the other hand, it will be good to validate
the design before I go about building it.

The actual web extension is obviously javascript, and I had initially written the
server with express. Because I want to have lightning fast websockets though, I'm
thinking that I want to move the back end to elixir. Again, this is really just an
excuse for me to use technologies that I'm interested in, so deal with that.

The front end as well will be written out with typescript using a more functional
approach. Practice makes perfect and I've been interested in getting better at
functional programming for a while.

As far as testing goes, setting up ngrok to run a portal to the server instance
is probably the easiest. Especially if you have a second computer handy to let
you run the program across the wire for real. Barring that though, I'm not actually
sure... I should definitely have some unit tests, but integration testing/end to end
testing is going to require a bit more thought. It could probably be done using
some fancy container jiggery pokery.


