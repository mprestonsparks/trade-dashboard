# Trade Dashboard Customization Guide

This guide explains how to customize the task management system for specific needs.

## DEVELOPMENT_STATUS.yaml

### Adding New Tasks
```yaml
next_available_tasks:
  - id: 8  # Use next available ID
    name: "New Task Name"
    priority: 2
    blocking: []  # List of task IDs this blocks
    status: "ready"
    assigned_to: null
    prerequisites_met: true
    github_issue: null  # Will be set by github_setup.ps1
    labels: ["feature", "frontend"]
```

### Modifying Task Status Definitions
```yaml
task_status_definitions:
  ready: "All prerequisites met, can be started"
  in_progress: "Currently being worked on"
  blocked: "Waiting on dependencies"
  completed: "Work finished and merged to main"
  review: "Awaiting code review"
  # Add custom statuses as needed
```

### Adding Development Rules
```yaml
development_rules:
  - "Your new rule here"
  # Add project-specific rules
```

## GitHub Integration

### Custom Labels
Edit `github_setup.ps1` to add new labels:
```powershell
$labels = @(
    @{name="custom-label"; color="HEX_COLOR"; description="Label description"}
    # Add more labels
)
```

### Issue Templates
1. Create `.github/ISSUE_TEMPLATE/`
2. Add custom templates following GitHub's format

## Script Customization

### Update Status Script
Modify `update_status.ps1` to add custom behavior:
```powershell
# Add custom status validation
if ($NewStatus -notin @('ready', 'in-progress', 'blocked', 'completed', 'review')) {
    Write-Error "Invalid status: $NewStatus"
    exit 1
}

# Add custom logging
# Add notifications
# Add integration with other tools
```

### Setup Script
Modify `setup.ps1` to:
- Add custom initialization steps
- Configure additional tools
- Set up project-specific requirements

## Best Practices

1. **Documentation**
   - Document all customizations
   - Update workflow.md with changes
   - Keep AI integration guide current

2. **Testing**
   - Test custom scripts thoroughly
   - Verify GitHub integration
   - Check AI assistant compatibility

3. **Maintenance**
   - Review customizations regularly
   - Update as project needs change
   - Keep scripts compatible with updates
