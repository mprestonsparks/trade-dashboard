# GitHub integration setup script
# This script configures GitHub Issues and Project Board

Write-Host "Setting up GitHub integration..."

# Create labels
$labels = @(
    @{name="ready"; color="0E8A16"; description="Task is ready to be worked on"},
    @{name="in-progress"; color="FFA500"; description="Task is currently being worked on"},
    @{name="blocked"; color="D93F0B"; description="Task is blocked by dependencies"},
    @{name="review"; color="1D76DB"; description="Task is awaiting review"},
    @{name="completed"; color="0E8A16"; description="Task is completed"}
)

foreach ($label in $labels) {
    gh label create $label.name --color $label.color --description $label.description --repo "mprestonsparks/trade-dashboard"
}

# Create initial issues from DEVELOPMENT_STATUS.yaml if they don't exist
$pythonScript = @"
import sys, yaml

def create_github_issue(task):
    title = f'Task {task["id"]}: {task["name"]}'
    body = f'''
Priority: {task["priority"]}
Status: {task["status"]}
Blocking: {", ".join(map(str, task["blocking"]))}
Prerequisites met: {task["prerequisites_met"]}
'''
    print(f'{title}\n---\n{body}')

with open('.project/status/DEVELOPMENT_STATUS.yaml', 'r') as f:
    status = yaml.safe_load(f)
    for task in status['next_available_tasks']:
        if not task.get('github_issue'):
            create_github_issue(task)
"@

$pythonScript | python

Write-Host "GitHub integration setup complete!"
Write-Host "Next steps:"
Write-Host "1. Configure project board columns"
Write-Host "2. Link issues to project board"
Write-Host "3. Start managing tasks"
