# MD|442 on the M-VAVE SMK-37 Elite

MD|442 runs on the keyboard itself: no computer, plays through the keyboard's own audio out.
Built on the open X0X groovebox firmware (GPL-3.0). Mathew's seven MD|442 patterns are loaded as patterns 1–7:
Peak Warehouse, Berlin Roll, Electro, Acid Jack, Deep House, Breakbeat, Dub Techno.

## Before you install
- This replaces the keyboard's firmware. You can always go back (below), but you do it at your own risk.
- Use desktop Chrome or Edge, a USB data cable, and keep the keyboard powered the whole time.
- Optional but wise: make a full flash backup first (github.com/genkigenki/fm1-to-smk37, "Safety first").

## Install
1. Download `md442-smk37-elite.fwsc` (SMK-37 Pro owners: `md442-smk37-pro.fwsc`).
2. Open https://genkigenki.github.io/smk37/ in Chrome, connect the keyboard by USB, allow MIDI.
3. Choose "install your own package", pick the .fwsc file, and wait until it says done. The keyboard restarts into MD|442.
   (Command line alternative: `python3 tools/fm1_install.py md442-smk37-elite.fwsc` from the X0X source.)

## Play
- PLAY starts. Hold PATCH (HOME) and tap pads 1–7 to switch between Mathew's patterns.
- Pads are the 16-step grid. Faders 1–4: drums, 808, bass A, bass B levels. FADER BANK: reverb, delay, master filter.
- Full controls: the X0X manual and SMK37.md in the source.

## Go back to the stock firmware
Install M-VAVE's own package for your model with M-VAVE's updater (M-UPGRADE) or the workbench at open.m-vave.com.

## Source (GPL-3.0)
X0X by Charles Vestal (fork of Felucca by Leo Kuroshita / Hügelton Instruments), SMK-37 port by genkigenki.
MD|442 changes: `md442-smk37.patch` against github.com/genkigenki/fm1-x0x @ 8af3731 (branch smk37).
