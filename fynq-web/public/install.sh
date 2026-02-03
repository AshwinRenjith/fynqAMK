#!/bin/sh
set -e

# Colors
RESET='\033[0m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'

echo "${BLUE}fynq installer${RESET}"

# 1. Detect OS & Arch
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

if [ "$ARCH" = "x86_64" ]; then
    ARCH="amd64"
elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    ARCH="arm64"
else
    echo "${RED}Unsupported architecture: $ARCH${RESET}"
    exit 1
fi

echo "Detected: $OS / $ARCH"

# 2. Determine Download URL
# Placeholder: Adjust this to your actual GitHub Release URL pattern
RELEASE_URL="https://github.com/AshwinRenjith/fynqADK/releases/latest/download/fynq-${OS}-${ARCH}"

# 3. Download
echo "Downloading fynq..."
curl -fsSL "$RELEASE_URL" -o fynq

# 4. Install
echo "Installing to /usr/local/bin..."
chmod +x fynq
sudo mv fynq /usr/local/bin/fynq

echo "${GREEN}Success!${RESET}"
echo "Run 'fynq --version' to get started."
