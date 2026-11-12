"""Ricostruisce index.html a partire dai sorgenti (engine.js, bot.js, app.html).
Uso: python3 build.py
"""
from pathlib import Path

ROOT = Path(__file__).parent
GOATCOUNTER = '<script data-goatcounter="https://invasione.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>'

def main():
    engine = (ROOT / 'engine.js').read_text(encoding='utf-8').replace("if(typeof module!=='undefined')module.exports=INV;", "")
    bot = (ROOT / 'bot.js').read_text(encoding='utf-8')
    bot = bot.replace("if(typeof module!=='undefined')module.exports=BOT;", "").replace("(typeof INV!=='undefined'?INV:require('./engine.js'))", "(INV)")
    app = (ROOT / 'app.html').read_text(encoding='utf-8').replace('/*ENGINE*/', engine).replace('/*BOT*/', bot)
    k = app.index('<div id="app">')
    head = app[:k].replace('<meta name="claude:viewport-fit-sides" content="cover">', '')
    body = app[k:].rstrip()
    page = ('<!doctype html>\n<html lang="it">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            '<meta name="color-scheme" content="dark">\n<meta name="theme-color" content="#0b1017">\n'
            '<meta name="author" content="Daniele Radavero">\n'
            '<meta name="description" content="Terrestri contro Alieni: il gioco di dadi e carte di Daniele Radavero. Gioca contro il computer.">\n'
            '<link rel="manifest" href="manifest.webmanifest">\n'
            '<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">\n'
            '<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">\n'
            '<link rel="apple-touch-icon" href="apple-touch-icon.png">\n'
            '<meta name="mobile-web-app-capable" content="yes">\n'
            '<meta name="apple-mobile-web-app-capable" content="yes">\n'
            '<meta name="apple-mobile-web-app-title" content="Invasione">\n'
            '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'
            '<meta property="og:type" content="website">\n'
            '<meta property="og:title" content="INVASIONE">\n'
            '<meta property="og:description" content="Terrestri contro Alieni: il gioco di dadi e carte di Daniele Radavero.">\n'
            '<meta property="og:url" content="https://invasione.netlify.app/">\n'
            '<meta property="og:image" content="https://invasione.netlify.app/anteprima.jpg">\n'
            '<meta property="og:image:width" content="800">\n'
            '<meta property="og:image:height" content="800">\n'
            '<meta name="twitter:card" content="summary_large_image">\n'
            '<style>:root{color-scheme:dark;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}html{-webkit-text-size-adjust:100%}</style>\n'
            + head + GOATCOUNTER + '\n</head>\n<body>\n' + body + '\n</body>\n</html>\n')
    (ROOT / 'index.html').write_text(page, encoding='utf-8')
    print('index.html aggiornato,', len(page), 'caratteri')

if __name__ == '__main__':
    main()
