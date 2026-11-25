; MD-442 plugin installer for Windows (Inno Setup). Built by .github/workflows/plugin.yml
#define Ver GetEnv("MD442_VERSION")
[Setup]
AppName=MD-442
AppVersion={#Ver}
AppPublisher=NEST Group
AppPublisherURL=https://music.nestgroup.space/md442/
DefaultDirName={autopf}\MD-442
DefaultGroupName=MD-442
OutputBaseFilename=md442-plugin-windows
OutputDir=..\..\out
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
DisableProgramGroupPage=yes
DisableDirPage=yes
PrivilegesRequired=admin
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
UninstallDisplayName=MD-442 drum machine (VST3 + standalone)

[Files]
Source: "..\..\build\MD442_artefacts\Release\VST3\MD-442.vst3\*"; DestDir: "{commoncf64}\VST3\MD-442.vst3"; Flags: recursesubdirs ignoreversion
Source: "..\..\build\MD442_artefacts\Release\Standalone\MD-442.exe"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{autoprograms}\MD-442"; Filename: "{app}\MD-442.exe"

[Messages]
FinishedLabel=MD-442 is installed as a VST3 plugin in C:\Program Files\Common Files\VST3.%n%nIn Ableton Live: Options > Preferences > Plug-Ins, turn on "Use VST3 Plug-in System Folders" and press Rescan. In Maschine: Preferences > Plug-ins > Manager > Rescan. MD-442 is under Instruments > NEST Group.
