# Implementação do acesso

**Atualização:** 27/08/2026
**Estado:** primeira fatia funcional criada; temas claro e escuro implementados; identidade visual e imagem lateral ainda provisórias

## Escopo entregue

- cadastro com nome, sobrenome, e-mail, senha e confirmação de senha;
- validação local de senha com mínimo de 8 caracteres, maiúscula, minúscula e número;
- login com e-mail e senha;
- encerramento da sessão após o cadastro, bloqueio do login por senha até a confirmação do e-mail e reenvio automático do link em uma nova tentativa válida;
- recuperação de senha com mensagem que não revela se o e-mail existe;
- botões de Google e GitHub disponíveis tanto no cadastro quanto no login e conectados aos provedores do Firebase;
- transição cadastro ↔ login de 0,42 s no desktop e cerca de 0,24 s no mobile;
- painel fotográfico cruza diretamente para o lado oposto, sem expansão ou intervalo no centro;
- temas claro e escuro, preferência inicial do sistema, escolha persistida no navegador e alternativa reduzida para `prefers-reduced-motion`;
- imagem industrial provisória otimizada em `src/assets/auth-industrial-placeholder.webp`.

Atualização de 16/09/2026: o login redireciona para a seleção de empresa e para as rotas autenticadas. Este documento preserva o registro técnico da implementação inicial do acesso; consulte `CONTINUE_AQUI.md` para o estado atual.

## Estrutura técnica

- HTML sem framework em `index.html`;
- ponto de entrada mínimo em `src/main.js`;
- tokens semânticos dos dois temas em `src/styles/theme-tokens.css`;
- controle, preferência do sistema e persistência do tema em `src/theme/theme-controller.js`;
- CSS e comportamento da página em `src/pages/auth/`;
- movimento isolado em `src/pages/auth/auth-transitions.js` e validações em `src/pages/auth/auth-validation.js`;
- inicialização do Firebase em `src/config/firebase.js`;
- operações de autenticação e perfil em `src/services/auth-service.js`;
- Live Server como servidor local da aplicação;
- Anime.js versionado localmente em `src/vendor` para que a animação não dependa de CDN;
- import map no `index.html` para os módulos de navegador do Firebase;
- Anime.js para entrada, troca de formulário e feedbacks de movimento;
- Firebase Authentication para credenciais;
- Realtime Database para o perfil inicial em `users/{uid}`.

Senhas nunca são gravadas no Realtime Database. Elas são enviadas somente ao Firebase Authentication.
O caminho `users/{uid}` contém apenas perfil e andamento de onboarding. Aprovação, suspensão, papéis e permissões não são escritos pelo cliente e deverão ficar em uma área controlada por regras administrativas ou backend confiável.

## Configuração Firebase

A configuração pública do SDK web fica em `src/config/firebase.js`. Essa configuração identifica o projeto no navegador e não é uma credencial administrativa; a segurança depende das regras, do App Check e das restrições da chave. O endereço do banco confirmado para o projeto é:

```text
https://sivi-org-default-rtdb.firebaseio.com
```

O endpoint respondeu com `Permission denied` sem autenticação, indicando que não está publicamente aberto. Isso não substitui a revisão das regras.

Na consulta pública feita em 23/08/2026, o projeto retornou `localhost`, `sivi-org.firebaseapp.com` e `sivi-org.web.app` como domínios autorizados, mas não expôs provedores de login habilitados. Antes do teste real, confirmar no Console do Firebase:

1. habilitar **E-mail/senha** em Authentication → Sign-in method;
2. habilitar Google e GitHub apenas se os botões sociais permanecerem no produto;
3. configurar o e-mail remetente e o template de verificação;
4. revisar as regras do Realtime Database;
5. restringir a chave do SDK web às APIs e origens necessárias no Google Cloud.

Uma regra inicial estrita para o perfil foi versionada em `database.rules.json`, referenciada por `firebase.json` e **não foi implantada automaticamente**. Ela limita cada pessoa ao próprio perfil, valida campos permitidos e não contém aprovação, papel ou vínculo empresarial. Não reutilizar essa regra como solução das organizações, propostas ou pedidos; o isolamento multiempresa exige regras e consultas próprias.

## Execução local

No VS Code, abrir `index.html` com **Open with Live Server**. A configuração em `.vscode/settings.json` fixa o endereço `http://localhost:5500/`, compatível com o domínio local autorizado no Firebase.

O `index.html` aberto diretamente funciona apenas como prévia estática; o aviso na própria página orienta a usar Live Server para animações e Firebase. Node.js, Vite e uma etapa de build não são necessários no fluxo atual.

## Próximas decisões

- substituir a identificação e a imagem provisórias após receber a versão gráfica aprovada da raposa e o logo;
- revisar os valores cromáticos dos tokens quando a paleta final da marca for aprovada, preservando os papéis semânticos e os dois temas;
- decidir se Google e GitHub permanecem no cadastro;
- desenhar e implementar a primeira tela autenticada;
- definir o estado de organização aguardando aprovação;
- ajustar textos, remetente e limites do reenvio de verificação no Console;
- validar regras de dados multiempresa antes de persistir qualquer registro operacional.
