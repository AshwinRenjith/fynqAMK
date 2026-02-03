# -*- mode: python ; coding: utf-8 -*-
from PyInstaller.utils.hooks import copy_metadata, collect_all

datas = []
binaries = []
hiddenimports = []

# Collect everything from litellm (data files, submodules, binaries)
tmp_ret = collect_all('litellm')
datas += tmp_ret[0]
binaries += tmp_ret[1]
hiddenimports += tmp_ret[2]

# Collect everything from rich to ensure unicode data is present
tmp_rich = collect_all('rich')
datas += tmp_rich[0]
binaries += tmp_rich[1]
hiddenimports += tmp_rich[2]

# Standard metadata copies
datas += copy_metadata('supabase')
datas += copy_metadata('postgrest')
datas += copy_metadata('gotrue')
datas += copy_metadata('realtime')
datas += copy_metadata('storage3')
datas += copy_metadata('rich')

# Add the SDK source code to the bundle
datas.append(('src/fynq', 'fynq'))

block_cipher = None

a = Analysis(
    ['src/fynq_cli/main.py'],
    pathex=[],
    binaries=binaries,  # Add collected binaries
    datas=datas,
    hiddenimports=hiddenimports + [
        'fynq_cli.core.database', 
        'fynq_cli.core.auth', 
        'fynq_cli.core.publisher', 
        'fynq_cli.core.installer',
        'fynq_cli.core.runtime',
        'fynq_cli.core.manifest',
        'fynq_cli.ui.permissions',
        'tiktoken_ext', 
        'tiktoken_ext.openai_public',
        'duckduckgo_search',
        'bs4',
        'httpx',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)
pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='fynq',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
