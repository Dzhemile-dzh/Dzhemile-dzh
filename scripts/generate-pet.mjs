import { writeFileSync } from "node:fs";

const USERNAME = process.env.GITHUB_USERNAME || "Dzhemile-dzh";
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

if (!TOKEN) {
  console.error("GITHUB_TOKEN is required");
  process.exit(1);
}

function calculateCurrentStreak(days) {
  let streak = 0;
  const reversed = [...days].reverse();
  let startIndex = 0;

  if (reversed.length > 0 && reversed[0].contributionCount === 0) {
    startIndex = 1;
  }

  for (let i = startIndex; i < reversed.length; i++) {
    if (reversed[i].contributionCount > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

const sleepingCat = `
<g transform="translate(40 100)">
  <circle cx="125" cy="125" r="118" fill="#FFB8D9"/>
  <ellipse cx="125" cy="165" rx="72" ry="48" fill="#FF9B6A"/>
  <ellipse cx="125" cy="120" rx="48" ry="42" fill="#FFB088"/>
  <path d="M78 95 L70 55 L100 85 Z" fill="#FF9B6A"/>
  <path d="M172 95 L180 55 L150 85 Z" fill="#FF9B6A"/>
  <path d="M82 92 L76 62 L98 85 Z" fill="#FFD0B8"/>
  <path d="M168 92 L174 62 L152 85 Z" fill="#FFD0B8"/>
  <path d="M100 118 Q108 124 116 118" stroke="#5A3A2A" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M134 118 Q142 124 150 118" stroke="#5A3A2A" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="125" cy="132" rx="6" ry="4" fill="#FF7AA2"/>
  <path d="M125 136 Q118 145 112 142" stroke="#5A3A2A" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M125 136 Q132 145 138 142" stroke="#5A3A2A" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle cx="95" cy="128" r="7" fill="#FF8AA8" opacity="0.45"/>
  <circle cx="155" cy="128" r="7" fill="#FF8AA8" opacity="0.45"/>
  <text x="175" y="70" font-family="Arial, sans-serif" font-size="22" fill="#7B5EA7" opacity="0.85">z</text>
  <text x="190" y="55" font-family="Arial, sans-serif" font-size="16" fill="#7B5EA7" opacity="0.7">z</text>
  <ellipse cx="70" cy="175" rx="14" ry="10" fill="#FFB088"/>
  <ellipse cx="180" cy="175" rx="14" ry="10" fill="#FFB088"/>
  <path d="M185 155 Q220 140 215 175 Q205 195 175 180" fill="#FF9B6A"/>
</g>`;

const awakeCat = `
<g transform="translate(40 100)">
  <circle cx="125" cy="125" r="118" fill="#A8F0D0"/>
  <ellipse cx="125" cy="175" rx="62" ry="50" fill="#FF9B6A"/>
  <ellipse cx="125" cy="112" rx="50" ry="46" fill="#FFB088"/>
  <path d="M78 88 L68 42 L105 78 Z" fill="#FF9B6A"/>
  <path d="M172 88 L182 42 L145 78 Z" fill="#FF9B6A"/>
  <path d="M82 85 L76 52 L100 78 Z" fill="#FFD0B8"/>
  <path d="M168 85 L174 52 L150 78 Z" fill="#FFD0B8"/>
  <ellipse cx="108" cy="110" rx="10" ry="12" fill="#2D1B14"/>
  <ellipse cx="142" cy="110" rx="10" ry="12" fill="#2D1B14"/>
  <circle cx="111" cy="106" r="3.5" fill="#fff"/>
  <circle cx="145" cy="106" r="3.5" fill="#fff"/>
  <ellipse cx="125" cy="126" rx="7" ry="5" fill="#FF7AA2"/>
  <path d="M125 131 Q116 142 108 138" stroke="#5A3A2A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M125 131 Q134 142 142 138" stroke="#5A3A2A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M112 132 L85 128" stroke="#5A3A2A" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M112 136 L86 140" stroke="#5A3A2A" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M138 132 L165 128" stroke="#5A3A2A" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M138 136 L164 140" stroke="#5A3A2A" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="95" cy="122" r="8" fill="#FF8AA8" opacity="0.45"/>
  <circle cx="155" cy="122" r="8" fill="#FF8AA8" opacity="0.45"/>
  <ellipse cx="90" cy="195" rx="16" ry="12" fill="#FFB088"/>
  <ellipse cx="160" cy="195" rx="16" ry="12" fill="#FFB088"/>
  <path d="M175 155 Q215 130 220 165 Q210 195 165 180" fill="#FF9B6A"/>
  <circle cx="188" cy="72" r="4" fill="#FFD36B"/>
  <circle cx="205" cy="90" r="3" fill="#FFD36B"/>
</g>`;

const fish = `
<g transform="translate(40 18)">
  <rect x="8" y="18" width="234" height="74" rx="28" fill="#C084FC"/>
  <ellipse cx="95" cy="55" rx="38" ry="24" fill="#FFD36B"/>
  <path d="M55 55 L28 38 L28 72 Z" fill="#FFB020"/>
  <circle cx="112" cy="48" r="5" fill="#2D1B14"/>
  <circle cx="113.5" cy="46.5" r="1.8" fill="#fff"/>
  <path d="M95 62 Q105 70 115 62" stroke="#E8790A" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle cx="160" cy="40" r="3" fill="#fff" opacity="0.85"/>
  <circle cx="180" cy="58" r="2.5" fill="#fff" opacity="0.75"/>
  <circle cx="198" cy="44" r="2" fill="#fff" opacity="0.7"/>
</g>`;

const query = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
            }
          }
        }
      }
    }
  }
