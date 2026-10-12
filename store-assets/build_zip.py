#!/usr/bin/env python3
"""Build store-assets/new-tab-home.zip for the Chrome Web Store.

Usage: python3 store-assets/build_zip.py
Packages manifest.json (without "key"), index.html, app.js and icons/*.png.
"""
import json
import pathlib
import zipfile

root = pathlib.Path(__file__).resolve().parent.parent
out = root / 'store-assets' / 'new-tab-home.zip'

manifest = json.loads((root / 'manifest.json').read_text())
manifest.pop('key', None)
text = json.dumps(manifest, indent=2, ensure_ascii=False)
text = text.replace('"permissions": [\n    "search"\n  ]', '"permissions": ["search"]')

with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('manifest.json', text + '\n')
    for name in ('index.html', 'app.js'):
        z.write(root / name, name)
    for icon in sorted((root / 'icons').glob('*.png')):
        z.write(icon, f'icons/{icon.name}')

with zipfile.ZipFile(out) as z:
    print(f'{out.name}: {out.stat().st_size} bytes, version {json.loads(z.read("manifest.json"))["version"]}')
    for info in z.infolist():
        print(f'  {info.filename}  {info.file_size}')
