#!/usr/bin/env python3
"""Build the store ZIPs in store-assets/.

Usage: python3 store-assets/build_zip.py
new-tab-home.zip          Chrome Web Store and Edge Add-ons (manifest "key" removed)
new-tab-home-firefox.zip  Firefox Add-ons (no "key", adds the gecko settings)
Both package index.html, app.js and icons/*.png.
"""
import json
import pathlib
import zipfile

root = pathlib.Path(__file__).resolve().parent.parent
out_dir = root / 'store-assets'
GECKO = {
    'id': 'new-tab-home@ike-v.github.io',
    'strict_min_version': '140.0',
    'data_collection_permissions': {'required': ['none']},
}


def manifest_text(firefox):
    manifest = json.loads((root / 'manifest.json').read_text())
    manifest.pop('key', None)
    if firefox:
        manifest['browser_specific_settings'] = {'gecko': GECKO}
    text = json.dumps(manifest, indent=2, ensure_ascii=False)
    return text.replace('"permissions": [\n    "search"\n  ]', '"permissions": ["search"]') + '\n'


def build(name, firefox):
    out = out_dir / name
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('manifest.json', manifest_text(firefox))
        for f in ('index.html', 'app.js'):
            z.write(root / f, f)
        for icon in sorted((root / 'icons').glob('*.png')):
            z.write(icon, f'icons/{icon.name}')
    with zipfile.ZipFile(out) as z:
        print(f'{out.name}: {out.stat().st_size} bytes, version {json.loads(z.read("manifest.json"))["version"]}')
        for info in z.infolist():
            print(f'  {info.filename}  {info.file_size}')


build('new-tab-home.zip', False)
build('new-tab-home-firefox.zip', True)
