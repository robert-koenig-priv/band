/* The Donkey Shorts — Proben-Audios
   Generische Logik: liest alle MP3-Dateien aus dem Audio-Verzeichnis und
   bietet sie zum Abspielen an. Interpret und Titel werden getrennt angezeigt.

   Dateinamen-Format: "Interpret - Titel.mp3"  (Trennzeichen "-").

   Quellen für die Dateiliste (in dieser Reihenfolge):
   1. Directory-Listing des Servers (z. B. `python3 -m http.server`) — erkennt
      neue MP3s automatisch, ganz ohne Pflege.
   2. Fallback: `playlist.json` im Audio-Ordner (für Hoster ohne Listing,
      z. B. GitHub Pages). Neu generieren mit:
        python3 -c "import os,json;d='assets/intern/audio';\
        json.dump(sorted([f for f in os.listdir(d) if f.lower().endswith('.mp3')],\
        key=str.lower),open(d+'/playlist.json','w',encoding='utf-8'),\
        ensure_ascii=False,indent=2)"
*/
(function () {
  "use strict";

  var AUDIO_DIR = "assets/intern/audio/";

  var container = document.getElementById("probenAudios");
  if (!container) return;

  // --- Dateiname -> { artist, title } --------------------------------------
  function parseTrack(filename) {
    var name = filename.replace(/\.mp3$/i, "").trim();

    // Mögliche Trennzeichen: " - " bevorzugt, dann diverse Bindestrich-Varianten.
    var seps = [" - ", " – ", " — ", " · ", "-", "–", "—"];
    for (var i = 0; i < seps.length; i++) {
      var idx = name.indexOf(seps[i]);
      if (idx > 0) {
        return {
          artist: clean(name.slice(0, idx)),
          title: clean(name.slice(idx + seps[i].length))
        };
      }
    }
    // Kein Trennzeichen gefunden -> alles als Titel.
    return { artist: "", title: clean(name) };
  }

  function clean(s) {
    return s.trim().replace(/^["“”'‘’]+|["“”'‘’]+$/g, "").trim();
  }

  // --- Dateiliste beschaffen -----------------------------------------------
  function fromDirectoryListing() {
    return fetch(AUDIO_DIR, { headers: { Accept: "text/html" } })
      .then(function (res) {
        if (!res.ok) throw new Error("listing not available");
        return res.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var files = [];
        doc.querySelectorAll("a[href]").forEach(function (a) {
          var href = a.getAttribute("href").split("?")[0].split("#")[0];
          if (/\.mp3$/i.test(href)) {
            files.push(decodeURIComponent(href.split("/").pop()));
          }
        });
        if (!files.length) throw new Error("no mp3 in listing");
        return files;
      });
  }

  function fromManifest() {
    return fetch(AUDIO_DIR + "playlist.json")
      .then(function (res) {
        if (!res.ok) throw new Error("playlist.json not found");
        return res.json();
      });
  }

  function loadFiles() {
    return fromDirectoryListing().catch(fromManifest);
  }

  // --- Rendering ------------------------------------------------------------
  function render(files) {
    files.sort(function (a, b) {
      return a.localeCompare(b, "de", { sensitivity: "base" });
    });

    var frag = document.createDocumentFragment();

    files.forEach(function (file) {
      var t = parseTrack(file);

      var track = document.createElement("div");
      track.className = "track";

      var head = document.createElement("div");
      head.className = "track-head";

      var title = document.createElement("span");
      title.className = "track-title";
      title.textContent = t.title;
      head.appendChild(title);

      if (t.artist) {
        var artist = document.createElement("span");
        artist.className = "track-artist";
        artist.textContent = t.artist;
        head.appendChild(artist);
      }

      var audio = document.createElement("audio");
      audio.controls = true;
      audio.preload = "none";
      var source = document.createElement("source");
      source.src = AUDIO_DIR + encodeURIComponent(file);
      source.type = "audio/mpeg";
      audio.appendChild(source);
      audio.appendChild(document.createTextNode("Kein Audio-Support."));

      track.appendChild(head);
      track.appendChild(audio);
      frag.appendChild(track);
    });

    container.innerHTML = "";
    container.appendChild(frag);
  }

  function showMessage(text) {
    container.innerHTML = '<p class="audio-empty"></p>';
    container.querySelector(".audio-empty").textContent = text;
  }

  // --- Start ---------------------------------------------------------------
  loadFiles()
    .then(function (files) {
      if (!files || !files.length) {
        showMessage("Noch keine Proben-Audios vorhanden.");
        return;
      }
      render(files);
    })
    .catch(function () {
      showMessage("Audios konnten nicht geladen werden.");
    });
})();
