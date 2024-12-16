# Trade Dashboard Setup Guide

This guide explains how to set up the task management system for the Trade Dashboard project.

## Prerequisites

1. **GitHub CLI**
   - Install from: https://cli.github.com/
   - Authenticate using: `gh auth login`

2. **Python Dependencies**
   ```bash
   pip install pyyaml
   ```

## Initial Setup

1. Run the setup script:
   ```powershell
   .\.project\scripts\setup.ps1
   ```
   This will:
   - Verify prerequisites
   - Initialize directory structure
   - Check GitHub CLI authentication

2. Configure GitHub integration:
   ```powershell
   .\.project\scripts\github_setup.ps1
   ```
   This will:
   - Create necessary labels
   - Create GitHub issues from DEVELOPMENT_STATUS.yaml
   - Set up project board integration

## Directory Structure

```plaintext
.project/
├── status/                 # Status tracking
│   ├── DEVELOPMENT_STATUS.yaml
│   └── ai_activity_log.yaml
├── scripts/               # Automation scripts
│   ├── setup.ps1
│   ├── github_setup.ps1
│   └── update_status.ps1
└── docs/                  # Documentation
    ├── ai_integration.md
    ├── workflow.md
    ├── setup.md
    └── customization.md
```

## Usage

### Updating Task Status
```powershell
.\.project\scripts\update_status.ps1 -TaskId 1 -NewStatus "in-progress" -Details "Starting work on architecture"
```

## Maintenance

1. **Regular Updates**
   - Keep DEVELOPMENT_STATUS.yaml in sync with GitHub issues
   - Review and update task dependencies regularly
   - Monitor AI activity log for issues

2. **Troubleshooting**
   - Check script permissions if execution fails
   - Verify GitHub CLI authentication
   - Ensure Python dependencies are installed

3. **Best Practices**
   - Always use provided scripts for updates
   - Keep documentation current
   - Review logs regularly
