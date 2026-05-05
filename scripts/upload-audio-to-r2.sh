#!/usr/bin/env bash
set -euo pipefail

# Uploads podcast audio files from src/_res/audio/ to Cloudflare R2.
# Safe to re-run — existing objects are overwritten.
#
# Required environment variables:
#   CLOUDFLARE_ACCOUNT_ID  - your Cloudflare account ID
#   CLOUDFLARE_API_TOKEN   - API token with R2:Edit permission
#   R2_BUCKET_NAME         - R2 bucket name (e.g. "hotcan-audio")
#
# Usage:
#   export CLOUDFLARE_ACCOUNT_ID=xxx
#   export CLOUDFLARE_API_TOKEN=yyy
#   export R2_BUCKET_NAME=hotcan-audio
#   bash scripts/upload-audio-to-r2.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
AUDIO_ROOT="${REPO_ROOT}/src/_res/audio"

if [ ! -d "${AUDIO_ROOT}" ]; then
  echo "ERROR: Audio directory not found at ${AUDIO_ROOT}"
  echo "Place your audio files at:"
  echo "  src/_res/audio/mp3/*.mp3"
  echo "  src/_res/audio/ogg/*.ogg"
  exit 1
fi

WRANGLER="${REPO_ROOT}/node_modules/.bin/wrangler"
[ -f "${WRANGLER}" ] || WRANGLER="npx wrangler"

upload_file() {
  echo "  Uploading: $2"
  ${WRANGLER} r2 object put "${R2_BUCKET_NAME}/$2" --file="$1" --content-type="$3"
}

echo "==> Uploading MP3 files..."
shopt -s nullglob
mp3_files=("${AUDIO_ROOT}"/mp3/*.mp3)
if [ ${#mp3_files[@]} -eq 0 ]; then
  echo "  No MP3 files found, skipping."
else
  for f in "${mp3_files[@]}"; do
    upload_file "$f" "_res/audio/mp3/$(basename "$f")" "audio/mpeg"
  done
fi

echo "==> Uploading OGG files..."
ogg_files=("${AUDIO_ROOT}"/ogg/*.ogg)
if [ ${#ogg_files[@]} -eq 0 ]; then
  echo "  No OGG files found, skipping."
else
  for f in "${ogg_files[@]}"; do
    upload_file "$f" "_res/audio/ogg/$(basename "$f")" "audio/ogg"
  done
fi

echo "==> Upload complete."
echo ""
echo "Files are stored in R2 under:"
echo "  ${R2_BUCKET_NAME}/_res/audio/mp3/<filename>.mp3"
echo "  ${R2_BUCKET_NAME}/_res/audio/ogg/<filename>.ogg"
