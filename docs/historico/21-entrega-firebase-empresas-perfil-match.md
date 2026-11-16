# Entrega das fases 1 e 2

**Data:** 14/09/2026

**Aplicação:** `index.html`

**Firebase:** projeto `sivi-org`

## Entregue

- cadastro livre de empresas compradoras, fornecedoras ou com as duas atuações;
- empresa criada como `pending`, sem executar operações comerciais antes da aprovação;
- dois contextos selecionáveis para uma empresa com atuação dupla;
- contexto Administração SIVI para contas cadastradas em `platformAdmins`;
- painel administrativo com listagem, aprovação e bloqueio motivado;
- compatibilidade de leitura e operação com associações antigas de papel único;
- perfil industrial independente por fornecedor;
- demanda estruturada com adição e remoção de itens;
- match determinístico e explicável por categoria, processo, material, certificação, região e capacidade;
- oportunidade entregue somente ao fornecedor ativo cujo match seja elegível;
- regras do Realtime Database para os novos caminhos e estados;
- cenário automatizado com administrador, comprador e dois fornecedores.

## Habilitar a primeira conta administrativa

1. Crie a conta normalmente e copie o UID no Firebase Authentication.
2. No Realtime Database, crie `platformAdmins/UID_DA_CONTA` com o valor booleano `true`.
3. Saia e entre novamente no sistema. O contexto **Administração SIVI** aparecerá na seleção.

Não coloque chaves administrativas no frontend. A marcação inicial do administrador é uma configuração controlada do projeto acadêmico.

## Publicar as regras

O alias local já aponta para `sivi-org` em `.firebaserc`. Depois de autenticar o Firebase CLI com a conta proprietária do projeto, execute:

```powershell
npx firebase-tools deploy --only database
```

Essa implantação é deliberadamente manual. Os testes locais nunca publicam regras no banco remoto.

## Verificação

- `npm run test:unit`: valida domínio, rotas, repositório e presença das regras.
- `npm run test:e2e`: executa a jornada real no Auth e Realtime Database Emulator; exige JDK 11 ou superior.
- `npm run serve:test` e, em outro terminal, `npm run test:operations`: valida a jornada demonstrativa no navegador.

## Próximo bloco

Completar propostas por item, comparação e aceite único da fase 3, preservando o mesmo isolamento por organização.
