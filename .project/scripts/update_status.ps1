# Task status update script
# Usage: ./update_status.ps1 <task_id> <new_status> [details]

param(
    [Parameter(Mandatory=$true)]
    [int]$TaskId,
    
    [Parameter(Mandatory=$true)]
    [string]$NewStatus,
    
    [Parameter(Mandatory=$false)]
    [string]$Details = "No additional details"
)

# Update DEVELOPMENT_STATUS.yaml
$pythonScript = @"
import yaml
from datetime import datetime
import sys

def update_status(task_id, new_status, details):
    with open('.project/status/DEVELOPMENT_STATUS.yaml', 'r') as f:
        status = yaml.safe_load(f)
    
    # Update task status
    for task in status['next_available_tasks']:
        if task['id'] == task_id:
            task['status'] = new_status
            break
    
    # Add to activity log
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'action': f'Updated task {task_id} to {new_status}',
        'task_id': task_id,
        'details': details
    }
    status['ai_activity_log'].append(log_entry)
    
    with open('.project/status/DEVELOPMENT_STATUS.yaml', 'w') as f:
        yaml.dump(status, f, default_flow_style=False)

update_status($TaskId, '$NewStatus', '$Details')
"@

# Execute Python script
$pythonScript | python

# Update GitHub issue
gh issue edit $TaskId --repo "mprestonsparks/trade-dashboard" --add-label $NewStatus

Write-Host "Task $TaskId updated to status: $NewStatus"
