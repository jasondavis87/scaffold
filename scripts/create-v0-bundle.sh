#!/bin/bash
set -e

APP_NAME="$1"

if [ -z "$APP_NAME" ]; then
  echo "Usage: bash scripts/create-v0-bundle.sh <landing|web>"
  echo ""
  echo "Generates a zip bundle for V0 design handoff."
  echo "V0 only supports web apps — mobile is excluded."
  exit 1
fi

if [ "$APP_NAME" != "landing" ] && [ "$APP_NAME" != "web" ]; then
  echo "Error: App must be 'landing' or 'web'. Mobile is not supported by V0."
  exit 1
fi

APP_DIR="apps/${APP_NAME}"

if [ ! -d "$APP_DIR" ]; then
  echo "Error: ${APP_DIR} does not exist"
  exit 1
fi

TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BUNDLE_NAME="v0-${APP_NAME}-bundle-${TIMESTAMP}.zip"

echo "📦 Creating V0 bundle for ${APP_NAME}..."
echo ""

# Create temp directory for restructured files
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

# V0 expects files at the root, not in src/
# Restructure: src/app/ → app/, src/components/ → components/, etc.
if [ -d "${APP_DIR}/src/app" ]; then
  cp -r "${APP_DIR}/src/app" "${TEMP_DIR}/app"
fi

if [ -d "${APP_DIR}/src/components" ]; then
  cp -r "${APP_DIR}/src/components" "${TEMP_DIR}/components"
fi

if [ -d "${APP_DIR}/src/hooks" ]; then
  cp -r "${APP_DIR}/src/hooks" "${TEMP_DIR}/hooks"
fi

if [ -d "${APP_DIR}/src/lib" ]; then
  cp -r "${APP_DIR}/src/lib" "${TEMP_DIR}/lib"
fi

# Copy config files
for file in package.json tsconfig.json next.config.ts postcss.config.js components.json; do
  if [ -f "${APP_DIR}/${file}" ]; then
    cp "${APP_DIR}/${file}" "${TEMP_DIR}/"
  fi
done

# Include shared packages for context
mkdir -p "${TEMP_DIR}/packages"

if [ -d "packages/ui/src" ]; then
  mkdir -p "${TEMP_DIR}/packages/ui"
  cp -r packages/ui/src "${TEMP_DIR}/packages/ui/src"
  [ -f packages/ui/package.json ] && cp packages/ui/package.json "${TEMP_DIR}/packages/ui/"
fi

if [ -d "packages/shared/src" ]; then
  mkdir -p "${TEMP_DIR}/packages/shared"
  cp -r packages/shared/src "${TEMP_DIR}/packages/shared/src"
  [ -f packages/shared/package.json ] && cp packages/shared/package.json "${TEMP_DIR}/packages/shared/"
fi

# Include V0 template for context
if [ -f "instructions/V0-TEMPLATE.md" ]; then
  cp "instructions/V0-TEMPLATE.md" "${TEMP_DIR}/"
fi

# Create zip
cd "$TEMP_DIR"
zip -r "${OLDPWD}/${BUNDLE_NAME}" . \
  -x "node_modules/*" \
  -x ".next/*" \
  -x ".cache/*" \
  -x ".env*" \
  -x ".taskmaster/*" \
  -x ".claude/*" \
  -x "*.png" \
  -x "*.jpg" \
  -x "*.jpeg" \
  -x "*.gif" \
  -x "*.ico" \
  -x "*.svg"
cd "$OLDPWD"

echo ""
echo "✅ Created ${BUNDLE_NAME}"
echo ""
echo "Files included:"
unzip -l "${BUNDLE_NAME}" | tail -n +4 | head -n -2
echo ""
SIZE=$(du -h "${BUNDLE_NAME}" | cut -f1)
echo "Bundle size: ${SIZE}"
echo ""
echo "Next steps:"
echo "  1. Fill in the V0 prompt template: instructions/V0-TEMPLATE.md"
echo "  2. Upload ${BUNDLE_NAME} to V0"
echo "  3. Paste your filled-in prompt"
echo "  4. Copy changed files back (remap root paths → src/)"
echo "  5. Run 'bun check' to verify"
