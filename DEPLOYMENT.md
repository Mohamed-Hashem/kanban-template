# 🚀 Deployment Guide

This guide covers deploying the Kanban Dashboard to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] All tests pass
- [ ] Build completes without errors (`npm run build`)
- [ ] Environment variables configured
- [ ] API endpoints updated for production
- [ ] Error tracking configured (optional)
- [ ] Performance optimized

## 🌐 Vercel Deployment

### Method 1: CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Method 2: GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure:
    - **Framework Preset**: Vite
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
    - **Install Command**: `npm install`

6. Add Environment Variables:

    ```
    VITE_API_URL=https://your-api-url.com
    VITE_APP_TITLE=Kanban Dashboard
    ```

7. Click "Deploy"

### Vercel Configuration

Create `vercel.json`:

```json
{
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "devCommand": "npm run dev",
    "installCommand": "npm install",
    "framework": "vite",
    "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

## 🔷 Netlify Deployment

### Method 1: Drag & Drop

```bash
# Build the project
npm run build

# The 'dist' folder will be created
# Go to Netlify and drag the 'dist' folder
```

### Method 2: CLI Deployment

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### Method 3: GitHub Integration

1. Push code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure:
    - **Build command**: `npm run build`
    - **Publish directory**: `dist`
    - **Environment variables**:
        ```
        VITE_API_URL=https://your-api-url.com
        ```

6. Click "Deploy site"

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

## ☁️ AWS Amplify

1. Push code to GitHub
2. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
3. Click "New app" → "Host web app"
4. Select GitHub and authorize
5. Select your repository
6. Configure build settings:

    ```yaml
    version: 1
    frontend:
        phases:
            preBuild:
                commands:
                    - npm ci
            build:
                commands:
                    - npm run build
        artifacts:
            baseDirectory: dist
            files:
                - "**/*"
        cache:
            paths:
                - node_modules/**/*
    ```

7. Add environment variables
8. Click "Save and deploy"

## 🔵 Azure Static Web Apps

```bash
# Install Azure CLI
npm i -g @azure/static-web-apps-cli

# Login
az login

# Create static web app
az staticwebapp create \
  --name kanban-dashboard \
  --resource-group your-resource-group \
  --source https://github.com/your-username/your-repo \
  --location "eastus2" \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --build-command "npm run build"
```

## 🐳 Docker Deployment

### Dockerfile

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

Create `nginx.conf`:

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
        proxy_pass http://your-api-url;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Build and Run

```bash
# Build Docker image
docker build -t kanban-dashboard .

# Run container
docker run -p 8080:80 kanban-dashboard

# Or with docker-compose
docker-compose up -d
```

### docker-compose.yml

```yaml
version: "3.8"
services:
    frontend:
        build: .
        ports:
            - "8080:80"
        environment:
            - VITE_API_URL=http://api:4000

    api:
        image: json-server
        ports:
            - "4000:4000"
        volumes:
            - ./db.json:/data/db.json
```

## 📱 API Deployment Options

### Option 1: Separate API Server

Deploy your json-server or real backend to:

- **Railway**: Easy deployment with free tier
- **Render**: Free tier available
- **Heroku**: Traditional PaaS
- **DigitalOcean App Platform**: Simple and affordable

### Option 2: Serverless API

Convert to serverless functions:

- **Vercel Functions**
- **Netlify Functions**
- **AWS Lambda**
- **Cloudflare Workers**

### Option 3: Backend-as-a-Service

Use services like:

- **Supabase** (PostgreSQL + Auth)
- **Firebase** (Realtime Database)
- **AWS Amplify** (AppSync)
- **Hasura** (GraphQL)

## 🔒 Environment Variables

### Production Environment Variables

```env
# API Configuration
VITE_API_URL=https://api.yourdomain.com

# Application
VITE_APP_TITLE=Kanban Dashboard
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_DEVTOOLS=false
VITE_ENABLE_PERSISTENCE=true

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

## 🔍 Post-Deployment Checklist

- [ ] Test all features in production
- [ ] Verify API connectivity
- [ ] Check responsive design on mobile
- [ ] Test drag-and-drop functionality
- [ ] Verify search and filters work
- [ ] Check error boundaries trigger correctly
- [ ] Monitor performance with Lighthouse
- [ ] Set up SSL certificate (HTTPS)
- [ ] Configure CDN (if needed)
- [ ] Set up monitoring and logging
- [ ] Configure custom domain (optional)

## 📊 Performance Optimization

### Build Optimization

```javascript
// vite.config.js
export default {
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom", "react-router-dom"],
                    mui: ["@mui/material", "@mui/icons-material"],
                    state: ["zustand", "@tanstack/react-query"],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
};
```

### CDN Configuration

Add to your HTML:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://api.yourdomain.com" />
```

## 🚨 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### API Connection Issues

1. Check CORS configuration
2. Verify API URL in environment variables
3. Check network requests in DevTools
4. Ensure API is accessible from deployment platform

### Route 404 Errors

Configure your hosting platform for SPA routing (see platform-specific sections above)

## 📞 Support

If you encounter issues:

1. Check the deployment platform's documentation
2. Review build logs for errors
3. Test the build locally: `npm run preview`
4. Open an issue on GitHub

---

**Happy Deploying! 🎉**
