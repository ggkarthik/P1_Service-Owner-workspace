# Deployment Guide - Service Owner Workspace

This guide covers various deployment options for the Service Owner Workspace dashboard.

## 📋 Pre-Deployment Checklist

- [ ] All data files are generated and present in `react-dashboard/public/data/`
- [ ] Dependencies are installed (`npm install` in react-dashboard)
- [ ] Environment variables are configured (if needed)
- [ ] Build succeeds without errors (`npm run build`)
- [ ] Docker image builds successfully (if using Docker)

## 🚀 Deployment Options

### Option 1: Local Development Server

**Quick Start for Testing**

```bash
cd react-dashboard
npm install
npm start
```

Access at: `http://localhost:3000`

### Option 2: Production Build (Static Files)

**Build the optimized production version**

```bash
cd react-dashboard
npm install
npm run build
```

The `build/` directory will contain all static files ready for deployment.

**Serve locally for testing:**
```bash
# Install serve globally
npm install -g serve

# Serve the build directory
serve -s build -l 3000
```

### Option 3: Docker Deployment

**Single Container**

```bash
cd react-dashboard

# Build the Docker image
docker build -t service-owner-workspace:latest .

# Run the container
docker run -d -p 80:80 --name service-owner-workspace service-owner-workspace:latest

# View logs
docker logs -f service-owner-workspace

# Stop and remove
docker stop service-owner-workspace
docker rm service-owner-workspace
```

Access at: `http://localhost`

**Using Docker Compose**

```bash
cd react-dashboard

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 4: Netlify Deployment

**Automated Git Deployment**

1. Push your repository to GitHub
2. Log in to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - **Base directory**: `react-dashboard`
   - **Build command**: `npm run build`
   - **Publish directory**: `react-dashboard/build`
6. Click "Deploy site"

**Manual Deployment**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
cd react-dashboard
npm run build

# Deploy
netlify deploy --prod --dir=build
```

### Option 5: Vercel Deployment

**Automated Git Deployment**

1. Push your repository to GitHub
2. Log in to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `react-dashboard`
6. Click "Deploy"

**CLI Deployment**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd react-dashboard
vercel --prod
```

### Option 6: GitHub Pages

**Setup**

1. Install gh-pages package:
```bash
cd react-dashboard
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/Service-Owner-workspace",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

### Option 7: AWS S3 + CloudFront

**Prerequisites**
- AWS CLI configured
- S3 bucket created
- CloudFront distribution set up

**Deployment Steps**

```bash
cd react-dashboard
npm run build

# Sync to S3
aws s3 sync build/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Option 8: Kubernetes Deployment

**Prerequisites**
- Kubernetes cluster access
- kubectl configured
- Docker image pushed to registry

**Create Kubernetes manifests:**

`k8s/deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: service-owner-workspace
  labels:
    app: service-owner-workspace
spec:
  replicas: 3
  selector:
    matchLabels:
      app: service-owner-workspace
  template:
    metadata:
      labels:
        app: service-owner-workspace
    spec:
      containers:
      - name: dashboard
        image: service-owner-workspace:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: service-owner-workspace
spec:
  type: LoadBalancer
  selector:
    app: service-owner-workspace
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
```

**Deploy to Kubernetes:**

```bash
# Build and push Docker image
docker build -t your-registry/service-owner-workspace:latest react-dashboard/
docker push your-registry/service-owner-workspace:latest

# Apply Kubernetes manifests
kubectl apply -f k8s/deployment.yaml

# Check status
kubectl get pods
kubectl get service service-owner-workspace

# Get external IP
kubectl get service service-owner-workspace -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

### Option 9: Traditional Web Server (Nginx/Apache)

**Nginx Configuration**

1. Build the project:
```bash
cd react-dashboard
npm run build
```

2. Copy build files to web server:
```bash
sudo cp -r build/* /var/www/html/
```

3. Configure Nginx (`/etc/nginx/sites-available/default`):
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

4. Restart Nginx:
```bash
sudo systemctl restart nginx
```

## 🔧 Environment Configuration

### Development Environment

Create `react-dashboard/.env.development`:
```env
REACT_APP_ENV=development
REACT_APP_API_URL=http://localhost:5000
```

### Production Environment

Create `react-dashboard/.env.production`:
```env
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.yourdomain.com
```

## 🔒 Security Best Practices

1. **HTTPS**: Always use HTTPS in production
2. **Environment Variables**: Never commit sensitive data
3. **Content Security Policy**: Configure CSP headers
4. **CORS**: Configure proper CORS policies
5. **Rate Limiting**: Implement API rate limiting
6. **Authentication**: Add authentication if needed

## 📊 Monitoring & Logging

### Docker Logging

```bash
# View logs
docker logs -f service-owner-workspace

# Export logs
docker logs service-owner-workspace > app.log
```

### Application Monitoring

Consider integrating:
- **Google Analytics**: User behavior tracking
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Datadog**: Infrastructure monitoring

## 🧪 Testing Deployment

### Health Checks

```bash
# Check if the app is running
curl http://localhost/

# Check specific data endpoints
curl http://localhost/data/microservices_inventory.json
```

### Load Testing

```bash
# Install Apache Bench
# Ubuntu/Debian
sudo apt-get install apache2-utils

# macOS
brew install httpd

# Run load test
ab -n 1000 -c 10 http://localhost/
```

## 🔄 Continuous Deployment

### GitHub Actions Example

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        working-directory: ./react-dashboard
        run: npm ci
      
      - name: Build
        working-directory: ./react-dashboard
        run: npm run build
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=react-dashboard/build
        env:
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
cd react-dashboard
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Docker Build Issues

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t service-owner-workspace .
```

### Port Already in Use

```bash
# Find process using port 80
sudo lsof -i :80

# Kill the process
sudo kill -9 <PID>
```

## 📈 Scaling

### Horizontal Scaling (Kubernetes)

```bash
# Scale deployment
kubectl scale deployment service-owner-workspace --replicas=5

# Auto-scaling
kubectl autoscale deployment service-owner-workspace \
  --cpu-percent=50 \
  --min=3 \
  --max=10
```

### CDN Configuration

Use a CDN to serve static assets:
- **Cloudflare**: Free tier available
- **AWS CloudFront**: Integrated with S3
- **Google Cloud CDN**: Global coverage
- **Azure CDN**: Microsoft ecosystem

## 🎯 Performance Optimization

1. **Code Splitting**: Already implemented in Create React App
2. **Lazy Loading**: Components load on demand
3. **Asset Optimization**: Images and files are optimized during build
4. **Caching**: Configure proper cache headers
5. **Compression**: Enable Gzip/Brotli compression

## 📞 Support

For deployment issues:
1. Check the logs
2. Review the documentation
3. Create an issue on GitHub
4. Contact the development team

---

**Last Updated**: January 2026
