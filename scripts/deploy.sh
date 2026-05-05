#!/usr/bin/env bash
set -euo pipefail

# Deploys hotcan to Cloudflare Pages.
#
# Required environment variables:
#   CLOUDFLARE_ACCOUNT_ID  - your Cloudflare account ID
#   CLOUDFLARE_API_TOKEN   - API token with Pages:Edit permission
#   CF_PAGES_PROJECT       - Cloudflare Pages project name (e.g. "hotcan")
#
# Usage:
#   export CLOUDFLARE_ACCOUNT_ID=xxx
#   export CLOUDFLARE_API_TOKEN=yyy
#   export CF_PAGES_PROJECT=hotcan
#   bash scripts/deploy.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

echo "==> Installing npm dependencies..."
npm install

echo "==> Running production build..."
npx gulp build:prod

WRANGLER="${REPO_ROOT}/node_modules/.bin/wrangler"
[ -f "${WRANGLER}" ] || WRANGLER="npx wrangler"

echo "==> Deploying dist/ to Cloudflare Pages..."
${WRANGLER} pages deploy dist/ \
  --project-name="${CF_PAGES_PROJECT}" \
  --commit-dirty=true

echo "==> Deployment complete."
