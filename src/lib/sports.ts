export interface Sport {
  name: string;
  emoji: string;
}

export const SPORTS: Sport[] = [
  { name: 'Fußball', emoji: '⚽' },
  { name: 'Handball', emoji: '🤾' },
  { name: 'Basketball', emoji: '🏀' },
  { name: 'Volleyball', emoji: '🏐' },
  { name: 'Tennis', emoji: '🎾' },
  { name: 'Tischtennis', emoji: '🏓' },
  { name: 'Badminton', emoji: '🏸' },
  { name: 'Yoga', emoji: '🧘' },
  { name: 'Schwimmen', emoji: '🏊' },
  { name: 'Leichtathletik', emoji: '🏃' },
  { name: 'Turnen', emoji: '🤸' },
  { name: 'Judo', emoji: '🤼' },
  { name: 'Karate', emoji: '🥋' },
  { name: 'Taekwondo', emoji: '🦵' },
  { name: 'Boxen', emoji: '🥊' },
  { name: 'Radsport', emoji: '🚴' },
  { name: 'Klettern', emoji: '🧗' },
  { name: 'Skifahren', emoji: '⛷️' },
  { name: 'Eishockey', emoji: '🏒' },
  { name: 'Rudern', emoji: '🚣' },
  { name: 'Golf', emoji: '⛳' },
  { name: 'Reiten', emoji: '🐎' },
  { name: 'Tanzen', emoji: '💃' },
  { name: 'Fitness', emoji: '🏋️' },
];

export function getSportEmoji(name: string): string {
  return SPORTS.find((s) => s.name === name)?.emoji ?? '🏆';
}
