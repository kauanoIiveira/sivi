export function getAuthErrorMessage(error) {
  const messages = {
    "auth/account-exists-with-different-credential":
      "Este e-mail já está ligado a outro método de acesso.",
    "auth/email-already-in-use": "Já existe uma conta cadastrada com este e-mail.",
    "auth/email-not-verified": "Confirme seu e-mail antes de entrar no SIVI.",
    "auth/email-not-verified-verification-sent":
      "Seu e-mail ainda não foi confirmado. Enviamos um novo link de verificação.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/invalid-email": "Informe um endereço de e-mail válido.",
    "auth/network-request-failed": "Não foi possível conectar ao Firebase. Verifique sua internet.",
    "auth/operation-not-allowed": "Este método de acesso ainda não foi habilitado no Firebase.",
    "auth/password-does-not-meet-requirements":
      "A senha informada não atende à política configurada no Firebase.",
    "auth/popup-blocked": "O navegador bloqueou a janela de autenticação.",
    "auth/popup-closed-by-user": "A autenticação foi cancelada antes de terminar.",
    "auth/sdk-unavailable": "A autenticação não pôde ser carregada. Verifique sua conexão e tente novamente.",
    "auth/too-many-requests": "Muitas tentativas seguidas. Aguarde um pouco e tente novamente.",
    "auth/user-disabled": "Esta conta está desativada. Procure o suporte do SIVI.",
    "auth/user-not-found": "E-mail ou senha incorretos.",
    "auth/unauthorized-domain": "Este domínio ainda não foi autorizado no Firebase.",
    "auth/invalid-api-key": "A configuração pública do Firebase precisa ser revisada.",
    "auth/unsupported-provider": "Este provedor de acesso não é suportado.",
    "auth/weak-password": "A senha informada ainda não atende aos requisitos de segurança.",
    "auth/wrong-password": "E-mail ou senha incorretos.",
  };

  return messages[error?.code] ?? "Não foi possível concluir a operação. Tente novamente.";
}
