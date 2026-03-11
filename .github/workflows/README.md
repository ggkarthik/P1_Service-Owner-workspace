# GitHub Actions Workflows

This directory contains automated workflows for the Service Owner Workspace project.

## Available Workflows

### 1. **docker-publish.yml** - Build and Push Docker Image to GHCR

Automatically builds and pushes the Docker image to GitHub Container Registry (GHCR).

**Triggers:**
- Push to `main` branch
- New version tags (e.g., `v1.0.0`)
- Pull requests
- Manual workflow dispatch

**What it does:**
1. Builds the Docker image from `react-dashboard/Dockerfile`
2. Tags the image appropriately based on trigger:
   - `latest` - for main branch
   - Version tags - for releases (e.g., `v1.0.0`)
   - Branch names - for other branches
   - SHA - for specific commits
3. Pushes to `ghcr.io/ggkarthik/p1_service-owner-workspace`
4. Generates an SPDX SBOM for the pushed image
5. Attaches that SBOM to GHCR as an SBOM attestation
6. Posts the pushed image digest to NoScan so the app can ingest the attested SBOM automatically
7. Generates Kubernetes deployment manifest
8. Uses GitHub Actions cache for faster builds

**Image Location:**
```
ghcr.io/ggkarthik/p1_service-owner-workspace:latest
ghcr.io/ggkarthik/p1_service-owner-workspace:main
ghcr.io/ggkarthik/p1_service-owner-workspace:v1.0.0
```

**Manual Trigger:**
1. Go to Actions tab in GitHub
2. Select "Build and Push Docker Image to GHCR"
3. Click "Run workflow"
4. Select branch
5. Click "Run workflow" button

## Using the Docker Image

### Pull from GHCR

```bash
# Pull latest version
docker pull ghcr.io/ggkarthik/p1_service-owner-workspace:latest

# Run container
docker run -d -p 80:80 ghcr.io/ggkarthik/p1_service-owner-workspace:latest
```

### Deploy to Kubernetes

```bash
# Download the deployment manifest from workflow artifacts
# Or use the generated manifest

kubectl apply -f k8s-deployment.yaml
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

## Image Tags

The workflow automatically creates these tags:

| Tag | Description | Example |
|-----|-------------|---------|
| `latest` | Latest build from main branch | `latest` |
| `main` | Main branch | `main` |
| `v*` | Version tags | `v1.0.0`, `v1.0` |
| `SHA` | Specific commit | `main-abc123` |

## Workflow Permissions

The workflow requires these permissions:
- **contents: read** - To checkout the repository
- **packages: write** - To push to GHCR
- **attestations: write** - To publish the SBOM attestation
- **id-token: write** - To sign the attestation via GitHub OIDC

These are automatically granted via `GITHUB_TOKEN`.

## Required Secrets for NoScan

Add these repository secrets if you want every pushed image digest to be sent to NoScan automatically:

- `NOSCAN_URL` - Base URL of your NoScan backend, for example `https://noscan.example.com`
- `NOSCAN_API_KEY` - API key used by NoScan for `X-API-Key`

If either secret is missing, the workflow still builds, pushes, and attests the image, but it skips the NoScan callback step.

## Viewing Published Images

1. Go to your GitHub repository
2. Click on "Packages" in the right sidebar
3. Or visit: https://github.com/ggkarthik?tab=packages

## Making Images Public

By default, images pushed to GHCR are private. To make them public:

1. Go to the package page: https://github.com/users/ggkarthik/packages/container/p1_service-owner-workspace
2. Click "Package settings"
3. Scroll to "Danger Zone"
4. Click "Change visibility"
5. Select "Public"
6. Confirm the change

## Troubleshooting

### Workflow Fails to Push

**Issue**: Permission denied when pushing to GHCR

**Solution**: Ensure workflow has `packages: write` permission (already configured)

### Image Not Found

**Issue**: Cannot pull image from GHCR

**Solution**: 
1. Check if the workflow completed successfully
2. Verify the image name and tag
3. Ensure the package is public or you're authenticated

### Authentication for Pulling Private Images

```bash
# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull the image
docker pull ghcr.io/ggkarthik/p1_service-owner-workspace:latest
```

## Build Locally (Alternative)

If you want to build locally instead of using CI:

```bash
cd react-dashboard

# Build
docker build -t ghcr.io/ggkarthik/p1_service-owner-workspace:latest .

# Login to GHCR (requires PAT with packages:write scope)
echo $GITHUB_TOKEN | docker login ghcr.io -u ggkarthik --password-stdin

# Push
docker push ghcr.io/ggkarthik/p1_service-owner-workspace:latest
```

## Next Steps

1. ✅ Workflow created and ready to use
2. 🔄 Push to main branch to trigger build
3. 📦 Check GitHub Packages for the image
4. 🌐 Make image public (optional)
5. 🚀 Deploy using the published image

---

**Note**: The workflow uses GitHub Actions cache to speed up subsequent builds. First build may take longer.
