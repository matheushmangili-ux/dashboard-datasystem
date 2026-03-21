export interface SellerGoal {
  rank: number;
  name: string;
  department: string;
  monthlyGoal: number;
  achieved: number;
  achievedPercent: number;
  remaining: number;
  dailyGoalNeeded: number;
  projection: number;
  projectionPercent: number;
  dailyAverage: number;
  bestDay: number;
  status: string;
}

export interface WeeklySummary {
  weekNumber: number;
  goal: number;
  achieved: number;
  achievedPercent: number;
  difference: number;
}

export interface MonthOverview {
  monthlyGoal: number;
  achievedTotal: number;
  achievedPercent: number;
  dailyGoalNeeded: number;
  projection: number;
  projectionPercent: number;
  daysRemaining: number;
  daysWorked: number;
  daysTotal: number;
  refLastYear: number;
  vsLastYearPercent: number;
  rhythm: string;
}

export interface SpreadsheetData {
  sellers: SellerGoal[];
  weeks: WeeklySummary[];
  overview: MonthOverview;
  updatedAt: string;
  source: "google-sheets" | "fallback";
}

const SHEET_ID = "1v5qhz-bjucBaJvnQgEzCuPgYzLn-Xqghw9ob03m4vgU";
const GID = "0";

const DEPARTMENT_MAP: Record<string, string> = {
  "João": "Chapelaria",
  "Joao": "Chapelaria",
  "Agnaldo": "Chapelaria",
  "Luiz Alberto": "Selaria"
};

function getDepartment(name: string): string {
  return DEPARTMENT_MAP[name] ?? "Vestuário";
}

let cachedData: SpreadsheetData | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000;

function toNum(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(",", "."));
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

