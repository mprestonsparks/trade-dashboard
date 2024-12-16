# Project setup script
# This script initializes the task management system

Write-Host "Setting up task management system..."

# Check prerequisites
if (!(Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "GitHub CLI not found. Please install it first."
    exit 1
}

if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git not found. Please install it first."
    exit 1
}

# Initialize directory structure if not exists
$projectDir = ".project"
$dirs = @(
    "$projectDir/status",
    "$projectDir/scripts",
    "$projectDir/docs"
)

foreach ($dir in $dirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "Created directory: $dir"
    }
}

# Setup GitHub CLI
Write-Host "Checking GitHub CLI authentication..."
gh auth status
if ($LASTEXITCODE -ne 0) {
    gh auth login
}

Write-Host "Setup complete! Next steps:"
Write-Host "1. Customize DEVELOPMENT_STATUS.yaml"
Write-Host "2. Run github_setup.ps1 to configure GitHub integration"
Write-Host "3. Start creating and managing tasks"
