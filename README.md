
## Use

**Install**

```bash
npm install mbob -g
```

**Start a new project**

```bash
mbob init app
```

It creates a folder with starter files:

- `.babelrc`
- `.gitignore`
- `.mbob`
- `package.json`
- `src` - folder with index.js, scss, html

**Install dev dependencies**

```
cd app
npm install
```

**Develop**

This starts a server that will watch files for changes, then rebuild/reload.

```
mbob
```

**Build**

```
mbob build
```

## Configure

`.mbob` is a configuration file in [Human JSON](http://hjson.org/).

```hjson
name: app
src: src
dest: build

before: mkdir -p $dest

build: {

  js: {
    build: browserify -p [ minifyify --compressPath . --no-map ] -t babelify $in -o $out
    dev: watchify -v -d -t babelify $in -o $out
    entry: {
      in: $src/index.js
      out: $dest/$name.js
    }
  }

  css: {
    build: node-sass --output-style compressed $in $out
    dev: node-sass --source-map-contents --source-map-embed $in $out
    entry: {
      in: $src/index.scss
      out: $dest/$name.css
      watch: $src/**/*.scss
    }
  }

  html: {
    build: cp $src/*.html $dest
    watch: $src/*.html
  }
}

serve: {
  from: $dest
  port: 3000
  reload: [
    $dest/*.js
  ]
}
```

The *entry* field can be an array.

```
entry: [
  {
    in: $src/index.js
    out: $dest/$name.js
  }
  {
    in: $src/page.js
    out: $dest/page.js
  }
]
```
