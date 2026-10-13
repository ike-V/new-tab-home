#!/usr/bin/env python3
"""Turn 8x8 PICO-8 sprites into a JavaScript icon block.

Usage: p8_to_icons.py CART.p8 MAP.json APP.js
MAP.json: {"icons": {name: sprite}, "icons16": {name: top-left sprite of a 2x2 block},
"palette": {index: colour}}. The optional palette
table swaps a colour for another PICO-8 colour, including the hidden ones (128-143),
which a cart can only reach through pal() at draw time. The block between
/* BEGIN GENERATED ICONS */ and /* END GENERATED ICONS */ in APP.js is replaced.
Output: ICON_PALETTE (PICO-8's 16 colours; index 0 is transparent), ICON_ART
(name -> 8 strings of 8 hex digits, one palette index per pixel) and ICON_ART16
(name -> 16 strings of 16 digits).
"""
import json
import re
import sys

PALETTE = ['#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8',
           '#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA']
SECRET = ['#291814', '#111D35', '#422136', '#125359', '#742F29', '#49333B', '#A28879', '#F3EF7D',
          '#BE1250', '#FF6C24', '#A8E72E', '#00B543', '#065AB5', '#754665', '#FF6E59', '#FF9D81']
BEGIN, END = '/* BEGIN GENERATED ICONS */', '/* END GENERATED ICONS */'


def read_gfx(path):
    lines = open(path).read().splitlines()
    rows = []
    for line in lines[lines.index('__gfx__') + 1:]:
        if line.startswith('__'):
            break
        rows.append(line)
    return rows


def sprite(rows, n):
    sx, sy = n % 16 * 8, n // 16 * 8
    return [rows[sy + y][sx:sx + 8] for y in range(8)]


def sprite16(rows, n):
    sx, sy = n % 16 * 8, n // 16 * 8
    return [rows[sy + y][sx:sx + 16] for y in range(16)]


def main():
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    cart, mapfile, appjs = sys.argv[1:]
    rows = read_gfx(cart)
    config = json.load(open(mapfile))
    names = config.get('icons', config)
    palette = list(PALETTE)
    for index, colour in config.get('palette', {}).items():
        c = int(colour)
        palette[int(index)] = SECRET[c - 128] if c >= 128 else PALETTE[c]
    art = {}
    for name, n in names.items():
        s = sprite(rows, n)
        if all(set(r) == {'0'} for r in s):
            sys.exit(f'sprite {n} ({name}) is empty')
        art[name] = s
    body = ['const ICON_PALETTE = ' + json.dumps(palette) + ';', 'const ICON_ART = {']
    for name, s in art.items():
        body.append(f"  {name}: {json.dumps(s)},")
    body.append('};')
    big = {}
    for name, n in config.get('icons16', {}).items():
        s = sprite16(rows, n)
        if all(set(r) == {'0'} for r in s):
            sys.exit(f'sprite block {n} ({name}) is empty')
        big[name] = s
    body.append('const ICON_ART16 = {')
    for name, s in big.items():
        body.append(f"  {name}: {json.dumps(s)},")
    body.append('};')
    block = BEGIN + '\n' + '\n'.join(body) + '\n' + END
    src = open(appjs).read()
    pattern = re.compile(re.escape(BEGIN) + r'.*?' + re.escape(END), re.S)
    if not pattern.search(src):
        sys.exit(f'markers not found in {appjs}')
    open(appjs, 'w').write(pattern.sub(lambda m: block, src))
    print(f'{len(art)} + {len(big)} icons written to {appjs}')


if __name__ == '__main__':
    main()
