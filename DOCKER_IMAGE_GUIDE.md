# Docker Image Publishing Guide

## 🚀 Automatic Publishing to GHCR

Your Docker image is now automatically built and published to GitHub Container Registry (GHCR) via GitHub Actions!

### Image Location

```
ghcr.io/ggkarthik/p1_service-owner-workspace:latest
```

## 📦 What Happened

1. ✅ Created GitHub Actions workflow (`.github/workflows/docker-publish.yml`)
2. ✅ Configured automatic build on push to main branch
3. ✅ Pushed to GitHub - **workflow is now running**
4. ⏳ GitHub Actions is building your Docker image
5. ⏳ Once complete, image will be available at GHCR

## 🔍 Check Workflow Status

**View the build in progress:**

1. Go to your repository: https://github.com/ggkarthik/P1_Service-Owner-workspace
2. Click on the "Actions" tab
3. Look for "Build and Push Docker Image to GHCR" workflow
4. Click on the running workflow to see live logs

Or direct link: https://github.com/ggkarthik/P1_Service-Owner-workspace/actions

## 📥 Once Build Completes

### View Your Published Image

1. Go to: https://github.com/ggkarthik?tab=packages
2. You'll see "p1_service-owner-workspace" package
3. Click on it to view details and tags

### Make Image Public (Recommended)

1. Go to package page
2. Click "Package settings"
3. Scroll to "Danger Zone"
4. Click "Change visibility" → "Public"
5. Confirm

## 🐳 Using the Docker Image

### Pull and Run

```bash
# Pull the image
docker pull ghcr.io/ggkarthik/p1_service-owner-workspace:latest

# Run locally
docker run -d -p 80:80 ghcr.io/ggkarthik/p1_service-owner-workspace:latest

# Access at http://localhost
```

### Use in Docker Compose

```yaml
version: '3.8'
services:
  dashboard:
    image: ghcr.io/ggkarthik/p1_service-owner-workspace:latest
    ports:
      - "80:80"
    restart: unless-stopped
```

Save as `docker-compose.yml` and run:
```bash
docker-compose up -d
```

### Deploy to Kubernetes

The workflow automatically generates a Kubernetes deployment manifest. After the workflow completes:

1. Go to the workflow run
2. Download the "k8s-deployment" artifact
3. Extract and apply:

```bash
kubectl apply -f k8s-deployment.yaml
```

Or use this manifest:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: service-owner-workspace
spec:
  replicas: 2
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
        image: ghcr.io/ggkarthik/p1_service-owner-workspace:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
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

## 🏷️ Available Tags

The workflow creates multiple tags automatically:

| Tag | Description | When Created |
|-----|-------------|--------------|
| `latest` | Always points to the latest main build | Every push to main |
| `main` | Latest from main branch | Every push to main |
| `v1.0.0` | Specific version | When you create git tag `v1.0.0` |
| `main-abc123` | Specific commit SHA | Every push |

### Creating a Version Release

```bash
# Create and push a version tag
git tag v1.0.0
git push origin v1.0.0

# This will trigger the workflow and create:
# - ghcr.io/ggkarthik/p1_service-owner-workspace:v1.0.0
# - ghcr.io/ggkarthik/p1_service-owner-workspace:v1.0
# - ghcr.io/ggkarthik/p1_service-owner-workspace:v1
```

## 🔄 Rebuilding the Image

The image will automatically rebuild when you:
- Push code to the main branch
- Create a new version tag
- Manually trigger the workflow

### Manual Trigger

1. Go to: https://github.com/ggkarthik/P1_Service-Owner-workspace/actions
2. Click "Build and Push Docker Image to GHCR"
3. Click "Run workflow" button
4. Select branch (usually `main`)
5. Click "Run workflow"

## 🌐 Deployment Options with Docker Image

### Option 1: Cloud Run (Google Cloud)

