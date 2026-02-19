#!/bin/bash

# ============================================
# Castello Deployment Script for DreamHost
# ============================================

# Configuration - UPDATE THESE VALUES
DREAMHOST_USER="rafacastello"
DREAMHOST_HOST="castello.international"
REMOTE_PATH="/home/$DREAMHOST_USER/castello.international"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "=========================================="
echo "   Castello Deployment to DreamHost"
echo "=========================================="
echo ""

# Check if configuration is set
if [ "$DREAMHOST_USER" = "your_dreamhost_username" ]; then
    echo -e "${RED}ERROR: Please edit deploy.sh and set your DreamHost username${NC}"
    echo ""
    echo "Open deploy.sh and update these lines:"
    echo "  DREAMHOST_USER=\"your_actual_username\""
    echo ""
    exit 1
fi

# Step 1: Build the static export
echo -e "${YELLOW}[1/4] Building static export...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed! Please fix errors and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}Build complete!${NC}"
echo ""

# Step 2: Check if 'out' directory exists
if [ ! -d "out" ]; then
    echo -e "${RED}ERROR: 'out' directory not found.${NC}"
    echo "Make sure next.config.ts has 'output: \"export\"' configured."
    exit 1
fi

# Step 3: Create .htaccess for HTTPS, caching, and optimization
echo -e "${YELLOW}[2/5] Creating .htaccess file...${NC}"

cat > ./out/.htaccess << 'HTACCESS'
# ============================================
# Castello - DreamHost Configuration
# ============================================

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Force www (optional - uncomment if needed)
# RewriteCond %{HTTP_HOST} !^www\. [NC]
# RewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove trailing slash for files
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} (.+)/$
RewriteRule ^ %1 [L,R=301]

# Handle Next.js static export routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]

# Custom 404 page
ErrorDocument 404 /404.html

# ============================================
# Performance Optimization
# ============================================

# Enable Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/json
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive On

    # Images - 1 year
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"

    # Fonts - 1 year
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType application/font-woff "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"

    # CSS/JS - 1 month
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"

    # HTML - 1 hour (for fresh content)
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Cache-Control headers
<IfModule mod_headers.c>
    # Static assets - immutable (Next.js hashed files)
    <FilesMatch "\.(js|css|woff|woff2|png|jpg|jpeg|gif|webp|svg|ico)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>

    # HTML files - revalidate
    <FilesMatch "\.html$">
        Header set Cache-Control "public, max-age=3600, must-revalidate"
    </FilesMatch>
</IfModule>

# ============================================
# Security Headers
# ============================================

<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Prevent directory listing
Options -Indexes

# Block access to sensitive files
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>
HTACCESS

echo -e "${GREEN}.htaccess created!${NC}"
echo ""

# Step 4: Sync files using rsync
echo -e "${YELLOW}[3/5] Uploading files to $DREAMHOST_HOST...${NC}"
rsync -avz --delete \
    --exclude '.git' \
    --exclude 'node_modules' \
    --exclude '.env' \
    --exclude '.env.local' \
    ./out/ \
    ${DREAMHOST_USER}@${DREAMHOST_HOST}:${REMOTE_PATH}/

if [ $? -ne 0 ]; then
    echo -e "${RED}Upload failed! Check your SSH credentials.${NC}"
    echo ""
    echo "Make sure you can SSH to DreamHost:"
    echo "  ssh ${DREAMHOST_USER}@${DREAMHOST_HOST}"
    echo ""
    echo "You may need to add your SSH key to DreamHost panel:"
    echo "  https://panel.dreamhost.com/index.cgi?tree=users.sshkeys"
    exit 1
fi

echo -e "${GREEN}Upload complete!${NC}"
echo ""

# Step 5: Set permissions
echo -e "${YELLOW}[4/5] Setting file permissions...${NC}"
ssh ${DREAMHOST_USER}@${DREAMHOST_HOST} "find ${REMOTE_PATH} -type d -exec chmod 755 {} \; && find ${REMOTE_PATH} -type f -exec chmod 644 {} \;"

echo -e "${GREEN}Permissions set!${NC}"
echo ""

# Step 6: Done
echo -e "${YELLOW}[5/5] Finalizing...${NC}"
echo ""
echo -e "${GREEN}=========================================="
echo "   Deployment Successful!"
echo "==========================================${NC}"
echo ""
echo "Your site is now live at:"
echo -e "  ${GREEN}https://castello.international${NC}"
echo ""
echo "Note: DNS propagation may take a few minutes."
echo ""
