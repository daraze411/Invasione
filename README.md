# INVASIONE

Gioco di Daniele Radavero. © 2026 Tutti i diritti riservati.

*Difendi la Terra dall'attacco degli Alieni. Oppure prova a conquistarla, senza pietà.*

Versione web del gioco da tavolo per 2 giocatori: Terrestri contro Alieni su 3 Fronti per 3 round.
Si gioca contro un automa di livello Normale o Difficile, anche da smartphone.

**Gioca:** https://invasione.netlify.app

## Struttura

| File | Contenuto |
| --- | --- |
| `index.html` | Il gioco completo, in un solo file. È quello che viene pubblicato. |
| `engine.js` | Motore di gioco: regole, carte, Eventi, Virus, risoluzione dei Fronti. |
| `bot.js` | Automi: Normale (regole euristiche) e Difficile (simulazioni Monte Carlo). |
| `app.html` | Interfaccia: grafica, schermate, tutorial e regolamento. |
| `build.py` | Unisce i sorgenti e rigenera `index.html`. |
| `locandina.jpg`, `locandina-pixel.png` | Locandina originale e versione in pixel art. |
| `art-*.png` | Illustrazioni delle carte in pixel art (`art-<fazione>-<numero carta>.png`, il numero è quello in engine.js). |
| `capitano-T.png`, `capitano-A.png`, `capitano-T2.png`, `capitano-A2.png` | Ritratti dei Capitani: Mark Platt, Kar Am Oh, Dani Rada e Silvya Singer, Nuy Tinck. |
| `musica-menu.mp3`, `musica-partita.mp3`, `vittoria-terrestri.mp3`, `vittoria-alieni.mp3` | Musiche royalty free (Pixabay): autori nei Crediti del gioco. |
| `nuy.html` | Nuy Tinck Runs!!: il platform che si sblocca con 10 vittorie (si apre dal gioco). |
| `ritr-nuy.png`, `ritr-dani.png`, `ritr-silvya.png` | Ritratti dei dialoghi del platform. |
| `musica-nuy.mp3` | Musica del platform, di Daniele Radavero. |
| `tema-platt.mp3` | Tema di Mark Platt, musica originale di Daniele Radavero (parte col messaggio dal ponte). |
| `anteprima.jpg` | Immagine mostrata quando si condivide il link. |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `favicon-32.png` | Icone dell'app. |
| `manifest.webmanifest` | Fa aprire il gioco come app quando lo si salva nella schermata Home. |
| `test_random.js`, `sim.js` | Script di prova: partite casuali e simulazioni tra automi. |

## Modificare il gioco

1. Modifica `engine.js`, `bot.js` o `app.html`.
2. Rigenera la pagina: `python3 build.py`
3. Carica su GitHub i file modificati e il nuovo `index.html`.

Non modificare `index.html` a mano: viene sovrascritto da `build.py`.

## Prove (serve Node.js)

```
node test_random.js                # 3000 partite con mosse casuali, cerca errori
node sim.js norm norm 1000   # bilanciamento: Normale contro Normale
node sim.js hard norm 30     # Difficile contro Normale (lento)
```

## Diritti

Il gioco e il codice non sono open source. Vedi [LICENSE](LICENSE).


## App Android (facoltativa)
Se nella stessa cartella di `index.html` c'è un file `invasione.apk`, nella home compare da solo il pulsante «Scarica l'app». Se il file non c'è, il pulsante resta nascosto. Il pulsante non compare su iPhone né quando il gioco è già installato come app.

## Account online con email (facoltativo)
Il gioco ha già tutto il necessario. Resta da creare il servizio, gratuito:
1. Su supabase.com crea un progetto (regione UE, per la privacy).
2. SQL Editor: incolla il contenuto di `supabase-setup.sql` ed esegui.
3. Authentication > URL Configuration: Site URL = `https://invasione.netlify.app`, e lo stesso indirizzo in Redirect URLs.
4. Authentication > Email Templates > Magic Link: aggiungi nel messaggio la riga `Codice: {{ .Token }}` (serve a chi apre la mail su un altro dispositivo).
5. Authentication > SMTP: il servizio di prova di Supabase manda poche mail all'ora. Per i playtester collega un SMTP gratuito (per esempio Brevo o Resend).
6. Project Settings > API: copia "Project URL" e la chiave "anon public" dentro `config.js`, poi carica tutto su GitHub.
Se `config.js` resta vuoto, la sezione email non compare e il gioco funziona come prima, solo con il codice.

## Barra del browser nell'app Android
La cartella `.well-known` contiene `assetlinks.json`, il file che collega il sito all'app. Va nella stessa cartella di `index.html`, con questo percorso: `.well-known/assetlinks.json`. Verifica: aprendo `https://invasione.netlify.app/.well-known/assetlinks.json` deve comparire il contenuto del file.
