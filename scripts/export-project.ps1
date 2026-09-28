param([switch]$IncludeGitHistory)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$projectRoot = (Resolve-Path -LiteralPath (Split-Path $PSScriptRoot -Parent)).Path
$exportRoot = Join-Path $projectRoot 'exports'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
$stage = Join-Path $exportRoot "SIVI-continuidade-$stamp"
$source = Join-Path $stage 'SIVI'
$destination = Join-Path $exportRoot "SIVI-transferencia-$stamp.zip"

function Copy-ProjectItem([System.IO.FileSystemInfo]$Item, [string]$Target) {
    if ($Item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) {
        throw "Link de arquivo ou pasta precisa ser revisado antes da exportacao: $($Item.FullName)"
    }
    if ($Item.Name -in @('.git', '.worktrees', 'node_modules', 'exports', 'test-results', 'playwright-report', 'coverage', '.firebase', '.superpowers', '__pycache__')) { return }
    if ($Item.Name -like '*.log' -or $Item.Name -in @('.DS_Store', 'Thumbs.db')) { return }
    if ($Item.Name -like '.env*' -and $Item.Name -ne '.env.example') { return }
    if ($Item.Name -match '(?i)(service.?account|adminsdk|credentials).*\.json$|\.(pem|key|pfx|p12)$') { return }
    if ($Item.PSIsContainer) {
        New-Item -ItemType Directory -Path $Target -Force | Out-Null
        foreach ($child in Get-ChildItem -LiteralPath $Item.FullName -Force) {
            Copy-ProjectItem $child (Join-Path $Target $child.Name)
        }
    } else {
        Copy-Item -LiteralPath $Item.FullName -Destination $Target
    }
}

try {
    New-Item -ItemType Directory -Path $stage | Out-Null
    New-Item -ItemType Directory -Path $source | Out-Null
    # Explicit project roots keep local tooling, caches and credentials out of the snapshot.
    $included = @('.vscode', 'design-system', 'docs', 'scripts', 'src', 'tests', '.firebaserc', '.gitignore', '.env.example', 'COMO_ABRIR.md', 'CONTINUE_AQUI.md', 'README.md', 'database.rules.json', 'firebase.json', 'index.html', 'package.json', 'package-lock.json', 'playwright.config.js')
    foreach ($name in $included) {
        $path = Join-Path $projectRoot $name
        if (Test-Path -LiteralPath $path) { Copy-ProjectItem (Get-Item -LiteralPath $path -Force) (Join-Path $source $name) }
    }
    $files = @(Get-ChildItem -LiteralPath $source -Recurse -File -Force | Sort-Object FullName)
    $manifest = foreach ($file in $files) {
        $relative = $file.FullName.Substring($source.Length + 1).Replace('\', '/')
        "$( (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant() )  $relative"
    }
    $manifest | Set-Content -LiteralPath (Join-Path $source 'SHA256SUMS.txt') -Encoding utf8

    if ($IncludeGitHistory) {
        if (!(Test-Path -LiteralPath (Join-Path $projectRoot '.git'))) { throw 'Esta copia nao contem historico Git. Exporte sem -IncludeGitHistory.' }
        if (!(Get-Command git -ErrorAction SilentlyContinue)) { throw 'Instale Git para incluir o historico, ou exporte sem -IncludeGitHistory.' }
        & git -C $projectRoot bundle create (Join-Path $stage 'SIVI-history.bundle') HEAD --branches
        if ($LASTEXITCODE -ne 0) { throw 'Falha ao exportar o historico Git.' }
        & git -C $projectRoot bundle verify (Join-Path $stage 'SIVI-history.bundle')
        if ($LASTEXITCODE -ne 0) { throw 'Falha ao verificar o historico Git.' }
        $branch = & git -C $projectRoot branch --show-current
        $revision = & git -C $projectRoot rev-parse HEAD
        @{
            branch = $branch
            revision = $revision
            snapshotIncludesUncommittedChanges = $true
            bundleSha256 = (Get-FileHash -LiteralPath (Join-Path $stage 'SIVI-history.bundle') -Algorithm SHA256).Hash.ToLowerInvariant()
        } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $stage 'HISTORICO.json') -Encoding utf8
    }
    @(
        "Gerado em: $(Get-Date -Format o)"
        "Arquivos do projeto: $($files.Count)"
        'Snapshot: conteudo atual da pasta, incluindo alteracoes ainda nao commitadas.'
        'Inicio: extraia a pasta SIVI e leia COMO_ABRIR.md e CONTINUE_AQUI.md.'
        'Integridade: SIVI/SHA256SUMS.txt lista o SHA-256 de cada arquivo incluido.'
        'Verifique antes de editar: na pasta SIVI, execute node scripts/verify-transfer.mjs .'
        'Dependencias, logs, resultados de testes, credenciais locais e .git nao integram o snapshot.'
        "Historico Git opcional incluido: $($IncludeGitHistory.IsPresent). Inclui HEAD e branches locais; alteracoes nao commitadas estao no snapshot."
        'A pasta de continuidade e preservada ao lado do ZIP. Nenhum arquivo anterior e excluido.'
        'Restauracao do Git sem substituir o snapshot: veja docs/25-transferencia-e-retomada.md.'
    ) | Set-Content -LiteralPath (Join-Path $stage 'LEIA-ME-TRANSFERENCIA.txt') -Encoding utf8
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory($stage, $destination)
    $hash = (Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash.ToLowerInvariant()
    "$hash  $(Split-Path $destination -Leaf)" | Set-Content -LiteralPath "$destination.sha256" -Encoding ascii
    Write-Output "Pacote: $destination"
    Write-Output "Pasta pronta: $source"
    Write-Output "Arquivos: $($files.Count)"
    Write-Output "SHA-256: $hash"
}
catch {
    Write-Warning "Exportacao incompleta. Arquivos preservados para diagnostico em: $stage"
    throw
}
