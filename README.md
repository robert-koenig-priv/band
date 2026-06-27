# The Donkey Shorts — Frontend

Statische Homepage der Rock-/Pop-Coverband **The Donkey Shorts** aus Karlsruhe.

Reines HTML/CSS/JS, kein Build-Schritt nötig. Ein Backend mit Datenhaltung wird später ergänzt.

## Struktur

```
frontend/
├── index.html        Öffentliche Seite (Aktuell, Band, Songs, Audio, Videos)
├── intern.html       Interner Bereich (Proben-Audios, Songliste, Kalender)
├── css/style.css     Komplettes Theme (dunkel, modern)
├── js/
│   ├── main.js       Navigation, Scroll-Effekte, Song-Rendering
│   └── songs.js      Repertoire-Daten (Platzhalter)
├── audio/            MP3-Hörproben & Übungs-Audios (hier ablegen)
└── assets/
    ├── img/logo.png  Bandlogo
    └── fotos/        Bandfotos
```

## Lokal ansehen

```bash
cd frontend
python3 -m http.server 8000
# → http://localhost:8000
```

deployment on githup:
https://robert-koenig-priv.github.io/band/index.html


(Ein Server wird benötigt, damit die eingebetteten YouTube-/Google-Frames und
relative Pfade sauber laden.)

## Noch zu erledigen / Platzhalter

- **Termine** in `index.html` (`#aktuell`) durch echte Daten ersetzen.
- **Songliste** in `js/songs.js` pflegen.
- **MP3s** in `/audio` ablegen und Pfade in `index.html` / `intern.html` anpassen.
- **Bandtexte**: kurze Beschreibung je Mitglied ergänzen (`#band`).
- **Kalender** im internen Bereich einbinden: Teamup-Embed-URL in `intern.html`
  (Abschnitt `#kalender`) eintragen und Platzhalter entfernen.
- **Zugriffsschutz** für `intern.html` kommt mit dem Backend.

## Hinweise

- Schriften (Bebas Neue, Inter) werden von Google Fonts geladen.
- YouTube ist über `youtube-nocookie.com` eingebunden (datenschutzfreundlicher).
- Später dynamische Inhalte: `js/songs.js` zeigt das Muster — Daten lassen sich
  leicht durch einen `fetch()` aus dem Backend ersetzen.
```
