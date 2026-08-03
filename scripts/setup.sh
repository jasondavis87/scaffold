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

replace_in_project() {
  local search="$1"
  local replacement="$2"
  eval "find . $FIND_ARGS -print0" | SEARCH="$search" REPLACEMENT="$replacement" xargs -0 perl -0pi -e 's/\Q$ENV{SEARCH}\E/$ENV{REPLACEMENT}/g'
}

replace_in_file() {
  local search="$1"
  local replacement="$2"
  local file="$3"
  SEARCH="$search" REPLACEMENT="$replacement" perl -0pi -e 's/\Q$ENV{SEARCH}\E/$ENV{REPLACEMENT}/g' "$file" 2>/dev/null || true
}

replace_regex_in_file() {
  local search="$1"
  local replacement="$2"
  local file="$3"
  SEARCH="$search" REPLACEMENT="$replacement" perl -0pi -e 's/$ENV{SEARCH}/$ENV{REPLACEMENT}/g' "$file" 2>/dev/null || true
}

# Replace default project name
replace_in_project '"scaffold"' "\"${PROJECT_NAME}\""

# Replace PostHog site identifiers
replace_in_project "scaffold.web" "${PROJECT_NAME}.web"
replace_in_project "scaffold.landing" "${PROJECT_NAME}.landing"
replace_in_project "scaffold.mobile" "${PROJECT_NAME}.mobile"
replace_in_project 'scaffold.${AppName}' "${PROJECT_NAME}.\${AppName}"

# Replace "A scaffold application" description
replace_in_project "A scaffold application" "$PROJECT_DESCRIPTION"

# Replace bundle ID
replace_in_project "com.scaffold.app" "$BUNDLE_ID"

# Replace scheme (in app.json specifically)
replace_in_file '"scheme": "scaffold"' "\"scheme\": \"${SCHEME}\"" apps/mobile/app.json

# Replace in EAS build output paths
replace_in_file "dist/scaffold" "dist/${PROJECT_NAME}" apps/mobile/package.json

# Update TASK-PROMPT.md placeholders
if [ -f "instructions/TASK-PROMPT.md" ]; then
  replace_in_file "{{PROJECT_NAME}}" "$PROJECT_NAME" instructions/TASK-PROMPT.md
  if [ -n "$PROJECT_URL" ]; then
    replace_in_file "{{PROJECT_URL}}" " (${PROJECT_URL})" instructions/TASK-PROMPT.md
  else
    replace_in_file "{{PROJECT_URL}}" "" instructions/TASK-PROMPT.md
  fi
  replace_in_file "{{PROJECT_DESCRIPTION}}" "$PROJECT_DESCRIPTION" instructions/TASK-PROMPT.md
  PROJECT_ROOT=$(pwd)
  replace_in_file "{{PROJECT_ROOT}}" "$PROJECT_ROOT" instructions/TASK-PROMPT.md
fi

# Remove mobile app if not included
if [ "$INCLUDE_MOBILE" != "y" ] && [ "$INCLUDE_MOBILE" != "Y" ]; then
  echo "Removing mobile app..."
  rm -rf apps/mobile
  replace_regex_in_file '^.*"ios":.*\n' "" package.json
  replace_regex_in_file '^.*"android":.*\n' "" package.json
  rm -f tooling/eslint/expo.js
  replace_regex_in_file '^.*"\./expo".*\n' "" tooling/eslint/package.json
fi

# Remove web dashboard if not included
if [ "$INCLUDE_WEB" != "y" ] && [ "$INCLUDE_WEB" != "Y" ]; then
  echo "Removing web dashboard..."
  rm -rf apps/web
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

  for pkg in react react-dom react-native typescript; do
    EXPECTED=$(echo "$EXPO_VERSIONS" | grep "^  ${pkg}@" | sed -E 's/.*expected version: ([^ ]+)/\1/' | head -1)
    if [ -n "$EXPECTED" ] && [ "$EXPECTED" != "" ]; then
      CLEAN_VERSION=$(echo "$EXPECTED" | sed 's/^[~^]//')
      echo "  Pinning $pkg to $CLEAN_VERSION (Expo expected)"
      cd ../..
      replace_regex_in_file "\"${pkg}\": \"[^\"]*\"" "\"${pkg}\": \"${CLEAN_VERSION}\"" package.json
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

