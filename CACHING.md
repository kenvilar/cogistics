# Caching Configuration Guide

This project includes caching configurations for various hosting environments to improve performance by caching static assets (images, CSS, JavaScript, fonts).

## Files Included

- `.htaccess` - For Apache servers
- `_headers` - For Netlify, Cloudflare Pages, and similar platforms
- `valet-nginx.conf` - For Laravel Valet (Nginx)

## Implementation Instructions

### For Laravel Valet (Local Development)

1. Copy the Nginx configuration to your Valet configuration directory:
   ```bash
   cp valet-nginx.conf ~/.config/valet/Nginx/cogistics.conf
   ```

2. Restart Valet:
   ```bash
   valet restart
   ```

### For Apache Servers

The `.htaccess` file is already in the root directory and will be automatically used by Apache servers.

Ensure your Apache server has these modules enabled:
```bash
sudo a2enmod expires
sudo a2enmod headers
sudo a2enmod deflate
sudo service apache2 restart
```

### For Netlify

The `_headers` file will be automatically detected by Netlify. No additional configuration needed.

### For Cloudflare Pages

The `_headers` file will be automatically detected. No additional configuration needed.

### For Nginx (Production)

Add the contents of `valet-nginx.conf` to your server block in your Nginx configuration:

```nginx
server {
    # ... your existing configuration ...

    # Include caching rules
    include /path/to/your/project/valet-nginx.conf;
}
```

Then reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Cache Duration

- **Images, CSS, JS, Fonts**: 1 year (immutable)
- **HTML files**: No cache (always fetch fresh)

## Verifying Cache Headers

Test if caching headers are working:

```bash
# Check CSS file
curl -I https://your-domain.com/assets/css/custom.css

# Check image file
curl -I https://your-domain.com/assets/images/logo.svg

# Check HTML file
curl -I https://your-domain.com/index.html
```

Look for these headers in the response:
- `Cache-Control: public, max-age=31536000, immutable` (for static assets)
- `Cache-Control: no-cache, no-store, must-revalidate` (for HTML)

## Additional Optimization

For versioned assets, consider adding cache-busting query strings:
```html
<link rel="stylesheet" href="/assets/css/custom.css?v=1.0.0">
<script src="/assets/js/main.js?v=1.0.0"></script>
```

Or use build tools to generate fingerprinted filenames:
```
custom.abc123.css
main.def456.js
```
