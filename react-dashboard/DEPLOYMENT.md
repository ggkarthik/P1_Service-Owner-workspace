# RiskLens - Enterprise Risk Intelligence Platform

## Deployment Guide

This guide covers deploying the RiskLens platform as a production-ready website.

## Overview

RiskLens is an enterprise-grade risk intelligence platform that provides:
- **Asset Inventory Management** - Track applications, microservices, APIs, and infrastructure
- **Multi-Scanner Integration** - Aggregate security findings from multiple tools
- **Risk Intelligence** - Advanced analytics and prioritization
- **Root Cause Analysis** - Trace vulnerabilities to their source
- **Efficient Remediation** - Fix multiple interlinked findings

Built on the **CTEM (Continuous Threat Exposure Management)** framework.

## Architecture

```
├── Landing Page (/)          - Marketing and product information
├── Login Page (/login)       - Authentication
└── Dashboard (/dashboard)    - Main application (protected route)
```

## Prerequisites

- Node.js 16+ and npm
- Modern web browser
- (Optional) Web server for production deployment

## Local Development

### 1. Install Dependencies

```bash
cd react-dashboard
npm install
```

### 2. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:3000`

### 3. Demo Credentials

```
Email: demo@risklens.com
Password: demo123
```

## Production Build

### 1. Create Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### 2. Test Production Build Locally

```bash
# Install serve globally
npm install -g serve

# Serve the build directory
serve -s build -l 3000
```

## Deployment Options

### Option 1: Netlify (Recommended for Quick Deployment)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**
   ```bash
   cd react-dashboard
   npm run build
   netlify deploy --prod --dir=build
   ```

3. **Configure Redirects** (for React Router)
   
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```

### Option 2: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd react-dashboard
   vercel --prod
   ```

### Option 3: AWS S3 + CloudFront

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://risklens-app
   aws s3 website s3://risklens-app --index-document index.html --error-document index.html
   ```

3. **Upload Build Files**
   ```bash
   aws s3 sync build/ s3://risklens-app --acl public-read
   ```

4. **Configure CloudFront** for HTTPS and CDN

### Option 4: Docker + Nginx

1. **Create Dockerfile**
   ```dockerfile
   FROM node:16 AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**
   ```nginx
   server {
       listen 80;
       server_name _;
       root /usr/share/nginx/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://backend:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. **Build and Run**
   ```bash
   docker build -t risklens-app .
   docker run -p 80:80 risklens-app
   ```

### Option 5: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/risklens",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## Backend API Setup (Optional)

For production use, you'll want to replace the demo authentication with a real backend.

### Node.js/Express Backend Example

```javascript
// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validate credentials (replace with real auth)
  if (email && password) {
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token, email });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Protected route example
app.get('/api/dashboard/data', authenticateToken, (req, res) => {
  // Return dashboard data
  res.json({ /* your data */ });
});

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(5000, () => console.log('Server running on port 5000'));
```

## Environment Variables

Create `.env` file for configuration:

```env
REACT_APP_API_URL=https://api.risklens.com
REACT_APP_ENV=production
```

## Custom Domain Setup

### DNS Configuration

1. **Add A Record** (for root domain)
   ```
   Type: A
   Name: @
   Value: [Your server IP]
   ```

2. **Add CNAME Record** (for www subdomain)
   ```
   Type: CNAME
   Name: www
   Value: yourdomain.com
   ```

### SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d risklens.com -d www.risklens.com
```

## Performance Optimization

### 1. Enable Gzip Compression

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### 2. Cache Static Assets

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Enable HTTP/2

```nginx
listen 443 ssl http2;
```

## Monitoring and Analytics

### Add Google Analytics

Update `public/index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Security Best Practices

1. **Enable HTTPS** - Always use SSL/TLS in production
2. **Set Security Headers**
   ```nginx
   add_header X-Frame-Options "SAMEORIGIN";
   add_header X-Content-Type-Options "nosniff";
   add_header X-XSS-Protection "1; mode=block";
   add_header Strict-Transport-Security "max-age=31536000";
   ```
3. **Implement Rate Limiting**
4. **Use Environment Variables** for sensitive data
5. **Regular Security Updates** - Keep dependencies updated

## Scaling Considerations

- **CDN**: Use CloudFront, Cloudflare, or similar
- **Load Balancing**: Deploy multiple instances behind a load balancer
- **Database**: Use managed database services (RDS, MongoDB Atlas)
- **Caching**: Implement Redis for session management
- **Monitoring**: Use tools like DataDog, New Relic, or Prometheus

## Troubleshooting

### Issue: Blank page after deployment
- Check browser console for errors
- Verify `homepage` in package.json matches deployment URL
- Ensure server redirects all routes to index.html

### Issue: API calls failing
- Check CORS configuration
- Verify API URL in environment variables
- Check network tab in browser dev tools

### Issue: Authentication not persisting
- Check localStorage is enabled
- Verify token expiration
- Check for HTTPS/HTTP mixed content issues

## Support

For issues or questions:
- Email: support@risklens.com
- Documentation: https://docs.risklens.com
- GitHub: https://github.com/yourusername/risklens

## License

Enterprise License - Contact sales@risklens.com for licensing information
