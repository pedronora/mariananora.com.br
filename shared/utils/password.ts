export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 72

/**
 * Regras de senha usadas no formulário (client) e no endpoint de redefinição (server).
 * Retorna a primeira mensagem de erro encontrada, ou `null` quando a senha é aceitável.
 */
export function passwordProblem(value: string): string | null {
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`
  }
  if (value.length > PASSWORD_MAX_LENGTH) {
    return `A senha deve ter no máximo ${PASSWORD_MAX_LENGTH} caracteres.`
  }
  if (!/[a-zA-Z]/.test(value)) {
    return 'A senha deve conter pelo menos uma letra.'
  }
  if (!/\d/.test(value)) {
    return 'A senha deve conter pelo menos um número.'
  }
  return null
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/wrong-password': 'Senha atual incorreta.',
  'auth/invalid-credential': 'Senha atual incorreta.',
  'auth/weak-password': `A senha é muito fraca. Use pelo menos ${PASSWORD_MIN_LENGTH} caracteres, com letras e números.`,
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  'auth/requires-recent-login': 'Sua sessão expirou por segurança. Saia e entre novamente para alterar a senha.',
  'auth/network-request-failed': 'Falha de conexão. Verifique sua internet e tente novamente.',
  'auth/user-disabled': 'Esta conta está desativada.',
  'auth/user-not-found': 'Conta não encontrada.',
  'auth/email-already-in-use': 'Este e-mail já está em uso.',
}

export function authErrorMessage(code?: string | null): string {
  if (code && AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code]
  return 'Não foi possível concluir a operação. Tente novamente.'
}
