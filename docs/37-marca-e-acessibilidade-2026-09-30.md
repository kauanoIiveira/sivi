# Marca e acessibilidade — 30/09/2026

Projeto editado: `C:\Users\Kauan\Desktop\sivi`.

A raposa original aparece também no topo da lateral do sistema. A página inicial e o acesso ficam sempre claros, sem engrenagem ou links de aparência. A escolha de tema do sistema continua salva e volta a valer ao entrar na área de trabalho.

## Preferências do sistema

As opções atuais são tema, tamanho do texto, contraste, daltonismo e VLibras. Movimento e espaçamento foram retirados. Preferências antigas desses dois controles são ignoradas, mantendo o espaçamento original. A redução de movimento escolhida no próprio dispositivo continua sendo respeitada automaticamente.

Daltonismo oferece as alternativas vermelho/verde e azul/amarelo. Elas trocam as cores dos estados, incluindo indicadores com cores literais nas páginas do comprador. Os textos, símbolos e controles continuam presentes; a marca e as imagens não recebem filtros. Essas alternativas atuam somente no sistema. Os pares de texto/fundo das paletas verificados tiveram contraste mínimo de 6,40:1.

O VLibras começa desativado. Ao ativar, carrega o SDK oficial e disponibiliza o botão de Libras. Ao desativar ou sair do sistema, fecha o tradutor e retira seus controles da interação. Falhas de rede têm mensagem e nova tentativa; alterar outro ajuste ou desativar não inicia um download novamente. A integração e o ponto de compatibilidade do Widget 7 estão documentados em [VLibras](vlibras-integracao.md).

As preferências ficam neste navegador. No acesso e na página inicial, ajustes de aparência do sistema ficam suspensos; o zoom do navegador continua disponível.

## Verificação e preservação

- 172 testes unitários aprovados.
- 57 testes únicos de navegador aprovados. O lote principal aprovou 56 casos; após o ajuste para evitar downloads involuntários, oito casos foram conferidos novamente, incluindo um caso novo.
- O SDK oficial do VLibras foi carregado em uma verificação real: botão e tradutor presentes, desativação confirmada, sem erro de página ou de requisição.
- Conferência visual de preferências nos temas claro/escuro e larguras 320, 390, 768 e 1440, sem overflow. Home e acesso permaneceram claros com tema escuro do dispositivo e preferência escura salva.
- O mapa, a conta, os formulários e os controles existentes foram preservados. Não houve alteração em regras, domínio, repositórios comerciais ou autenticação.
- Comparação com o backup confirmou que nenhum arquivo anterior foi removido.

Backup: `C:\Users\Kauan\Desktop\sivi-backup-acessibilidade-20260930.zip`.

Capturas: [exports/design-acessibilidade-2026-09-30](../exports/design-acessibilidade-2026-09-30). Registro: [revisão](reviews/2026-09-30-acessibilidade.json).

Referências consultadas: [VLibras — integração oficial](https://vlibras.gov.br/doc/widget/installation/webpageintegration.html) e [W3C — uso de cor](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color).
