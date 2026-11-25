#!/usr/bin/env bash
# One-time bootstrap build: copies the site from git and pulls the files that are not in git yet from the live site.
set -euo pipefail
rm -rf public && mkdir -p public
cp -r md442 mathew-dj public/
FETCH="index.html mathew-dj/image-slot.js mathew-dj/mix-autoplay.js mathew-dj/support.js md442/mix-autoplay.js md442/app/icon-192.png md442/app/icon-512.png md442/app/manifest.webmanifest md442/manifest.webmanifest md442/md442.css md442/md442-dark.css"
mkdir -p /tmp/b
for p in $FETCH; do mkdir -p "public/$(dirname $p)" "/tmp/b/$(dirname $p)"; curl -fsSL "https://music.nestgroup.space/$p" -o "/tmp/b/$p"; cp "/tmp/b/$p" "public/$p"; done
(cd /tmp/b && sha1sum $FETCH) > public/_bundle.sha1
head -c 600000 /dev/zero | tr '\0' 'x' > /tmp/b/zz-pad.txt
tar czf /tmp/bundle.tgz -C /tmp/b .
{ echo "BUNDLE-BEGIN"; base64 -w 0 /tmp/bundle.tgz; echo; echo "BUNDLE-END"; head -c 300000 /dev/zero | tr '\0' 'y'; } > public/_bundle.txt
ls -la public public/md442
