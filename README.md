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
| `src/engine.js` | Motore di gioco: regole, carte, Eventi, Virus, risoluzione dei Fronti. |
| `src/bot.js` | Automi: Normale (regole euristiche) e Difficile (simulazioni Monte Carlo). |
| `src/app.html` | Interfaccia: grafica, schermate, tutorial e regolamento. |
| `build.py` | Unisce i sorgenti e rigenera `index.html`. |
| `tools/` | Script di prova: partite casuali e simulazioni tra automi. |

## Modificare il gioco

1. Modifica i file in `src/`.
2. Rigenera la pagina: `python3 build.py`
3. Carica su GitHub sia i sorgenti sia il nuovo `index.html`.

Non modificare `index.html` a mano: viene sovrascritto da `build.py`.

## Prove (serve Node.js)

```
node tools/test_random.js          # 3000 partite con mosse casuali, cerca errori
node tools/sim.js norm norm 1000   # bilanciamento: Normale contro Normale
node tools/sim.js hard norm 30     # Difficile contro Normale (lento)
```

## Diritti

Il gioco e il codice non sono open source. Vedi [LICENSE](LICENSE).
