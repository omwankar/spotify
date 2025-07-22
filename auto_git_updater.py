import shutil
import os

# Delete /tmp/spotify if it exists
clone_path = "/tmp/spotify"
if os.path.exists(clone_path):
    shutil.rmtree(clone_path)

import os
import subprocess
from datetime import datetime

# GitHub token from environment
TOKEN = os.getenv("GITHUB_TOKEN")

# === CONFIG ===
REPO_URL = "https://github.com/omwankar/spotify.git"
CLONE_DIR = "/tmp/spotify"  # temp directory on Render instance
FILE_NAME = "main.py"
COMMIT_MSG = f"🤖 Daily Render Commit - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
GITHUB_USERNAME = "omwankar"
GITHUB_REPO = "spotify"
BRANCH = "main"

# Clone repo
subprocess.run(["git", "clone", REPO_URL, CLONE_DIR])

# Change directory
os.chdir(CLONE_DIR)

# Modify file
with open(FILE_NAME, "a") as f:
    f.write(f"\n# Updated by Render on {datetime.now()}\n")

# Git config
subprocess.run(["git", "config", "user.name", GITHUB_USERNAME])
subprocess.run(["git", "config", "user.email", "omgajananwankar123@gmail.com"])

# Commit & Push
subprocess.run(["git", "add", FILE_NAME])
subprocess.run(["git", "commit", "-m", COMMIT_MSG])

# Push using token
remote_url = f"https://{GITHUB_USERNAME}:{TOKEN}@github.com/{GITHUB_USERNAME}/{GITHUB_REPO}.git"
subprocess.run(["git", "push", remote_url, BRANCH])
