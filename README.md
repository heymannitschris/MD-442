# MD|442 firmware for the M-VAVE SMK-37

MD|442 (by Mathew, NEST Group) running on the SMK-37 Elite / Pro keyboard. Built on X0X (GPL-3.0) and its SMK-37 port.
Download the latest `.fwsc` from Releases; see `firmware/INSTALL.md`. GitHub Actions builds it on every push, no Docker needed.

## MD|442 plugin (VST3 + AU)
`plugin/` is MD|442 as a plugin for Ableton, Maschine, Logic and other DAWs: the web engine ported to C++ (JUCE 8),
checked against the web engine (all 7 patterns within 0.7 dB). GitHub Actions builds the Mac .pkg (VST3 + AU, universal)
and the Windows installer (VST3) on every push to `plugin/`, and publishes them to the `plugin` release. See `plugin/INSTALL.md`.
Compare with the web sound: build `md442_render` (in `plugin/CMakeLists.txt`) and render a voice or a pattern to WAV.