`;

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
    "User-Agent": "dzhemile-profile-pet",
  },
  body: JSON.stringify({
    query,
    variables: { login: USERNAME },
  }),
});

if (!res.ok) {
  console.error(`GitHub GraphQL failed: ${res.status}`);
  process.exit(1);
}

const json = await res.json();

if (json.errors?.length) {
  console.error(json.errors.map((e) => e.message).join(", "));
  process.exit(1);
}

const days =
  json.data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
    (week) => week.contributionDays,
  );

const currentStreak = calculateCurrentStreak(days);
const isAwake = currentStreak > 0;
const label = isAwake ? "Active" : "Sleeping";
const pet = isAwake ? awakeCat : sleepingCat;

const svg = `<svg width="330" height="330" viewBox="0 0 330 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GitHub contribution pet for ${USERNAME}">
  <defs>
    <linearGradient id="card" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a1028"/>
      <stop offset="100%" stop-color="#2a1848"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF6BCB"/>
      <stop offset="100%" stop-color="#00D4FF"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="28" fill="url(#card)"/>
  <rect x="14" y="14" width="302" height="302" rx="22" fill="none" stroke="url(#accent)" stroke-width="2" opacity="0.7"/>
  ${fish}
  <text x="70" y="72" fill="#F8FAFC" font-size="15" font-weight="700" font-family="Segoe UI, Arial, sans-serif">Commit Streak</text>
  <text x="70" y="108" fill="#FFFFFF" font-family="Segoe UI, Arial, sans-serif">
    <tspan font-size="34" font-weight="800">${currentStreak}</tspan>
    <tspan font-size="15" font-weight="700" dx="6">Days</tspan>
  </text>
  <text x="70" y="130" fill="#C4B5FD" font-size="12" font-family="Segoe UI, Arial, sans-serif">@${USERNAME} · ${label}</text>
  ${pet}
</svg>
`;

writeFileSync(new URL("../pet.svg", import.meta.url), svg.trim() + "\n");
console.log(`Wrote pet.svg (streak=${currentStreak}, ${label})`);
