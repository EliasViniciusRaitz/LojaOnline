// src/utils/helpers.ts
/**
 * Gera uma data aleatória que está a até 5 anos no passado.
 */
export const generateRandomDate = (): string => {
  const now = new Date().getTime();
  // 5 anos em milissegundos (aproximadamente)
  const fiveYearsInMs = 5 * 365 * 24 * 60 * 60 * 1000; 

  // Gera um timestamp aleatório entre (agora - 5 anos) e (agora)
  const randomTime = now - Math.floor(Math.random() * fiveYearsInMs);
  
  return new Date(randomTime).toISOString();
};