# mbob

Minimal build system with parallel processes and live-reload server

## Setup

**Install**

```bash
npm install mbob -g
```

**New project**

For a quick start, run `mbob init` with a new project name.

```bash
mbob init app
```

Starter files include:

- `.babelrc`
- `.gitignore`
- `.mbob`
- `package.json`
- `src` folder with index.js, scss, html

The only requirement is `.mbob` in the current working directory.

**Dev dependencies**

Install commands used by build tasks, such as `babel` and `node-sass`.

```
cd app
npm install
```

## Use

**Develop**

Start a static file server that will watch files, build and reload on change.

```
mbob
```

**Build**

For production, build minified bundles with no sourcemap.

```
mbob build
```

## Configure

`.mbob` is a configuration file in [Human JSON](http://hjson.org/).

Here is the starter `.mbob` with comments.

```hjson

# (optional) define variables: $name, $src, $dest

name: app
src: src
dest: build

# (optional) command to run before build

before: mkdir -p $dest

# build tasks to run in parallel

build: {

  css: {

    # build command: minified, no sourcemap

    build: node-sass --output-style compressed $in $out

    # dev command: compile with sourcemap

    dev: node-sass --source-map-contents --source-map-embed $in $out

    # entry for bundle(s)

    entry: {

      # (optional) define variables to pass to build/dev command

      in: $src/index.scss
      out: $dest/$name.css

      # watch files, build and reload on change

      watch: $src/**/*.scss
    }

    # define entry as array for multiple bundles: [{ in,out }, { in,out }, ...]

  }

  html: {

    # if there is no dev command, build will be used

    build: cp $src/*.html $dest

    # if there is no entry, watch can be defined at task level

    watch: $src/*.html
  }

  js: {

    build: browserify -p [ minifyify --compressPath . --no-map ] -t babelify $in -o $out

    dev: watchify -v -d -t babelify $in -o $out

    entry: {

      in: $src/index.js
      out: $dest/$name.js

      # js entry doesn't need to watch files, because watchify takes care of it

      # watch: $src/**/*.js
    }
  }

}

# static file server

serve: {

  # serve from this directory

  from: $dest

  # localhost port

  port: 3000

  # reload when watchify compiles a js bundle

  reload: [
    $dest/*.js
  ]
}
```
