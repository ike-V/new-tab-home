#!/usr/bin/env python3
"""Generate glass-tile-sheet.svg (standard + hidden PICO-8 palettes) and glass-grid-8x8.svg.

Usage: python3 art/glass-tiles/make_glass_sheet.py
The tile look lives in TILE below (fractions of the tile size). Keep it in step with
GLASS_DEFS in app.js.
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
T = 128                      # tile size in px
TILE = {
    'radius': 0.18,          # corner radius
    'bevel_width': 0.10,     # stroke width of both bevels
    'light': 'M.08 .841V.225Q.08 .088 .217 .088H.866',   # bevel paths in tile units (0-1)
    'dark': 'M.929 .166V.785Q.929 .922 .793 .922H.141',
    'light_opacity': 0.60,
    'dark_opacity': 0.25,
    'shade': [(0, '#fff', .38), (.5, '#fff', .06), (.52, '#000', .02), (1, '#000', .30)],
}
STANDARD = ['#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8',
            '#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA']
HIDDEN = ['#291814', '#111D35', '#422136', '#125359', '#742F29', '#49333B', '#A28879', '#F3EF7D',
          '#BE1250', '#FF6C24', '#A8E72E', '#00B543', '#065AB5', '#754665', '#FF6E59', '#FF9D81']
COLS, PITCH_X, PITCH_Y, MARGIN = 8, 168, 206, 40


def f(v):
    return f'{v:.2f}'.rstrip('0').rstrip('.')


def place(d, x, y):
    """Scale a unit-square path (M, V, H, Q only) to a tile at x, y."""
    out = []
    for cmd, args in re.findall(r'([MVHQ])([^MVHQ]*)', d):
        n = [float(v) for v in re.findall(r'\d*\.?\d+', args)]
        if cmd == 'H':
            n = [x + n[0] * T]
        elif cmd == 'V':
            n = [y + n[0] * T]
        else:
            n = [(x if i % 2 == 0 else y) + v * T for i, v in enumerate(n)]
        out.append(cmd + ' '.join(f(v) for v in n))
    return ''.join(out)


def tile(uid, colour, x, y):
    r, bw = TILE['radius'] * T, TILE['bevel_width'] * T
    stops = ''.join(f'<stop offset="{o}" stop-color="{col}" stop-opacity="{op}"/>' for o, col, op in TILE['shade'])
    grad = (f'<linearGradient id="shade-{uid}" gradientUnits="userSpaceOnUse" x1="{x}" y1="{y}" x2="{x}" y2="{y + T}">'
            f'{stops}</linearGradient>')
    light, dark = place(TILE['light'], x, y), place(TILE['dark'], x, y)
    body = (f'<g id="tile-{uid}">'
            f'<rect id="base-{uid}" x="{x}" y="{y}" width="{T}" height="{T}" rx="{f(r)}" fill="{colour}"/>'
            f'<rect id="shade-{uid}" x="{x}" y="{y}" width="{T}" height="{T}" rx="{f(r)}" fill="url(#shade-{uid})"/>'
            f'<path id="light-{uid}" d="{light}" fill="none" stroke="#fff" stroke-opacity="{TILE["light_opacity"]}" '
            f'stroke-width="{f(bw)}" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<path id="dark-{uid}" d="{dark}" fill="none" stroke="#000" stroke-opacity="{TILE["dark_opacity"]}" '
            f'stroke-width="{f(bw)}" stroke-linecap="round" stroke-linejoin="round"/></g>')
    return grad, body


def section(title, colours, first_index, y0, defs, shapes):
    shapes.append(f'<text x="{MARGIN}" y="{y0 - 14}" font-family="Helvetica, Arial, sans-serif" font-size="20" '
                  f'fill="#1b1b1b">{title}</text>')
    for k, col in enumerate(colours):
        x = MARGIN + (k % COLS) * PITCH_X
        y = y0 + (k // COLS) * PITCH_Y
        idx = first_index + k
        g, b = tile(idx, col, x, y)
        defs.append(g)
        shapes.append(b)
        shapes.append(f'<text x="{x + T / 2}" y="{y + T + 22}" font-family="Helvetica, Arial, sans-serif" '
                      f'font-size="15" text-anchor="middle" fill="#1b1b1b">{idx}</text>')
        shapes.append(f'<text x="{x + T / 2}" y="{y + T + 40}" font-family="Helvetica, Arial, sans-serif" '
                      f'font-size="13" text-anchor="middle" fill="#555">{col}</text>')


def main():
    defs, shapes = [], []
    rows = (len(STANDARD) + COLS - 1) // COLS
    y_std = 70
    y_hid = y_std + rows * PITCH_Y + 60
    section('Standard palette (0 is transparent in PICO-8)', STANDARD, 0, y_std, defs, shapes)
    section('Hidden palette (128-143, reached with pal(n, 128+k, 1))', HIDDEN, 128, y_hid, defs, shapes)
    W = MARGIN * 2 + COLS * PITCH_X - (PITCH_X - T)
    H = y_hid + rows * PITCH_Y + 30
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
           f'<defs>{"".join(defs)}</defs><rect id="background" width="{W}" height="{H}" fill="#E9E4D8"/>'
           f'{"".join(shapes)}</svg>')
    open(os.path.join(HERE, 'glass-tile-sheet.svg'), 'w').write(svg)

    grid = ''.join(f'<path d="M{k * 128} 0V1024M0 {k * 128}H1024" stroke="#fff" '
                   f'stroke-opacity="{.28 if k in (0, 8) else .12}" stroke-width="2"/>' for k in range(9))
    tpl = (f'<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">'
           f'<rect id="backdrop" width="1024" height="1024" fill="#1f6b4f"/><g id="grid-8x8-128px">{grid}</g></svg>')
    open(os.path.join(HERE, 'glass-grid-8x8.svg'), 'w').write(tpl)
    print(f'sheet {W}x{H}: {len(STANDARD)} standard + {len(HIDDEN)} hidden tiles')


if __name__ == '__main__':
    main()