# ──────────────────────────────────────────────
# Convex setup
# ──────────────────────────────────────────────
echo ""
read -p "Set up Convex now? (y/n) [y]: " SETUP_CONVEX
SETUP_CONVEX=${SETUP_CONVEX:-y}

CONVEX_URL=""
if [ "$SETUP_CONVEX" = "y" ] || [ "$SETUP_CONVEX" = "Y" ]; then
  echo ""
  echo "Setting up Convex (this may open a browser for login)..."
  cd packages/backend
  bunx convex dev --once
  CONVEX_URL=$(bunx convex url 2>/dev/null || true)
  cd ../..

  if [ -n "$CONVEX_URL" ]; then
    echo ""
    echo "Convex URL: $CONVEX_URL"

    # Write .env.local for each app that exists
    if [ -d "apps/web" ]; then
      echo "NEXT_PUBLIC_CONVEX_URL=$CONVEX_URL" > apps/web/.env.local
    fi
    if [ -d "apps/landing" ]; then
      echo "NEXT_PUBLIC_CONVEX_URL=$CONVEX_URL" > apps/landing/.env.local
    fi
    if [ -d "apps/mobile" ]; then
      echo "EXPO_PUBLIC_CONVEX_URL=$CONVEX_URL" > apps/mobile/.env.local
    fi

    echo "Wrote .env.local files with Convex URL for all apps."
  else
    echo "Warning: Could not determine Convex URL. You'll need to set it manually."
    echo "  Run: cd packages/backend && bunx convex url"
  fi
else
  echo "Skipping Convex setup. To set up later:"
  echo "  cd packages/backend && bunx convex dev"
  echo "  Then copy the CONVEX_URL into .env.local for each app (see .env.example files)"
fi

