// Plain-language glossary + explainer copy. Every baseball term a newcomer
// might hit is defined here and surfaced as a tooltip via <Term>.

export const GLOSSARY: Record<string, string> = {
  league:
    "Baseball's 30 teams are split into two leagues: the American League (AL) and the National League (NL). The winner of each league meets in the World Series.",
  division:
    'Each league is split into three groups of five teams — East, Central, and West — called divisions. Teams play their division rivals most often.',
  'division leader':
    'The team with the best record in its division right now. Win your division and you get a guaranteed playoff spot and a higher seed.',
  'wild card':
    "A playoff spot for the best teams that did NOT win their division. Each league gives three wild cards to its next-best teams. A wild card can even have a better record than a division winner — but division winners always get the higher seed.",
  seed:
    'A ranking (1 through 6) that decides who plays whom in the playoffs and who gets home-field advantage. Lower number = better. The top two seeds skip the first round.',
  record:
    "A team's wins and losses, written as W–L (for example, 56–42 means 56 wins, 42 losses). More wins is better. The season is 162 games.",
  'games behind':
    'How far a team trails the leader. If you\'re "3 games behind," you\'d need to gain three games in the standings to catch up. "0" or "–" means you\'re in front.',
  'win percentage':
    'Wins divided by games played. A team that has won 56 of 98 games has a .571 win percentage. It\'s the fairest way to compare teams that have played a different number of games.',
  'magic number':
    'The combined number of your wins + rivals\' losses needed to clinch a spot. When it hits zero, you\'re officially in. A small magic number means you\'re close.',
  'run differential':
    'Runs scored minus runs allowed, across the whole season. A big positive number usually means a genuinely strong team, not just a lucky one.',
  'playoff odds':
    "An estimate (from ESPN) of the percent chance a team makes the playoffs, based on its record and who's left to play. 90%+ is nearly a lock; under ~10% is a long shot.",
  playoffs:
    'The tournament at the end of the season (October). Twelve teams qualify and play knockout series until one is left — the World Series champion.',
  'wild card series':
    'The first playoff round: a short best-of-3 series. Seeds 3–6 play; the top two seeds in each league get a bye (they skip it).',
  'division series':
    'The second round — a best-of-5 series (first team to 3 wins advances). The two seeds that had a bye enter here.',
  'league championship':
    'The round that decides each league\'s champion — a best-of-7 series (first to 4 wins). The winner is called the "pennant" winner and goes to the World Series.',
  'world series':
    'The championship. The American League champion plays the National League champion in a best-of-7 series. First team to win four games is the champion of baseball.',
  'best of 7':
    'A series where the two teams play until one wins four games (so it lasts 4 to 7 games). Best-of-5 works the same way but you only need 3 wins.',
  bye: 'A free pass past the first round. The top two seeds in each league earn a bye by having the best records.',
  streak: 'How a team is playing lately — for example "W4" means they\'ve won their last four games, "L2" means lost their last two.',
}

export interface HowStep {
  emoji: string
  title: string
  body: string
}

export const HOW_IT_WORKS: HowStep[] = [
  {
    emoji: '⚾',
    title: '30 teams, 2 leagues',
    body: "Major League Baseball has 30 teams, split into the American League and the National League. Each league is divided into three groups of five — East, Central, and West — called divisions.",
  },
  {
    emoji: '📅',
    title: 'A long season',
    body: 'Every team plays 162 games from spring into fall. There\'s no single scoreboard — teams pile up wins and losses, and the standings sort out who\'s best. That\'s why you\'ll see records like "56–42."',
  },
  {
    emoji: '🎟️',
    title: 'Twelve teams reach October',
    body: 'The playoffs take the top teams from each league: the three division winners, plus three "wild cards" — the best teams that didn\'t win their division. Six teams per league, twelve in all.',
  },
  {
    emoji: '🃏',
    title: "The wild-card twist",
    body: "Here's the quirk newcomers love: a wild-card team can have a better record than a division winner and still be seeded below them. Winning your division is rewarded with a higher seed and a possible first-round bye.",
  },
  {
    emoji: '🪜',
    title: 'A knockout ladder',
    body: 'From there it\'s single-elimination series: the Wild Card round (best of 3) → Division Series (best of 5) → League Championship (best of 7). Win three rounds and you\'ve won your league\'s "pennant."',
  },
  {
    emoji: '🏆',
    title: 'The World Series',
    body: 'The American League champion plays the National League champion in a best-of-7 series. The first team to win four games is the World Series champion — the last team standing out of all 30.',
  },
]
