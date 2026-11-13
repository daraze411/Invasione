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
| `capitano-T.png`, `capitano-A.png` | Ritratti dei Capitani Mark Platt e Kar Am Oh. |
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
