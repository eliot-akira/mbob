# mbob

Fast, minimal build system with parallel processes and live-reload server

## Local install

Install `mbob` as local dev dependency.

```bash
npm install mbob --save-dev
```

Provide npm scripts in package.json.

```json
"scripts": {
  "build": "mbob build",
  "dev": "mbob"
}
```

Create an `.mbob` file (see below).

## Global install

Another way is to install it as a global utility.

```bash
npm install mbob -g
```

**New project**

Run `mbob init` with a new project name.

```bash
mbob init app
```

Starter files include:

- `.babelrc`
- `.gitignore`
- `.mbob`
- `package.json`
- `src` folder with empty index.js, scss, html

The only requirement is `.mbob` in the current working directory.

**Dev dependencies**

Install commands to be used by build tasks, such as `babel` and `node-sass`.

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

There's a shortcut: `mbob b`

## Configure

`.mbob` is a configuration file written in [Human JSON](http://hjson.org/).

Here is an example `.mbob` with comments.

```hjson
# (optional) Define variables: $name, $src, $dest

name: app
src: src
dest: build

# (optional) Command to run before build

before: mkdir -p $dest

# Build tasks to run in parallel

build: {

  css: {

    # Build and dev commands are run from local node_modules/.bin
    # if they're defined as dependencies in package.json

    # Build command: minified, no sourcemap

    build: node-sass --output-style compressed $in $out

    # (optional) dev command: compile with sourcemap

    dev: node-sass --source-map-contents --source-map-embed $in -w $out

    # (optional) Entry for bundle(s)

    entry: {

      # (optional) Define variables to pass to build/dev command

      in: $src/index.scss
      out: $dest/$name.css

      # css entry doesn't need to watch files, because node-sass -w

      # watch: $src/**/*.scss
    }

    # For multiple bundles, give entry as array: [{ in,out }, { in,out }, ...]
    # build/dev command will be run for each entry

  }

  html: {

    build: html-transform $in $out

    # If there is no dev command, the build command will be run on file change

    entry: {
      in: $src/index.html
      out: $dest/index.html      

      # (optional) Watch files, build and reload on change

      watch: $src/*.html
    }
  }

  js: {

    build: browserify -p [ minifyify --compressPath . --no-map ] -t babelify $in -o $out

    dev: watchify -v -d -t babelify $in -o $out

    entry: {

      in: $src/index.js
      out: $dest/$name.js

      # js entry doesn't need to watch files, because watchify

      # watch: $src/**/*.js
    }
  }
}

# Static file server

serve: {

  # Serve from this directory

  from: $dest

  # Serve at localhost port

  port: 3000

  # Reload when js bundle is compiled

  reload: [
    $dest/*.js
  ]

  # Reload CSS when css bundle is compiled
  # This will apply new styles without reloading the browser

  reloadCSS: [
    $dest/*.css  
  ]
}
```
