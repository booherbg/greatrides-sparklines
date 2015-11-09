# Great Rides Bike Share Sparklines Project

This project was created by Blaine Booher and Matt Nohr as part of the Hack Fargo Visualization Hackathon on Nov 708 2015. We ended up taking third place :)
See the [https://rawgit.com/booherbg/greatrides-sparklines/master/index.html](Online Demo) which is hosted through a proxy that links directly to this github repo.

The Great Rides Bike Share program in Fargo, ND launched in Spring 2015, and became the most successful program 
in the country by volume. This dataset was provided by GRBS and represents over 143k rides over the entire 8 month season.

We chose to explore the entire season of data through the use of the visualization technique known as (http://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0001OR&topic_id=1)[Sparklines]
"A sparkline is a small intense, simple, word-sized graphic with typographic resolution".

Running this app locally
------------------------
If you want to run this on your own, it's easy. Just clone it and open it in your browser. There are no external dependencies (unless you want to re-compute stats, but thats just vanilla python). 
I'd recommend serving via an http server, rather than opening it locally (to make sure the data loads correctly). In short -- you can serve this out with any http library. I like to just use python's built in http server (run this from the root directory, and then visit http://localhost:8000):

``` bash
$ python -m SimpleHTTPServer
```

The scripts/ folder contains stats.py, which computes the json based on aggregate statistical data. It's easier to pre-compute and regenerate the json file rather than muck around on the client side. It also does things like fill in missing dates and concatenate similar station names into the same entry.

Check back soon for updates. I intend to keep this project active as an exploratory venture in visualization.
