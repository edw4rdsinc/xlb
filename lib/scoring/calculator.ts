// PPR Scoring Rules
export const SCORING_RULES = {
  // Passing
  PASSING_TD: 6,
  PASSING_YARDS_PER_POINT: 25, // 1 point per 25 yards
  TWO_PT_CONVERSION: 2,

  // Rushing
  RUSHING_TD: 6,
  RUSHING_YARDS_PER_POINT: 10, // 1 point per 10 yards

  // Receiving
  RECEIVING_TD: 6,
  RECEPTION: 1, // PPR - 1 point per reception
  RECEIVING_YARDS_PER_POINT: 10, // 1 point per 10 yards

  // Kicker
  FIELD_GOAL: 3,
  PAT: 1,

  // Defense
  DEF_TD: 6,
  INTERCEPTION: 2,
  SAFETY: 2,
  SACK: 3,
};

export interface PlayerStats {
  // QB/Offensive stats
  passing_tds?: number;
  passing_yards?: number;
  rushing_tds?: number;
  rushing_yards?: number;
  receiving_tds?: number;
  receptions?: number;
  receiving_yards?: number;
  two_point_conversions?: number;

  // Kicker stats
  field_goals?: number;
  pats?: number;

  // Defense stats
  def_tds?: number;
  interceptions?: number;
  safeties?: number;
  sacks?: number;
}

export function calculatePlayerPoints(stats: PlayerStats): number {
  let points = 0;

  // Passing
  if (stats.passing_tds) points += stats.passing_tds * SCORING_RULES.PASSING_TD;
  if (stats.passing_yards) points += Math.round(stats.passing_yards / SCORING_RULES.PASSING_YARDS_PER_POINT);

  // Rushing
  if (stats.rushing_tds) points += stats.rushing_tds * SCORING_RULES.RUSHING_TD;
  if (stats.rushing_yards) points += Math.round(stats.rushing_yards / SCORING_RULES.RUSHING_YARDS_PER_POINT);

  // Receiving (PPR)
  if (stats.receiving_tds) points += stats.receiving_tds * SCORING_RULES.RECEIVING_TD;
  if (stats.receptions) points += stats.receptions * SCORING_RULES.RECEPTION;
  if (stats.receiving_yards) points += Math.round(stats.receiving_yards / SCORING_RULES.RECEIVING_YARDS_PER_POINT);

  // Two-point conversions
  if (stats.two_point_conversions) points += stats.two_point_conversions * SCORING_RULES.TWO_PT_CONVERSION;

  // Kicker
  if (stats.field_goals) points += stats.field_goals * SCORING_RULES.FIELD_GOAL;
  if (stats.pats) points += stats.pats * SCORING_RULES.PAT;

  // Defense
  if (stats.def_tds) points += stats.def_tds * SCORING_RULES.DEF_TD;
  if (stats.interceptions) points += stats.interceptions * SCORING_RULES.INTERCEPTION;
  if (stats.safeties) points += stats.safeties * SCORING_RULES.SAFETY;
  if (stats.sacks) points += stats.sacks * SCORING_RULES.SACK;

  return Math.round(points * 100) / 100; // Round to 2 decimal places
}
