#!/usr/bin/env bash
# Build script for Render
# Exit on error
set -o errexit

pip install -r requirements.txt

# Convert static asset files
python manage.py collectstatic --no-input

# Apply any outstanding database migrations - None for this project
# python manage.py migrate
