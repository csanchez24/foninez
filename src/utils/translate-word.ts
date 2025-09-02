const WORDS: Record<string, string> = {
  rejected: 'rechazado',
  active: 'activo',
  inactive: 'inactivo',
  completed: 'completo',
  pending: 'pendiente',
  approved: 'aprobado',
  denied: 'denegado',
  confirmed: 'confirmado',
  sent: 'enviado',
};

export const translateWord = (word: string) => {
  return WORDS[word] ?? word;
};