```bash
gcloud run deploy service-owner-workspace \
  --image ghcr.io/ggkarthik/p1_service-owner-workspace:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Option 2: AWS ECS

1. Create ECS cluster
2. Create task definition using the GHCR image
3. Create service from task definition

### Option 3: Azure Container Instances

```bash
az container create \
  --resource-group myResourceGroup \
  --name service-owner-workspace \
  --image ghcr.io/ggkarthik/p1_service-owner-workspace:latest \
  --ports 80 \
  --ip-address public
```

### Option 4: Digital Ocean

1. Go to Container Registry
2. Import external image: `ghcr.io/ggkarthik/p1_service-owner-workspace:latest`
3. Deploy to App Platform or Kubernetes

### Option 5: Your Own Server

```bash
# SSH into your server
ssh user@your-server.com

# Pull and run
docker pull ghcr.io/ggkarthik/p1_service-owner-workspace:latest
docker run -d -p 80:80 --name dashboard ghcr.io/ggkarthik/p1_service-owner-workspace:latest
```

## 🔒 Authentication for Private Images

If your image is private, authenticate before pulling:

```bash
# Create a GitHub Personal Access Token with `read:packages` scope
# Then login:
echo $GITHUB_TOKEN | docker login ghcr.io -u ggkarthik --password-stdin

# Now you can pull
docker pull ghcr.io/ggkarthik/p1_service-owner-workspace:latest
```

## 📊 Image Information

Once built, your image will include:
- **Base**: nginx:alpine (lightweight)
- **Size**: ~50-70 MB (optimized)
- **Contents**: Production-optimized React build
- **Port**: 80
- **Health Check**: Configured for /
- **Architecture**: Multi-arch (amd64, arm64 if configured)

## ⚙️ Build Process

The workflow does the following:

1. **Checkout**: Gets your code from GitHub
2. **Setup Buildx**: Prepares Docker build system
3. **Login to GHCR**: Authenticates with GitHub token
4. **Extract Metadata**: Generates appropriate tags
5. **Build & Push**: Builds the Docker image and pushes to GHCR
6. **Generate Manifest**: Creates Kubernetes deployment file
7. **Cache**: Saves build cache for faster subsequent builds

## 📈 Monitoring

### View Build Logs

1. Go to Actions tab
2. Click on a workflow run
3. Click "build-and-push" job
4. Expand steps to see detailed logs

### Check Image Size

```bash
docker images ghcr.io/ggkarthik/p1_service-owner-workspace:latest
```

### Inspect Image

```bash
docker inspect ghcr.io/ggkarthik/p1_service-owner-workspace:latest
```

## 🎯 Next Steps

1. ⏳ **Wait for build** - Check Actions tab (~2-5 minutes)
2. 📦 **View package** - Visit GitHub Packages
3. 🌐 **Make public** - Change package visibility (optional)
4. 🚀 **Deploy** - Use one of the deployment options above
5. ✅ **Test** - Pull and run the image locally

## 🆘 Troubleshooting

### Build Fails

**Check workflow logs in Actions tab for specific error**

Common issues:
- Docker syntax error → Check Dockerfile
- Permission denied → Workflow has correct permissions (already set)
- Build timeout → Image too large, optimize Dockerfile

### Cannot Pull Image

- Verify the workflow completed successfully
- Check image name and tag are correct
- Ensure package is public or you're authenticated

### Image Not Working

- Check the build logs for warnings
- Test locally: `docker run -p 80:80 ghcr.io/ggkarthik/p1_service-owner-workspace:latest`
- View logs: `docker logs <container-id>`

## 📚 Documentation

- **Workflow Details**: `.github/workflows/README.md`
- **Dockerfile**: `react-dashboard/Dockerfile`
- **Docker Compose**: `react-dashboard/docker-compose.yml`

---

**Status**: ✅ Workflow configured and running!

**Check progress**: https://github.com/ggkarthik/P1_Service-Owner-workspace/actions

Your Docker image will be available at GHCR in a few minutes! 🎉