async function fetchFromGoogleSheets(): Promise<SpreadsheetData | null> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pub?gid=${GID}&single=true&output=csv`;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;

    const csv = await response.text();
    if (!csv || csv.length < 50) return null;

    const lines = csv.split("\n").map((l) => parseCSVLine(l));

    const weeks: WeeklySummary[] = [
      { weekNumber: 1, goal: toNum(lines[5]?.[1]), achieved: toNum(lines[6]?.[1]), achievedPercent: toNum(lines[7]?.[1]), difference: toNum(lines[8]?.[1]) },
      { weekNumber: 2, goal: toNum(lines[5]?.[2]), achieved: toNum(lines[6]?.[2]), achievedPercent: toNum(lines[7]?.[2]), difference: toNum(lines[8]?.[2]) },
      { weekNumber: 3, goal: toNum(lines[5]?.[3]), achieved: toNum(lines[6]?.[3]), achievedPercent: toNum(lines[7]?.[3]), difference: toNum(lines[8]?.[3]) },
      { weekNumber: 4, goal: toNum(lines[5]?.[4]), achieved: toNum(lines[6]?.[4]), achievedPercent: toNum(lines[7]?.[4]), difference: toNum(lines[8]?.[4]) }
    ];

    const overview: MonthOverview = {
      monthlyGoal: toNum(lines[12]?.[4]),
      achievedTotal: toNum(lines[12]?.[0]),
      achievedPercent: toNum(lines[12]?.[8]),
      dailyGoalNeeded: toNum(lines[15]?.[0]),
      projection: toNum(lines[15]?.[4]),
      projectionPercent: toNum(lines[15]?.[8]),
      daysRemaining: toNum(lines[17]?.[7]),
      daysWorked: toNum(lines[17]?.[8]),
      daysTotal: toNum(lines[17]?.[9]),
      refLastYear: toNum(lines[17]?.[10]),
      vsLastYearPercent: toNum(lines[17]?.[11]),
      rhythm: lines[19]?.[8]?.trim() || "—"
    };

    const sellers: SellerGoal[] = [];
    for (let i = 23; i <= 33; i++) {
      const row = lines[i];
      if (!row || !row[1]) continue;
      const name = row[1].trim();
      if (name === "TOTAL EQUIPE" || !name) continue;

      sellers.push({
        rank: toNum(row[0], i - 22),
        name,
        department: getDepartment(name),
        monthlyGoal: toNum(row[2]),
        achieved: toNum(row[3]),
        achievedPercent: toNum(row[4]),
        remaining: toNum(row[5]),
        dailyGoalNeeded: toNum(row[6]),
        projection: toNum(row[7]),
        projectionPercent: toNum(row[8]),
        dailyAverage: toNum(row[9]),
        bestDay: toNum(row[10]),
        status: row[11]?.trim() || "—"
      });
    }

    sellers.sort((a, b) => a.rank - b.rank);

    return { sellers, weeks, overview, updatedAt: new Date().toISOString(), source: "google-sheets" };
  } catch {
    return null;
  }
}

function buildFallbackData(): SpreadsheetData {
  const sellers: SellerGoal[] = [
    { rank: 1, name: "Manoel", department: "Vestuário", monthlyGoal: 246500, achieved: 174798.11, achievedPercent: 0.709, remaining: 71701.89, dailyGoalNeeded: 6518.35, projection: 294971.81, projectionPercent: 1.197, dailyAverage: 10924.88, bestDay: 17004.30, status: "Acima da Meta" },
    { rank: 2, name: "João", department: "Chapelaria", monthlyGoal: 310300, achieved: 200058.54, achievedPercent: 0.645, remaining: 110241.46, dailyGoalNeeded: 10021.95, projection: 337598.79, projectionPercent: 1.088, dailyAverage: 12503.66, bestDay: 28525.55, status: "Acima da Meta" },
    { rank: 3, name: "Julio", department: "Vestuário", monthlyGoal: 246500, achieved: 140843.20, achievedPercent: 0.571, remaining: 105656.80, dailyGoalNeeded: 9605.16, projection: 237672.90, projectionPercent: 0.964, dailyAverage: 8802.70, bestDay: 19366.76, status: "No Caminho" },
    { rank: 4, name: "Agnaldo", department: "Chapelaria", monthlyGoal: 310300, achieved: 138904.87, achievedPercent: 0.448, remaining: 171395.13, dailyGoalNeeded: 15581.38, projection: 234401.97, projectionPercent: 0.755, dailyAverage: 8681.55, bestDay: 16396.62, status: "Atenção" },
    { rank: 5, name: "Kaue", department: "Vestuário", monthlyGoal: 246500, achieved: 110159.93, achievedPercent: 0.447, remaining: 136340.07, dailyGoalNeeded: 12394.55, projection: 185894.88, projectionPercent: 0.754, dailyAverage: 6884.99, bestDay: 12961.93, status: "Atenção" },
    { rank: 6, name: "Michele", department: "Vestuário", monthlyGoal: 246500, achieved: 104257.99, achievedPercent: 0.423, remaining: 142242.01, dailyGoalNeeded: 12931.09, projection: 175935.36, projectionPercent: 0.714, dailyAverage: 6516.12, bestDay: 18604.57, status: "Crítico" },
    { rank: 7, name: "Fernando", department: "Vestuário", monthlyGoal: 246500, achieved: 98530.66, achievedPercent: 0.400, remaining: 147969.34, dailyGoalNeeded: 13451.76, projection: 166270.49, projectionPercent: 0.675, dailyAverage: 6158.17, bestDay: 8884.20, status: "Crítico" },
    { rank: 8, name: "Karol", department: "Vestuário", monthlyGoal: 246500, achieved: 93951.32, achievedPercent: 0.381, remaining: 152548.68, dailyGoalNeeded: 13868.06, projection: 158542.85, projectionPercent: 0.643, dailyAverage: 5871.96, bestDay: 21607.00, status: "Crítico" },
    { rank: 9, name: "Alexandre", department: "Vestuário", monthlyGoal: 246500, achieved: 71287.95, achievedPercent: 0.289, remaining: 175212.05, dailyGoalNeeded: 15928.37, projection: 120298.42, projectionPercent: 0.488, dailyAverage: 4455.50, bestDay: 9130.66, status: "Crítico" },
    { rank: 10, name: "Ledson", department: "Vestuário", monthlyGoal: 246500, achieved: 69284.41, achievedPercent: 0.281, remaining: 177215.59, dailyGoalNeeded: 16110.51, projection: 116917.44, projectionPercent: 0.474, dailyAverage: 4330.28, bestDay: 29013.77, status: "Crítico" },
    { rank: 11, name: "Luiz Alberto", department: "Selaria", monthlyGoal: 390000, achieved: 98705.11, achievedPercent: 0.253, remaining: 291294.89, dailyGoalNeeded: 26481.35, projection: 166564.87, projectionPercent: 0.427, dailyAverage: 6169.07, bestDay: 11832.54, status: "Crítico" }
  ];

  const weeks: WeeklySummary[] = [
    { weekNumber: 1, goal: 348000, achieved: 499763.58, achievedPercent: 1.436, difference: -151763.58 },
    { weekNumber: 2, goal: 551000, achieved: 334078.14, achievedPercent: 0.606, difference: 216921.86 },
    { weekNumber: 3, goal: 667000, achieved: 518905.19, achievedPercent: 0.778, difference: 148094.81 },
    { weekNumber: 4, goal: 1334000, achieved: 0, achievedPercent: 0, difference: 1334000 }
  ];

  const overview: MonthOverview = {
    monthlyGoal: 2900000,
    achievedTotal: 1352746.91,
    achievedPercent: 0.466,
    dailyGoalNeeded: 140659.37,
    projection: 2282760.41,
    projectionPercent: 0.787,
    daysRemaining: 11,
    daysWorked: 16,
    daysTotal: 27,
    refLastYear: 794840,
    vsLastYearPercent: 0.702,
    rhythm: "CRÍTICO"
  };

  return { sellers, weeks, overview, updatedAt: new Date().toISOString(), source: "fallback" };
}

export async function loadSpreadsheetData(): Promise<SpreadsheetData> {
  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_TTL) {
    return cachedData;
  }

  const fromSheets = await fetchFromGoogleSheets();

  if (fromSheets) {
    cachedData = fromSheets;
    cacheTimestamp = now;
    return fromSheets;
  }

  const fallback = buildFallbackData();
  cachedData = fallback;
  cacheTimestamp = now;
  return fallback;
}
