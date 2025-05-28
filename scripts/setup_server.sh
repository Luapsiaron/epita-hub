#!/bin/bash

# Install Node.js, Apache2, clone the EPITA Hub project, configure Apache as reverse proxy, and start the server with PM2

set -e

echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

echo "🛠️ Installing required packages..."
sudo apt install -y apache2 git curl

echo "🔧 Installing Node.js from NodeSource..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

echo "🔧 Installing PM2..."
sudo npm install -g pm2

REPO_DIR="$HOME/epita-hub-auth"
if [ ! -d "$REPO_DIR" ]; then
    echo "📂 Cloning the project repository..."
    git clone https://github.com/luapsiaron/epita-hub.git "$REPO_DIR"
else
    echo "🔄 Pulling latest changes..."
    cd "$REPO_DIR" && git pull
fi

echo "📦 Installing Node.js dependencies..."
cd "$REPO_DIR"
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm install socket.io

echo "🚀 Starting the server using PM2..."
pm2 start server.js --name epita-hub
pm2 save

echo "🔧 Configuring Apache as a reverse proxy..."

# Enable necessary Apache modules
sudo a2enmod proxy
sudo a2enmod proxy_http

# Disable the default site
sudo a2dissite 000-default.conf

# Create Apache virtual host config for EPITA Hub
APACHE_CONF="/etc/apache2/sites-available/epita-hub.conf"
sudo bash -c "cat > $APACHE_CONF" <<EOF
<VirtualHost *:80>
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ErrorLog \${APACHE_LOG_DIR}/epita-hub-error.log
    CustomLog \${APACHE_LOG_DIR}/epita-hub-access.log combined
</VirtualHost>
EOF

# Enable the new site and reload Apache
sudo a2ensite epita-hub.conf
sudo systemctl reload apache2

echo "✅ Apache is now proxying requests to your Node.js app on port 3000."
echo "✅ EPITA Hub server setup completed successfully."

