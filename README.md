# Design Thinking Sprint

Diese kleine Website fuehrt Seminar-Teams interaktiv durch einen kompakten Design-Thinking-Prozess. Sie ist themenoffen und eignet sich fuer Produkte, Services, Prozesse, Geschaeftsmodelle oder interne Organisationsfragen.

## Start

Oeffnen Sie `index.html` im Browser.

Optional kann der Ordner auch ueber einen lokalen Webserver gestartet werden:

```powershell
cd "Design-Thinking-Workshop-App"
python -m http.server 8765
```

Danach im Browser oeffnen:

```text
http://127.0.0.1:8765
```

## Ablauf

Die App fuehrt durch sechs Phasen:

1. Fokus
2. Verstehen
3. Challenge
4. Ideen
5. Prototyp
6. Test

Eingaben werden automatisch im Browser gespeichert. Am Ende kann das Team-Canvas als Textdatei heruntergeladen oder kopiert werden.

## Einsatz im Seminar

Jedes Team kann die App auf einem eigenen Laptop nutzen. Fuer Gruppenarbeiten eignet sich ein gemeinsamer Bildschirm pro Team. Die Moderation kann die Phasen und Zeiten zentral ansagen; die App enthaelt zusaetzlich pro Phase einen Timer.

## Veroeffentlichung ueber GitHub Pages

1. Neues GitHub-Repository erstellen, z.B. `design-thinking-sprint`.
2. Diese Dateien in das Repository hochladen:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
   - `.nojekyll`
3. In GitHub unter `Settings` -> `Pages` die Quelle `Deploy from a branch` waehlen.
4. Branch `main` und Ordner `/root` auswaehlen.
5. Nach kurzer Wartezeit ist die App unter einer Adresse wie dieser erreichbar:

```text
https://USERNAME.github.io/design-thinking-sprint/
```
