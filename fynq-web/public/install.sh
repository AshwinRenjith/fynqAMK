#!/bin/bash
set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BOLD='\033[1m'
RESET='\033[0m'

# Print banner
printf "${BLUE}${BOLD}Fynq Installer v1.0${RESET}\n"
printf "The universal runtime for AI Agents\n\n"

# 1. Environment Check
if ! command -v python3 >/dev/null 2>&1; then
    printf "${RED}Error: python3 is not installed.${RESET} Fynq requires Python 3.9+.\n"
    exit 1
fi

if ! command -v pip3 >/dev/null 2>&1 && ! command -v pip >/dev/null 2>&1; then
    printf "${RED}Error: pip is not installed.${RESET}\n"
    exit 1
fi

# 2. Detect OS
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
printf "System: $OS ($ARCH)\n"

# 3. Installation
printf "Installing fynq via source (GitHub)...\n"

# Determine pip command
PIP_CMD="pip3"
if ! command -v pip3 >/dev/null 2>&1; then
    PIP_CMD="pip"
fi

# Execute installation
if $PIP_CMD install "git+https://github.com/AshwinRenjith/fynqADK.git" --quiet; then
    printf "\n${GREEN}${BOLD}✔ Success!${RESET}\n"
    printf "Fynq has been installed to your Python path.\n"
    printf "Run ${BLUE}fynq --help${RESET} to verify installation.\n\n"
    printf "Summon your first agent:\n"
    printf "  ${BLUE}fynq run @fynq/researcher --task \"What is Fynq?\"${RESET}\n"
else
    printf "\n${RED}Installation failed.${RESET} Please check your internet connection or GitHub access.\n"
    exit 1
fi

