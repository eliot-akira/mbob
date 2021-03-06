(function() {

  var ws

  function socket() {

    ws = new WebSocket('ws://'+window.location.host)

    ws.onmessage = function (e) {

      var data = JSON.parse(e.data)

      if (data.r) location.reload()
      if (data.rcss) refreshCSS()
    }
  }

  function refreshCSS() {

    var sheets = document.getElementsByTagName("link");

    for (var i = 0; i < sheets.length; i++) {

      var elem = sheets[i];

      var rel = elem.rel;

      var refreshThis = elem.href
        && elem.href.substring(0, 5) !== "data:"
        && (typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet")

      if ( ! refreshThis ) continue

      var url = elem.href.replace(/(&|\\?)_cacheOverride=\\d+/, "")

      elem.href = url
        +( url.indexOf('?') >= 0 ? '&' : '?' )
        +'_cacheOverride='+( new Date().valueOf() )
    }
  }

  socket()

  setInterval(function () {
    if (ws) {
      if (ws.readyState !== 1) socket()
    } else {
      socket()
    }
  }, 3000)
})();
