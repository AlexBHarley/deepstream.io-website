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

Runs the static site generator (metalsmith).

After generation the process will terminate.

##### `npm run serve`

Runs a webserver via browser-sync, which serves the data in `dist`.
Afterwards open [localhost:3000](http://localhost:3000) in your browser.

##### `npm run sync`

Deletes all the synced directories of `ds-docs` in `src` and do a fresh copy from the
origin repository (checkouted out locally).

##### `npm run watch`

You __must__ run `npm run serve` before and keep the process alive.
Whenever a file was changed and the regeneration is done your browser will
refresh the page automatically.

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

Otherwise they will be deleted (not generated) in the dist directory.