# ──────────────────────────────────────────────
# Clerk auth setup
# ──────────────────────────────────────────────
if [ "$INCLUDE_AUTH" = "y" ] || [ "$INCLUDE_AUTH" = "Y" ]; then
  echo ""
  echo "── Clerk Auth ──"
  echo ""
  echo "You'll need a Clerk application. If you don't have one yet:"
  echo "  1. Go to https://dashboard.clerk.com"
  echo "  2. Create an application"
  echo "  3. Go to API Keys to find your Publishable Key and Secret Key"
  echo "  4. Go to JWT Templates if you need the issuer domain for Convex"
  echo ""
  echo "Docs: https://clerk.com/docs/quickstarts/nextjs"
  echo "      https://clerk.com/docs/quickstarts/expo"
  echo "      https://docs.convex.dev/auth/clerk"
  echo ""

  read -p "Enter Clerk keys now? (y/n) [n]: " ENTER_CLERK_KEYS
  ENTER_CLERK_KEYS=${ENTER_CLERK_KEYS:-n}

  CLERK_PK=""
  CLERK_SK=""
  CLERK_ISSUER=""

  if [ "$ENTER_CLERK_KEYS" = "y" ] || [ "$ENTER_CLERK_KEYS" = "Y" ]; then
    read -p "Clerk Publishable Key (pk_test_... or pk_live_...): " CLERK_PK
    read -p "Clerk Secret Key (sk_test_... or sk_live_...): " CLERK_SK
    read -p "Clerk JWT Issuer Domain (e.g. https://your-app.clerk.accounts.dev, optional): " CLERK_ISSUER
  fi

  # Write Clerk vars into existing .env.local files (or create them)
  if [ -d "apps/web" ]; then
    if [ -n "$CLERK_PK" ]; then
      echo "" >> apps/web/.env.local
      echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$CLERK_PK" >> apps/web/.env.local
    else
      echo "" >> apps/web/.env.local
      echo "# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=" >> apps/web/.env.local
    fi
    if [ -n "$CLERK_SK" ]; then
      echo "CLERK_SECRET_KEY=$CLERK_SK" >> apps/web/.env.local
    else
      echo "# CLERK_SECRET_KEY=" >> apps/web/.env.local
    fi
  fi

  if [ -d "apps/landing" ]; then
    if [ -n "$CLERK_PK" ]; then
      echo "" >> apps/landing/.env.local
      echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$CLERK_PK" >> apps/landing/.env.local
    else
      echo "" >> apps/landing/.env.local
      echo "# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=" >> apps/landing/.env.local
    fi
  fi

  if [ -d "apps/mobile" ]; then
    if [ -n "$CLERK_PK" ]; then
      echo "" >> apps/mobile/.env.local
      echo "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=$CLERK_PK" >> apps/mobile/.env.local
    else
      echo "" >> apps/mobile/.env.local
      echo "# EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=" >> apps/mobile/.env.local
    fi
  fi

  if [ -n "$CLERK_SK" ] || [ -n "$CLERK_ISSUER" ]; then
    echo "" >> packages/backend/.env.local
    if [ -n "$CLERK_SK" ]; then
      echo "CLERK_SECRET_KEY=$CLERK_SK" >> packages/backend/.env.local
    else
      echo "# CLERK_SECRET_KEY=" >> packages/backend/.env.local
    fi
    if [ -n "$CLERK_ISSUER" ]; then
      echo "CLERK_JWT_ISSUER_DOMAIN=$CLERK_ISSUER" >> packages/backend/.env.local
    else
      echo "# CLERK_JWT_ISSUER_DOMAIN=" >> packages/backend/.env.local
    fi
  fi

  if [ -n "$CLERK_PK" ]; then
    echo "Wrote Clerk keys to .env.local files."
  else
    echo "Clerk placeholders added to .env.local files. Fill them in when ready."
  fi

  echo ""
  echo "Next: install Clerk packages and set up providers."
  echo "  Web:    bun add @clerk/nextjs --filter=web"
  echo "  Mobile: bun add @clerk/clerk-expo --filter=mobile"
  echo "  Convex: https://docs.convex.dev/auth/clerk"
fi

# ──────────────────────────────────────────────
# Git history and remote
# ──────────────────────────────────────────────

read -p "Git remote URL (optional, press Enter to skip): " GIT_REMOTE

echo ""
echo "Resetting template git history..."

if [ -d ".git" ]; then
  rm -rf .git
  echo "Removed scaffold template git history."
fi

git init -b main
git add .

if git diff --cached --quiet; then
  echo "No files to commit in the new repository."
else
  if git config user.name >/dev/null && git config user.email >/dev/null; then
    git commit -m "Initial commit"
  else
    git -c user.name="Scaffold Setup" -c user.email="scaffold@example.invalid" commit -m "Initial commit"
    echo "Used a temporary git identity for the initial commit. Update git author config when you're ready."
  fi
fi

echo "Created fresh git history on main."

if [ -n "$GIT_REMOTE" ]; then
  git remote add origin "$GIT_REMOTE"
  echo "Set origin to $GIT_REMOTE"
fi

echo ""
echo "✅ Done! Next steps:"
echo ""
if [ -z "$CONVEX_URL" ]; then
  echo "  1. Set up Convex: cd packages/backend && bunx convex dev"
  echo "  2. Copy the Convex URL into .env.local for each app"
  STEP=3
else
  STEP=1
fi
echo "  ${STEP}. Write your PRD and save to .taskmaster/docs/prd.txt"
STEP=$((STEP + 1))
echo "  ${STEP}. Parse: tm parse-prd --input=.taskmaster/docs/prd.txt"
STEP=$((STEP + 1))
echo "  ${STEP}. Build: tm next"
echo ""
