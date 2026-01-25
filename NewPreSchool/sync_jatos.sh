#!/bin/bash

# Configuration
GIT_DIR="/Users/shubby/Desktop/UB/bell/TVChoice_JSPsych/NewPreSchool"
JATOS_DIR="/Users/shubby/Desktop/UB/bell/jatos/study_assets_root/fff96f9e-452b-4ffa-b87d-ff904edff8d3"

# Message colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check arguments
if [ "$1" == "deploy" ]; then
    echo -e "${BLUE}Deploying from Git to Jatos...${NC}"
    SOURCE_DIR="$GIT_DIR/"
    DEST_DIR="$JATOS_DIR/"
elif [ "$1" == "retrieve" ]; then
    echo -e "${BLUE}Retrieving from Jatos to Git...${NC}"
    SOURCE_DIR="$JATOS_DIR/"
    DEST_DIR="$GIT_DIR/"
else
    echo "Usage: $0 {deploy|retrieve}"
    echo "  deploy:   Syncs FROM Git TO Jatos"
    echo "  retrieve: Syncs FROM Jatos TO Git"
    exit 1
fi

# Run rsync
# -a: archive mode (preserves permissions, timestamps, etc.)
# -v: verbose
# --exclude='.git': Exclude git directory
# --exclude='sync_jatos.sh': Exclude this script
# --delete: Delete extraneous files from destination dirs (optional, be careful! - I'll leave it off for safety unless requested, but usually good for sync)
# Actually, for a true sync, --delete is often desired, but let's stick to update-only for safety first, or maybe just add it if the user wants exact mirror. 
# The user asked for "sync", implies mirror. Let's start without --delete to be safe, or just overwrite.
# rsync will overwrite changed files by default.

rsync -av --exclude='.git' --exclude='sync_jatos.sh' --exclude='.DS_Store' "$SOURCE_DIR" "$DEST_DIR"

echo -e "${GREEN}Sync complete!${NC}"
