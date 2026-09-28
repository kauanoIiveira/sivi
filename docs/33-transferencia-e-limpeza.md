# Transferência e limpeza — 27/09/2026

Nenhum arquivo antigo foi excluído nesta entrega. A preparação gera uma cópia nova sem dependências instaladas, logs ou resultados temporários, preservando o diretório de trabalho e toda a documentação.

## O que levar

Use o pacote `SIVI-transferencia-DATA.zip` mais recente, acompanhado do `.sha256`, ou a pasta `exports/SIVI-continuidade-DATA`. Ambos contêm:

- `SIVI/`: código, testes, scripts, configurações públicas, design e toda a pasta `docs`, incluindo alterações ainda não commitadas;
- `SIVI/SHA256SUMS.txt`: hashes individuais dos arquivos;
- `SIVI-history.bundle` e `HISTORICO.json`, quando gerado com `-IncludeGitHistory`: histórico de `HEAD` e das branches locais, incluindo a branch de trabalho atual;
- `LEIA-ME-TRANSFERENCIA.txt`: identificação da cópia e instruções iniciais.

Na pasta `SIVI` copiada, execute `node scripts/verify-transfer.mjs .` antes de editar. Depois use `npm ci` e `npm start`. A aplicação abre em `http://127.0.0.1:4173/#/`. Para restaurar Git sem substituir o snapshot, siga [25 — Transferência e retomada](25-transferencia-e-retomada.md). Copiar a pasta não transfere usuários nem dados do Firebase.

## O que pode ser excluído manualmente

O [inventário exato](reviews/2026-09-27-inventario-limpeza.json) registra os nomes encontrados na pasta original e o motivo da classificação. Ele não executa remoções.

| Caminho na pasta original | Orientação |
|---|---|
| Arquivos `*.log` diretamente na raiz, listados no inventário | Podem ser excluídos quando nenhum teste/emulador estiver em execução. São saídas de execução, não código. |
| `test-results/`, `playwright-report/`, `coverage/` quando presentes | Regeneráveis. Preserve uma falha específica apenas enquanto estiver investigando. |
| `node_modules/` | Opcional. Pode ser reinstalado com `npm ci`; excluir daqui impede executar testes até reinstalar. A cópia portátil já o omite. |
| ZIPs antigos `exports/SIVI-transferencia-20260920-*.zip` e seus `.sha256` | Dispensáveis depois de conferir o pacote novo. O inventário lista os arquivos exatos. |
| Pastas de capturas antigas em `exports/` | Opcionais para continuidade do código. Guarde-as separadamente se quiser manter comparações visuais históricas. |
| `exports/public-refinement-before.png` | Comparação visual antiga, opcional. |

**Preservar:** `docs/`, `design-system/`, `src/`, `tests/`, `scripts/`, configurações, `package.json`, `package-lock.json`, `index.html`, guias de entrada e `.git/` da pasta original. Testes e fixtures continuam necessários para o desenvolvimento, embora não sejam dados da aplicação.

**Revisar antes de descartar:** `.superpowers/` contém anotações e scripts da correção anterior; `exports/SIVI-historico-anterior-20260920-213256.bundle` é um backup de histórico distinto. Eles não participam da execução, mas também não são simples logs. O pacote novo de continuidade não substitui automaticamente esse histórico antigo. Mantenha esses materiais como arquivo separado enquanto houver dúvida sobre sua utilidade.

**Guardar até confirmar a mudança:** o novo ZIP, seu hash e a pasta de continuidade. Não exclua a pasta original inteira antes de conferir a cópia, iniciar a aplicação e restaurar o histórico desejado no destino.

## Reproduzir a preparação

```powershell
.\scripts\export-project.ps1 -IncludeGitHistory
```

O script mantém a pasta gerada ao lado do ZIP. Se ocorrer falha, deixa a cópia parcial para diagnóstico, sem excluir artefatos anteriores. O arquivo de hashes deixa de descrever os arquivos assim que a cópia for editada; serve para validar o transporte inicial.
