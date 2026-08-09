#!/bin/bash
# One-time EC2 setup script for Ubuntu 22.04+
# Run as: sudo bash setup-ec2.sh

set -e

REPO_URL="https://github.com/Janak-app/JanakBE.git"
APP_DIR="/opt/janak-be"
DOMAIN="stagapi.janakgnss.com"

echo "=== Installing dependencies ==="
apt-get update -y
apt-get install -y git curl nginx certbot python3-certbot-nginx

echo "=== Installing Docker ==="
curl -fsSL https://get.docker.com | sh
usermod -aG docker ubuntu
systemctl enable docker
systemctl start docker

echo "=== Cloning repository ==="
mkdir -p $APP_DIR
git clone $REPO_URL $APP_DIR
cd $APP_DIR

echo "=== Creating .env file ==="
echo "Copy your .env file to $APP_DIR/.env before starting the app."
echo "Required variables: DB_USERNAME, DB_PASSWORD, DB_NAME, JWT_SECRET, APP_URL, etc."

echo "=== Setting up nginx ==="
cp $APP_DIR/nginx/$DOMAIN.conf /etc/nginx/sites-available/$DOMAIN
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "=== Obtaining SSL certificate ==="
certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@janakgnss.com
systemctl reload nginx

echo "=== Starting application ==="
echo "Place your .env file at $APP_DIR/.env then run:"
echo "  cd $APP_DIR && docker compose -f docker-compose.prod.yml up -d --build"

echo "=== Setup complete ==="
