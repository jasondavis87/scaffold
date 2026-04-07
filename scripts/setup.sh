#!/bin/bash
set -e

echo "🚀 scaffold setup"
echo "=================="
echo ""

# 1. Project name
read -p "Project name (lowercase, no spaces, e.g. rekal): " PROJECT_NAME
if [ -z "$PROJECT_NAME" ]; then
  echo "Error: Project name is required"
  exit 1
fi

if [ "$PROJECT_NAME" = "scaffold" ]; then
  echo "Error: Choose a name other than 'scaffold'"
  exit 1
fi

# 2. Project description
read -p "Project description: " PROJECT_DESCRIPTION
if [ -z "$PROJECT_DESCRIPTION" ]; then
  PROJECT_DESCRIPTION="A ${PROJECT_NAME} application"
fi

# 2b. Project URL (optional)
read -p "Project URL/domain (optional, e.g. myapp.com): " PROJECT_URL

# 3. Include mobile app?
read -p "Include mobile app (Expo)? (y/n) [y]: " INCLUDE_MOBILE
INCLUDE_MOBILE=${INCLUDE_MOBILE:-y}

# 4. Include web dashboard?
read -p "Include web dashboard? (y/n) [y]: " INCLUDE_WEB
INCLUDE_WEB=${INCLUDE_WEB:-y}

# 5. Include auth (Clerk)?
read -p "Include auth (Clerk)? (y/n) [n]: " INCLUDE_AUTH
INCLUDE_AUTH=${INCLUDE_AUTH:-n}

echo ""
echo "Setting up ${PROJECT_NAME}..."
echo ""

# Derive values
SCHEME=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]')
BUNDLE_ID="com.${PROJECT_NAME}.app"

FIND_ARGS='-type f \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.mjs" -o -name "*.md" -o -name "*.css" -o -name "*.yml" \) -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/_generated/*" -not -path "*/.agents/*"'

# Replace default project name
eval "find . $FIND_ARGS -exec sed -i '' 's/\"scaffold\"/\"${PROJECT_NAME}\"/g' {} +"

# Replace "A scaffold application" description
eval "find . $FIND_ARGS -exec sed -i '' 's/A scaffold application/${PROJECT_DESCRIPTION}/g' {} +"

# Replace bundle ID
eval "find . $FIND_ARGS -exec sed -i '' 's/com\.scaffold\.app/${BUNDLE_ID}/g' {} +"

# Replace scheme (in app.json specifically)
sed -i '' "s/\"scheme\": \"scaffold\"/\"scheme\": \"${SCHEME}\"/" apps/mobile/app.json 2>/dev/null || true

# Replace in EAS build output paths
sed -i '' "s/dist\/scaffold/dist\/${PROJECT_NAME}/g" apps/mobile/package.json 2>/dev/null || true

# Update TASK-PROMPT.md placeholders
if [ -f "instructions/TASK-PROMPT.md" ]; then
  sed -i '' "s/{{PROJECT_NAME}}/${PROJECT_NAME}/g" instructions/TASK-PROMPT.md
  if [ -n "$PROJECT_URL" ]; then
    sed -i '' "s/{{PROJECT_URL}}/ (${PROJECT_URL})/g" instructions/TASK-PROMPT.md
  else
    sed -i '' "s/{{PROJECT_URL}}//g" instructions/TASK-PROMPT.md
  fi
  sed -i '' "s/{{PROJECT_DESCRIPTION}}/${PROJECT_DESCRIPTION}/g" instructions/TASK-PROMPT.md
  PROJECT_ROOT=$(pwd)
  sed -i '' "s|{{PROJECT_ROOT}}|${PROJECT_ROOT}|g" instructions/TASK-PROMPT.md
fi

# Remove mobile app if not included
if [ "$INCLUDE_MOBILE" != "y" ] && [ "$INCLUDE_MOBILE" != "Y" ]; then
  echo "Removing mobile app..."
  rm -rf apps/mobile
  sed -i '' '/"ios":/d' package.json
  sed -i '' '/"android":/d' package.json
  rm -f tooling/eslint/expo.js
  sed -i '' '/"\.\/expo"/d' tooling/eslint/package.json
fi

# Remove web dashboard if not included
if [ "$INCLUDE_WEB" != "y" ] && [ "$INCLUDE_WEB" != "Y" ]; then
  echo "Removing web dashboard..."
  rm -rf apps/web
fi

# Add Clerk auth if requested
if [ "$INCLUDE_AUTH" = "y" ] || [ "$INCLUDE_AUTH" = "Y" ]; then
  echo "Auth (Clerk) flag noted — add @clerk/nextjs and @clerk/clerk-expo manually."
  echo "See Clerk docs for provider setup."
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
bun install

# Sync Expo expected versions into root overrides
if [ -d "apps/mobile" ]; then
  echo ""
  echo "Syncing Expo SDK dependency versions..."
  cd apps/mobile

  EXPO_VERSIONS=$(bunx expo install --check 2>&1 || true)

  for pkg in react react-dom react-native; do
    EXPECTED=$(echo "$EXPO_VERSIONS" | grep "^  ${pkg}@" | sed -E 's/.*expected version: ([^ ]+)/\1/' | head -1)
    if [ -n "$EXPECTED" ] && [ "$EXPECTED" != "" ]; then
      CLEAN_VERSION=$(echo "$EXPECTED" | sed 's/^[~^]//')
      echo "  Pinning $pkg to $CLEAN_VERSION (Expo expected)"
      cd ../..
      sed -i '' "s/\"${pkg}\": \"[^\"]*\"/\"${pkg}\": \"${CLEAN_VERSION}\"/" package.json
      cd apps/mobile
    fi
  done

  cd ../..
  bun install

  cd apps/mobile
  bunx expo install --fix 2>/dev/null || true
  cd ../..
  bun install
fi

# Remove template origin to prevent accidental pushes
if git remote | grep -q origin; then
  git remote remove origin
  echo "Removed template 'origin' remote."
fi

# Optionally set new remote
read -p "Git remote URL (optional, press Enter to skip): " GIT_REMOTE
if [ -n "$GIT_REMOTE" ]; then
  git remote add origin "$GIT_REMOTE"
  echo "Set origin to $GIT_REMOTE"
fi

echo ""
echo "✅ Done! Next steps:"
echo ""
echo "  1. Set up Convex: cd packages/backend && bunx convex dev"
echo "  2. Copy .env.example → .env.local in each app"
echo "  3. Write your PRD and save to .taskmaster/docs/prd.txt"
echo "  4. Parse: tm parse-prd --input=.taskmaster/docs/prd.txt"
echo "  5. Build: tm next"
echo ""
