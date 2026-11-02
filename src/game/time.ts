/**
 * SISTEMA DE TEMPO — CONVERSÃO JOGO ↔ VIDA REAL
 *
 * Tabela de Conversão:
 * - 6 horas de jogo = 1 hora real (Fator 6x: 1s real = 6s jogo)
 * - 1 dia de jogo = 4 horas reais (14.400s reais = 86.400s jogo)
 * - 7 dias de jogo = ~28 horas reais
 * - 30 dias de jogo = 5 dias reais (120 horas reais)
 */

export const REAL_TO_GAME_SPEED_FACTOR = 6; // 1 real second = 6 game seconds

/**
 * Formata o tempo de jogo acumulado em formato legível (ex: "Dia 3 • 14:30")
 * O jogo inicia no Dia 1 às 08:00 AM.
 */
export function formatGameTime(totalGameSeconds: number): {
  dayStr: string;
  timeStr: string;
  fullStr: string;
  dayNumber: number;
} {
  const secondsInDay = 86400; // 24 * 3600
  const dayNumber = Math.floor(totalGameSeconds / secondsInDay) + 1;
  const currentDaySeconds = totalGameSeconds % secondsInDay;

  // Início às 08:00 (28.800s)
  const startOffsetSeconds = 8 * 3600;
  const timeSeconds = (currentDaySeconds + startOffsetSeconds) % secondsInDay;

  const hours = Math.floor(timeSeconds / 3600);
  const minutes = Math.floor((timeSeconds % 3600) / 60);

  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');

  const dayStr = `Dia ${dayNumber}`;
  const timeStr = `${hoursStr}:${minutesStr}`;
  const fullStr = `${dayStr} • ${timeStr}`;

  return { dayStr, timeStr, fullStr, dayNumber };
}

/**
 * Retorna o tempo de construção real formatado (ex: "45m 20s" ou "2h 15m")
 */
export function formatRealTimeRemaining(totalRealSeconds: number): string {
  if (totalRealSeconds <= 0) return 'Concluído!';
  const hours = Math.floor(totalRealSeconds / 3600);
  const minutes = Math.floor((totalRealSeconds % 3600) / 60);
  const seconds = Math.floor(totalRealSeconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Calcula os segundos reais de construção por andar (conforme especificação da Seção 6):
 * 2º Andar: 1h real (6h jogo)
 * 3º Andar: 2h real (12h jogo)
 * 4º Andar: 4h real (1 dia jogo)
 * 5º Andar: 8h real (2 dias jogo)
 * 6º+ Andar: 12h real (3 dias jogo)
 */
export function getFloorConstructionTimeRealSeconds(floorNumber: number): number {
  if (floorNumber <= 2) return 3600; // 1h real
  if (floorNumber === 3) return 7200; // 2h real
  if (floorNumber === 4) return 14400; // 4h real
  if (floorNumber === 5) return 28800; // 8h real
  return 43200; // 12h real para 6º ou superior
}
