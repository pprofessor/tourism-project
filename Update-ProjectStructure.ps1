# script name: Update-ProjectStructure.ps1

function Get-TreeStructure {
    param([string]$Path, [int]$Level = 0)
    
    $items = Get-ChildItem -Path $Path -Force
    $structure = @()
    
    foreach ($item in $items) {
        # Skip excluded folders
        $excludeFolders = @("node_modules", ".git", "build", "target", "dist", ".vscode", ".idea")
        if ($excludeFolders -contains $item.Name) { continue }
        
        # Create indentation and prefixes
        $indent = "    " * $Level
        
        if ($Level -eq 0) {
            $prefix = "|-- "
        } else {
            $prefix = "|   " + $indent + "|-- "
        }
        
        if ($item.PSIsContainer) {
            $structure += "$prefix$($item.Name)/"
            $structure += Get-TreeStructure -Path $item.FullName -Level ($Level + 1)
        } else {
            $structure += "$prefix$($item.Name)"
        }
    }
    
    return $structure
}

# Main execution
Write-Host "Generating project structure..."

$header = "# Project Structure"
$header += "`nPROJECT_ROOT/"

$treeStructure = Get-TreeStructure -Path "."
$footer = "*Last updated: $(Get-Date -Format 'yyyy-MM-dd HH:mm')*"

# Combine all parts
$markdownContent = $header + "`n" + ($treeStructure -join "`n") + "`n`n" + $footer

# Save to file
$markdownContent | Out-File -FilePath "PROJECT_STRUCTURE.md" -Encoding UTF8

Write-Host "SUCCESS: PROJECT_STRUCTURE.md updated successfully!"
Write-Host "Location: $(Get-Location)\PROJECT_STRUCTURE.md"
Write-Host "Files/Folders processed: $($treeStructure.Count)"