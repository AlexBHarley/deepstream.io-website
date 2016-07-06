# deepstream.io-website-metal

## Setup

- Clone this repo
- Clone also the `ds-docs` repository into the same parent directory
- Clone also the `deepstream.io-client-specs` repository into the same parent directory

To get this hierarchy:

```
.
├── ...
├── deepstream.io-client-specs
├── ...
├── deepstream.io-website-metal
├── ...
├── ds-docs
└── ...
```

```
npm install
npm run sync
```

#### Watch mode

If you want to use the watch script, you need to install [fswatch](https://github.com/emcrisostomo/fswatch)

###### OS X
```
brew install fswatch
````

###### Windows
https://github.com/emcrisostomo/fswatch/issues/88

## Usage

##### `npm start`

Runs the static site genrator (metalsmith).

After generation the process will terminate.

##### `npm run serve`

Runs metalsmith, serve the files via browser-sync and open your browser.

It might take a while until all pages are generated.

So you see an error in your browser, just wait some seconds and refresh the page.


##### `npm run sync`

Deletes all the synced directories of `ds-docs` in `src` and do a fresh copy from the
origin repository (checkout out localy).

##### `npm run watch`

You still need to run `npm run serve` once and keep the process alive.
The watch command will just execute `npm start` each time some file was changed.
Unfortunately browser-sync will not refresh your browser automatically, so you need
to do it by yourself after some seconds, until the `npm start` finished within the watcher.

##### BEEP MODE

Export the `BEEP` variable and you will be notified via a short sound effect that
the generation was finished.

```
export BEEP=1
```

##### NO_DRAFT MODE

If you want to keep documents in the ouput which are flagged as a draft.

```
KEEP_DRAFTS=1 npm start
```

Otherwise they will be deleted in the dist directory.

