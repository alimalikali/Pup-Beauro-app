# GitHub Actions Workflows

This directory contains comprehensive GitHub Actions workflows for the Pup-Beauro Next.js application.

## 📋 Available Workflows

### 1. **CI** (`ci.yml`)
**Triggers:** Push to `main`/`develop` branches, Pull Requests
**Purpose:** Continuous Integration - runs linting, type checking, tests, and builds

**Features:**
- Linting with ESLint
- TypeScript type checking
- Running tests
- Building the application
- Caching dependencies for faster builds

### 2. **Deploy** (`deploy.yml`)
**Triggers:** Push to `main` branch, Manual dispatch
**Purpose:** Automated deployment to production/staging environments

**Features:**
- Environment-based deployment
- Database migrations
- Vercel deployment (configured)
- Custom server deployment (commented example)
- Manual deployment triggers

### 3. **Database Operations** (`database.yml`)
**Triggers:** Manual dispatch only
**Purpose:** Database maintenance and operations

**Features:**
- Schema generation
- Database migrations
- Seeding data
- Database resets
- Environment-specific operations

### 4. **Security** (`security.yml`)
**Triggers:** Weekly schedule, Push/PR to main/develop, Manual dispatch
**Purpose:** Security scanning and vulnerability detection

**Features:**
- Dependency vulnerability scanning
- CodeQL security analysis
- OWASP ZAP testing (commented)
- Container security scanning (commented)
- Dependency review for PRs

### 5. **Release** (`release.yml`)
**Triggers:** Git tags (v*), Manual dispatch
**Purpose:** Automated release creation and versioning

**Features:**
- Tag-based releases
- Manual version input
- Build artifacts upload
- Release notes generation
- GitHub releases creation

## 🚀 Quick Start

### 1. **Enable GitHub Actions**
- Push this `.github` folder to your repository
- GitHub will automatically detect and enable the workflows

### 2. **Configure Secrets**
Go to your repository → Settings → Secrets and variables → Actions, and add:

#### Required Secrets:
```bash
# Database
DATABASE_URL=your_database_connection_string

# Vercel (if using Vercel deployment)
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

#### Optional Secrets (for custom deployment):
```bash
# Custom server deployment
HOST=your_server_ip
USERNAME=your_server_username
SSH_KEY=your_private_ssh_key
```

### 3. **Configure Environments** (Optional)
Create environments in GitHub for better secret management:
- Go to Settings → Environments
- Create `staging` and `production` environments
- Add environment-specific secrets

## 🔧 Customization

### **Modify Deployment Target**
The deploy workflow is currently configured for Vercel. To change:

1. **For Netlify:**
```yaml
- name: Deploy to Netlify
  uses: nwtgck/actions-netlify@v2.0
  with:
    publish-dir: '.next'
    production-branch: main
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deploy-message: "Deploy from GitHub Actions"
```

2. **For Custom Server:**
Uncomment and configure the SSH deployment section in `deploy.yml`

### **Database Configuration**
Update the database operations in `database.yml` to match your database setup:
- Change `DATABASE_URL` to your specific database connection
- Modify migration commands if using different ORM tools
- Add database-specific environment variables

### **Security Scanning**
Customize security workflows:
- Update CodeQL languages if using different programming languages
- Configure OWASP ZAP target URLs
- Adjust vulnerability thresholds

## 📅 Workflow Triggers

| Workflow | Push | PR | Schedule | Manual | Tags |
|----------|------|----|----------|---------|------|
| CI | ✅ | ✅ | ❌ | ❌ | ❌ |
| Deploy | ✅ (main) | ❌ | ❌ | ✅ | ❌ |
| Database | ❌ | ❌ | ❌ | ✅ | ❌ |
| Security | ✅ | ✅ | ✅ (weekly) | ✅ | ❌ |
| Release | ❌ | ❌ | ❌ | ✅ | ✅ |

## 🛠️ Manual Workflow Execution

### **Deploy to Specific Environment:**
1. Go to Actions → Deploy
2. Click "Run workflow"
3. Select environment (staging/production)
4. Click "Run workflow"

### **Database Operations:**
1. Go to Actions → Database Operations
2. Click "Run workflow"
3. Select operation (migrate/seed/reset/generate)
4. Select environment
5. Click "Run workflow"

### **Create Release:**
1. Go to Actions → Release
2. Click "Run workflow"
3. Enter version number (e.g., 1.0.0)
4. Click "Run workflow"

## 📊 Monitoring & Debugging

### **View Workflow Runs:**
- Go to Actions tab in your repository
- Click on specific workflow to see run history
- View detailed logs for each step

### **Common Issues:**
1. **Build Failures:** Check Node.js version compatibility
2. **Deployment Errors:** Verify secrets and environment variables
3. **Database Issues:** Ensure database connectivity and permissions
4. **Security Failures:** Review vulnerability reports and update dependencies

### **Performance Optimization:**
- Dependencies are cached between runs
- Use `pnpm` for faster package installation
- Consider using GitHub-hosted runners for larger projects

## 🔒 Security Best Practices

1. **Never commit secrets** - use GitHub Secrets
2. **Use environment-specific secrets** for different deployment targets
3. **Enable branch protection** for main branches
4. **Review security scan results** regularly
5. **Keep dependencies updated** to avoid vulnerabilities

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [GitHub Security Features](https://docs.github.com/en/github/getting-started-with-github/learning-about-github/about-github-advanced-security)

## 🤝 Contributing

When adding new workflows:
1. Follow the existing naming conventions
2. Include comprehensive documentation
3. Test workflows in a fork before submitting
4. Update this README with new workflow details

---

**Note:** These workflows are configured for a Next.js application using pnpm. Adjust package manager commands and build steps if using different tools.