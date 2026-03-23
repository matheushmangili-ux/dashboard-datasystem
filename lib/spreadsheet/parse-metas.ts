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
  ticketMedioPU: number;
  piecesPerAttendance: number;
  conversionRate: number;
}

export interface CommissionEntry {
  name: string;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  total: number;
  achievedPercent: number;
  band: string;
  status: string;
}

export interface SellerWeeklyDetail {
  name: string;
  weeklyGoal: number;
  dailySales: number[];
  totalAchieved: number;
  remaining: number;
  achievedPercent: number;
  dailyAverage: number;
  totalAccumulated: number;
  accumulatedPercent: number;
  status: string;
}

export interface WeekDetail {
  weekNumber: number;
  title: string;
  workingDays: number;
  dayLabels: string[];
  sellers: SellerWeeklyDetail[];
}

export interface SpreadsheetData {
  sellers: SellerGoal[];
  weeks: WeeklySummary[];
  weekDetails: WeekDetail[];
  commissions: CommissionEntry[];
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
      rhythm: lines[19]?.[8]?.trim() || "—",
      ticketMedioPU: toNum(lines[18]?.[7], 0),
      piecesPerAttendance: toNum(lines[18]?.[9], 0),
      conversionRate: toNum(lines[18]?.[8], 0)
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

    return { sellers, weeks, weekDetails: [], commissions: [], overview, updatedAt: new Date().toISOString(), source: "google-sheets" };
  } catch {
    return null;
  }
}

function buildFallbackData(): SpreadsheetData {
  const sellers: SellerGoal[] = [
    { rank: 1, name: "Manoel", department: "Vestuário", monthlyGoal: 246500, achieved: 177697.81, achievedPercent: 0.7209, remaining: 68802.19, dailyGoalNeeded: 7644.69, projection: 266546.72, projectionPercent: 1.0813, dailyAverage: 9872.10, bestDay: 17004.30, status: "Acima da Meta" },
    { rank: 2, name: "João", department: "Chapelaria", monthlyGoal: 310300, achieved: 200058.54, achievedPercent: 0.6447, remaining: 110241.46, dailyGoalNeeded: 12249.05, projection: 300087.81, projectionPercent: 0.9671, dailyAverage: 11114.36, bestDay: 28525.55, status: "No Caminho" },
    { rank: 3, name: "Julio", department: "Vestuário", monthlyGoal: 246500, achieved: 144395.80, achievedPercent: 0.5858, remaining: 102104.20, dailyGoalNeeded: 11344.91, projection: 216593.70, projectionPercent: 0.8787, dailyAverage: 8021.99, bestDay: 19366.76, status: "Atenção" },
    { rank: 4, name: "Agnaldo", department: "Chapelaria", monthlyGoal: 310300, achieved: 145214.59, achievedPercent: 0.4680, remaining: 165085.41, dailyGoalNeeded: 18342.82, projection: 217821.89, projectionPercent: 0.7020, dailyAverage: 8067.48, bestDay: 16396.62, status: "Crítico" },
    { rank: 5, name: "Kaue", department: "Vestuário", monthlyGoal: 246500, achieved: 111619.83, achievedPercent: 0.4528, remaining: 134880.17, dailyGoalNeeded: 14986.69, projection: 167429.75, projectionPercent: 0.6792, dailyAverage: 6201.10, bestDay: 12961.93, status: "Crítico" },
    { rank: 6, name: "Michele", department: "Vestuário", monthlyGoal: 246500, achieved: 104397.89, achievedPercent: 0.4235, remaining: 142102.11, dailyGoalNeeded: 15789.12, projection: 156596.84, projectionPercent: 0.6353, dailyAverage: 5799.88, bestDay: 18604.57, status: "Crítico" },
    { rank: 7, name: "Fernando", department: "Vestuário", monthlyGoal: 246500, achieved: 98530.66, achievedPercent: 0.3997, remaining: 147969.34, dailyGoalNeeded: 16441.04, projection: 147795.99, projectionPercent: 0.5996, dailyAverage: 5473.93, bestDay: 8884.20, status: "Crítico" },
    { rank: 8, name: "Karol", department: "Vestuário", monthlyGoal: 246500, achieved: 97140.42, achievedPercent: 0.3941, remaining: 149359.58, dailyGoalNeeded: 16595.51, projection: 145710.63, projectionPercent: 0.5911, dailyAverage: 5396.69, bestDay: 21607.00, status: "Crítico" },
    { rank: 9, name: "Ledson", department: "Vestuário", monthlyGoal: 246500, achieved: 84817.01, achievedPercent: 0.3441, remaining: 161682.99, dailyGoalNeeded: 17964.78, projection: 127225.52, projectionPercent: 0.5161, dailyAverage: 4712.06, bestDay: 29013.77, status: "Crítico" },
    { rank: 10, name: "Alexandre", department: "Vestuário", monthlyGoal: 246500, achieved: 72027.75, achievedPercent: 0.2922, remaining: 174472.25, dailyGoalNeeded: 19385.81, projection: 108041.63, projectionPercent: 0.4383, dailyAverage: 4001.54, bestDay: 9130.66, status: "Crítico" },
    { rank: 11, name: "Luiz Alberto", department: "Selaria", monthlyGoal: 390000, achieved: 98971.01, achievedPercent: 0.2538, remaining: 291028.99, dailyGoalNeeded: 32336.55, projection: 148456.52, projectionPercent: 0.3807, dailyAverage: 5498.39, bestDay: 11832.54, status: "Crítico" }
  ];

  const weeks: WeeklySummary[] = [
    { weekNumber: 1, goal: 348000, achieved: 499763.58, achievedPercent: 1.4361, difference: -151763.58 },
    { weekNumber: 2, goal: 551000, achieved: 334078.14, achievedPercent: 0.6063, difference: 216921.86 },
    { weekNumber: 3, goal: 667000, achieved: 553584.31, achievedPercent: 0.8300, difference: 113415.69 },
    { weekNumber: 4, goal: 1334000, achieved: 0, achievedPercent: 0, difference: 1334000 }
  ];

  const weekDetails: WeekDetail[] = [
    {
      weekNumber: 1, title: "Semana 1 - Metas Março 2026", workingDays: 6,
      dayLabels: ["Sáb", "Seg", "Ter", "Qua", "Qui", "Sex"],
      sellers: [
        { name: "Agnaldo", weeklyGoal: 35790, dailySales: [8690.89, 6309.72, 4490.31, 4068.61, 9019.82, 16396.62], totalAchieved: 48975.97, remaining: -13185.97, achievedPercent: 1.3685, dailyAverage: 8162.66, totalAccumulated: 48975.97, accumulatedPercent: 1.3685, status: "Acima da Meta" },
        { name: "Manoel", weeklyGoal: 28450, dailySales: [5765.70, 14614.71, 2699.70, 8783.70, 10254.60, 17004.30], totalAchieved: 59122.71, remaining: -30672.71, achievedPercent: 2.0782, dailyAverage: 9853.79, totalAccumulated: 59122.71, accumulatedPercent: 2.0782, status: "Acima da Meta" },
        { name: "Michele", weeklyGoal: 28450, dailySales: [18604.57, 13397.19, 6614.11, 5048.10, 10694.30, 6996.03], totalAchieved: 61354.30, remaining: -32904.30, achievedPercent: 2.1565, dailyAverage: 10225.72, totalAccumulated: 61354.30, accumulatedPercent: 2.1565, status: "Acima da Meta" },
        { name: "Karol", weeklyGoal: 28450, dailySales: [21607.00, 6259.00, 3810.30, 1975.20, 7509.80, 4848.40], totalAchieved: 46009.70, remaining: -17559.70, achievedPercent: 1.6171, dailyAverage: 7668.28, totalAccumulated: 46009.70, accumulatedPercent: 1.6171, status: "Acima da Meta" },
        { name: "Kaue", weeklyGoal: 28450, dailySales: [3260.20, 12961.93, 7879.72, 6380.60, 10009.80, 10222.30], totalAchieved: 50714.55, remaining: -22264.55, achievedPercent: 1.7826, dailyAverage: 8452.43, totalAccumulated: 50714.55, accumulatedPercent: 1.7826, status: "Acima da Meta" },
        { name: "Julio", weeklyGoal: 28450, dailySales: [5367.20, 5329.70, 5652.80, 3696.31, 10432.30, 19366.76], totalAchieved: 49845.07, remaining: -21395.07, achievedPercent: 1.7521, dailyAverage: 8307.51, totalAccumulated: 49845.07, accumulatedPercent: 1.7521, status: "Acima da Meta" },
        { name: "Alexandre", weeklyGoal: 28450, dailySales: [4999.83, 9130.66, 4769.82, 844.61, 2684.10, 4909.80], totalAchieved: 27338.82, remaining: 1111.18, achievedPercent: 0.9609, dailyAverage: 4556.47, totalAccumulated: 27338.82, accumulatedPercent: 0.9609, status: "Atenção" },
        { name: "Luiz Alberto", weeklyGoal: 45050, dailySales: [1590.30, 4399.81, 5559.90, 2394.31, 4340.81, 5120.62], totalAchieved: 23405.75, remaining: 21644.25, achievedPercent: 0.5195, dailyAverage: 3900.96, totalAccumulated: 23405.75, accumulatedPercent: 0.5195, status: "Crítico" },
        { name: "Fernando", weeklyGoal: 28450, dailySales: [1984.60, 2779.81, 6499.60, 6553.72, 4180.61, 3764.10], totalAchieved: 25762.44, remaining: 2687.56, achievedPercent: 0.9055, dailyAverage: 4293.74, totalAccumulated: 25762.44, accumulatedPercent: 0.9055, status: "Atenção" },
        { name: "João", weeklyGoal: 35790, dailySales: [12268.08, 13119.77, 2429.70, 7549.81, 28525.55, 11932.33], totalAchieved: 75825.24, remaining: -40035.24, achievedPercent: 2.1187, dailyAverage: 12637.54, totalAccumulated: 75825.24, accumulatedPercent: 2.1187, status: "Acima da Meta" },
        { name: "Ledson", weeklyGoal: 28450, dailySales: [29013.77, 3929.80, 2049.40, 1180.70, 2735.31, 1500.00], totalAchieved: 40408.98, remaining: -11958.98, achievedPercent: 1.4203, dailyAverage: 6734.83, totalAccumulated: 40408.98, accumulatedPercent: 1.4203, status: "Acima da Meta" }
      ]
    },
    {
      weekNumber: 2, title: "Semana 2 - Metas Março 2026", workingDays: 6,
      dayLabels: ["Sáb", "Seg", "Ter", "Qua", "Qui", "Sex"],
      sellers: [
        { name: "Agnaldo", weeklyGoal: 56695, dailySales: [4539.62, 5474.90, 10780.74, 7999.70, 3770.10, 13070.20], totalAchieved: 45635.26, remaining: 11059.74, achievedPercent: 0.8051, dailyAverage: 7605.88, totalAccumulated: 94611.23, accumulatedPercent: 0.8325, status: "Atenção" },
        { name: "Manoel", weeklyGoal: 56695, dailySales: [7849.80, 2099.90, 11619.50, 12084.82, 6989.41, 14032.90], totalAchieved: 54676.33, remaining: 2018.67, achievedPercent: 0.9644, dailyAverage: 9112.72, totalAccumulated: 113799.04, accumulatedPercent: 1.5021, status: "Atenção" },
        { name: "Michele", weeklyGoal: 56695, dailySales: [5044.51, 3984.72, 1909.80, 4489.72, 1989.91, 2939.10], totalAchieved: 20357.76, remaining: 36337.24, achievedPercent: 0.3591, dailyAverage: 3392.96, totalAccumulated: 81712.06, accumulatedPercent: 1.1900, status: "Crítico" },
        { name: "Karol", weeklyGoal: 56695, dailySales: [4329.62, 2099.80, 1859.70, 1469.80, 4489.70, 2009.72], totalAchieved: 16258.34, remaining: 40436.66, achievedPercent: 0.2868, dailyAverage: 2709.72, totalAccumulated: 62268.04, accumulatedPercent: 0.8884, status: "Crítico" },
        { name: "Kaue", weeklyGoal: 56695, dailySales: [2829.51, 2609.72, 4089.90, 2649.71, 4359.60, 1939.80], totalAchieved: 18478.24, remaining: 38216.76, achievedPercent: 0.3260, dailyAverage: 3079.71, totalAccumulated: 69192.79, accumulatedPercent: 1.0434, status: "Crítico" },
        { name: "Julio", weeklyGoal: 56695, dailySales: [8987.62, 1344.61, 14014.91, 6499.80, 7729.71, 10809.82], totalAchieved: 49386.47, remaining: 7308.53, achievedPercent: 0.8711, dailyAverage: 8231.08, totalAccumulated: 99231.54, accumulatedPercent: 1.3037, status: "Atenção" },
        { name: "Alexandre", weeklyGoal: 56695, dailySales: [834.41, 3669.61, 3569.60, 1119.80, 1679.51, 3769.80], totalAchieved: 14642.73, remaining: 42052.27, achievedPercent: 0.2583, dailyAverage: 2440.46, totalAccumulated: 41981.55, accumulatedPercent: 0.5809, status: "Crítico" },
        { name: "Luiz Alberto", weeklyGoal: 73370, dailySales: [2269.82, 8209.60, 5569.40, 3159.70, 3204.60, 11010.90], totalAchieved: 33424.02, remaining: 39945.98, achievedPercent: 0.4556, dailyAverage: 5570.67, totalAccumulated: 56829.77, accumulatedPercent: 0.4899, status: "Crítico" },
        { name: "Fernando", weeklyGoal: 56695, dailySales: [7479.62, 6669.52, 4399.70, 7549.80, 8884.20, 3639.90], totalAchieved: 38622.74, remaining: 18072.26, achievedPercent: 0.6813, dailyAverage: 6437.12, totalAccumulated: 64385.18, accumulatedPercent: 0.7965, status: "Atenção" },
        { name: "João", weeklyGoal: 70035, dailySales: [13969.22, 5659.82, 7169.62, 11009.50, 5279.71, 6569.51], totalAchieved: 49657.38, remaining: 20377.62, achievedPercent: 0.7090, dailyAverage: 8276.23, totalAccumulated: 125482.62, accumulatedPercent: 1.3506, status: "Atenção" },
        { name: "Ledson", weeklyGoal: 56695, dailySales: [2429.70, 1529.90, 2509.82, 539.70, 2139.90, 3910.30], totalAchieved: 13059.32, remaining: 43635.68, achievedPercent: 0.2304, dailyAverage: 2176.55, totalAccumulated: 53468.30, accumulatedPercent: 0.7919, status: "Crítico" }
      ]
    },
    {
      weekNumber: 3, title: "Semana 3 - Metas Março 2026", workingDays: 6,
      dayLabels: ["Sáb", "Seg", "Ter", "Qua", "Qui", "Sex"],
      sellers: [
        { name: "Agnaldo", weeklyGoal: 56695, dailySales: [13610.79, 5034.81, 6279.91, 5154.71, 3429.53, 17093.61], totalAchieved: 50603.36, remaining: 6091.64, achievedPercent: 0.8925, dailyAverage: 8433.89, totalAccumulated: 145214.59, accumulatedPercent: 0.4680, status: "Atenção" },
        { name: "Manoel", weeklyGoal: 56695, dailySales: [5149.81, 7169.62, 14294.71, 7179.60, 6244.42, 23860.62], totalAchieved: 63898.78, remaining: -7203.78, achievedPercent: 1.1271, dailyAverage: 10649.80, totalAccumulated: 177697.81, accumulatedPercent: 0.7209, status: "Acima da Meta" },
        { name: "Michele", weeklyGoal: 56695, dailySales: [2194.40, 7319.52, 4509.60, 3589.80, 819.91, 3909.60], totalAchieved: 22342.83, remaining: 34352.17, achievedPercent: 0.3941, dailyAverage: 3723.81, totalAccumulated: 104054.89, accumulatedPercent: 0.4222, status: "Crítico" },
        { name: "Karol", weeklyGoal: 56695, dailySales: [6809.72, 6094.41, 7989.70, 5779.71, 8264.43, 3934.41], totalAchieved: 38872.38, remaining: 17822.62, achievedPercent: 0.6857, dailyAverage: 6478.73, totalAccumulated: 101140.42, accumulatedPercent: 0.4103, status: "Atenção" },
        { name: "Kaue", weeklyGoal: 56695, dailySales: [8366.31, 159.90, 6714.53, 8412.31, 8668.00, 11350.16], totalAchieved: 43671.21, remaining: 13023.79, achievedPercent: 0.7703, dailyAverage: 7278.54, totalAccumulated: 112863.04, accumulatedPercent: 0.4579, status: "Atenção" },
        { name: "Julio", weeklyGoal: 56695, dailySales: [7775.41, 20945.42, 2211.11, 6815.48, 16490.00, 4262.30], totalAchieved: 58499.72, remaining: -1804.72, achievedPercent: 1.0318, dailyAverage: 9749.95, totalAccumulated: 157731.26, accumulatedPercent: 0.6400, status: "Acima da Meta" },
        { name: "Alexandre", weeklyGoal: 56695, dailySales: [1258.71, 4279.72, 873.71, 3958.50, 6810.00, 3659.40], totalAchieved: 20840.04, remaining: 35854.96, achievedPercent: 0.3676, dailyAverage: 3473.34, totalAccumulated: 62821.59, accumulatedPercent: 0.2549, status: "Crítico" },
        { name: "Luiz Alberto", weeklyGoal: 73370, dailySales: [778.50, 6678.90, 13496.91, 2604.30, 1219.00, 7561.32], totalAchieved: 32338.93, remaining: 41031.07, achievedPercent: 0.4408, dailyAverage: 5389.82, totalAccumulated: 89168.70, accumulatedPercent: 0.2286, status: "Crítico" },
        { name: "Fernando", weeklyGoal: 56695, dailySales: [4342.30, 9206.94, 3635.22, 10967.61, 11714.00, 2407.30], totalAchieved: 42273.37, remaining: 14421.63, achievedPercent: 0.7456, dailyAverage: 7045.56, totalAccumulated: 106658.55, accumulatedPercent: 0.4326, status: "Crítico" },
        { name: "João", weeklyGoal: 70035, dailySales: [12536.08, 28613.56, 11609.77, 6508.81, 12759.00, 12349.24], totalAchieved: 84376.46, remaining: -14341.46, achievedPercent: 1.2048, dailyAverage: 14062.74, totalAccumulated: 209859.08, accumulatedPercent: 0.6765, status: "Acima da Meta" },
        { name: "Ledson", weeklyGoal: 56695, dailySales: [370.90, 3060.00, 5611.31, 4106.10, 5479.00, 17219.71], totalAchieved: 35847.02, remaining: 20847.98, achievedPercent: 0.6323, dailyAverage: 5974.50, totalAccumulated: 89315.32, accumulatedPercent: 0.3622, status: "Crítico" }
      ]
    },
    {
      weekNumber: 4, title: "Semana 4 - Metas Março 2026", workingDays: 8,
      dayLabels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Seg", "Ter"],
      sellers: [
        { name: "Agnaldo", weeklyGoal: 140070, dailySales: [], totalAchieved: 0, remaining: 140070, achievedPercent: 0, dailyAverage: 0, totalAccumulated: 145214.59, accumulatedPercent: 0.4680, status: "Aguardando" },
        { name: "Manoel", weeklyGoal: 113390, dailySales: [], totalAchieved: 0, remaining: 113390, achievedPercent: 0, dailyAverage: 0, totalAccumulated: 177697.81, accumulatedPercent: 0.7209, status: "Aguardando" },
        { name: "Michele", weeklyGoal: 113390, dailySales: [], totalAchieved: 0, remaining: 113390, achievedPercent: 0, dailyAverage: 0, totalAccumulated: 104397.89, accumulatedPercent: 0.4235, status: "Aguardando" },
        { name: "Karol", weeklyGoal: 113390, dailySales: [], totalAchieved: 0, remaining: 113390, achievedPercent: 0, dailyAverage: 0, totalAccumulated: 97140.42, accumulatedPercent: 0.3941, status: "Aguardando" },
        { name: "Kaue", weeklyGoal: 113390, dailySales: [], totalAchieved: 0, remaining: 113390, achievedPercent: 0, dailyAverage: 0, totalAccumulated: 111619.83, accumulatedPercent: 0.4528, status: "Aguardando" },
        { name: "Julio", weeklyGoal: 113390, dailySales: [], totalAchieved: 0, remaining: 113390, achievedPercent: 0, dailyAverage: 0, totalAccumulated: 144395.80, accumulatedPercent: 0.5858, status: "Aguardando" },
        { name: "Alexandre", weeklyGoal: 113390, dailySales: [], totalAchieved: 0, remaining: 113390, achievedPercent: 0, dailyAverage: 0, totalAccumulated: 72027.75, accumulatedPercent: 0.2922, status: "Aguardando" },
        { name: "Luiz Alberto", weeklyGoal: 146740, dailySales: [], totalAchieved: 0, remaining: 146740, achievedPercent: 0, dailyAverage: 0, totalAccumulated: 98971.01, accumulatedPercent: 0.2538, status: "Aguardando" },
        { name: "Fernando", weeklyGoal: 113390, dailySales: [], totalAchieved: 0, remaining: 113390, achievedPercent: 0, dailyAverage: 0, totalAccumulated: 98530.66, accumulatedPercent: 0.3997, status: "Aguardando" },
        { name: "João", weeklyGoal: 140070, dailySales: [], totalAchieved: 0, remaining: 140070, achievedPercent: 0, dailyAverage: 0, totalAccumulated: 200058.54, accumulatedPercent: 0.6447, status: "Aguardando" },
        { name: "Ledson", weeklyGoal: 113390, dailySales: [], totalAchieved: 0, remaining: 113390, achievedPercent: 0, dailyAverage: 0, totalAccumulated: 84817.01, accumulatedPercent: 0.3441, status: "Aguardando" }
      ]
    }
  ];

  const commissions: CommissionEntry[] = [
    { name: "Agnaldo", week1: 975.12, week2: 315.48, week3: 96.47, week4: 0, total: 1387.06, achievedPercent: 0.6147, band: "51-70% -> 1,00%", status: "Atencao" },
    { name: "Manoel", week1: 1687.67, week2: 1254.03, week3: 303.76, week4: 0, total: 3245.45, achievedPercent: 1.0882, band: "100-119% -> 2,50%", status: "Excelente" },
    { name: "Michele", week1: 1885.63, week2: 104.16, week3: 25.95, week4: 0, total: 2015.74, achievedPercent: 0.6753, band: "51-70% -> 1,00%", status: "Atencao" },
    { name: "Karol", week1: 1329.41, week2: 118.14, week3: 40.31, week4: 0, total: 1487.86, achievedPercent: 0.5889, band: "51-70% -> 1,00%", status: "Atencao" },
    { name: "Kaue", week1: 1585.07, week2: 113.30, week3: 42.63, week4: 0, total: 1741.01, achievedPercent: 0.6463, band: "51-70% -> 1,00%", status: "Atencao" },
    { name: "Julio", week1: 1338.86, week2: 1191.07, week3: 143.60, week4: 0, total: 2673.54, achievedPercent: 0.9687, band: "86-99% -> 2,00%", status: "Bom" },
    { name: "Alexandre", week1: 1296.79, week2: 70.68, week3: 27.69, week4: 0, total: 1395.16, achievedPercent: 0.4794, band: "Ate 50% -> 0,50%", status: "Critico" },
    { name: "Luiz Alberto", week1: 680.54, week2: 326.05, week3: 37.29, week4: 0, total: 1043.88, achievedPercent: 0.4839, band: "Ate 50% -> 0,50%", status: "Critico" },
    { name: "Fernando", week1: 748.20, week2: 263.29, week3: 67.75, week4: 0, total: 1079.24, achievedPercent: 0.5900, band: "51-70% -> 1,00%", status: "Atencao" },
    { name: "Joao", week1: 0, week2: 0, week3: 0, week4: 0, total: 0, achievedPercent: 0, band: "--", status: "Critico" },
    { name: "Ledson", week1: 1290.68, week2: 60.47, week3: 17.15, week4: 0, total: 1368.30, achievedPercent: 0.4429, band: "Ate 50% -> 0,50%", status: "Critico" }
  ];

  const overview: MonthOverview = {
    monthlyGoal: 2900000,
    achievedTotal: 1387426.03,
    achievedPercent: 0.4784,
    dailyGoalNeeded: 168063.77,
    projection: 2081139.05,
    projectionPercent: 0.7176,
    daysRemaining: 9,
    daysWorked: 18,
    daysTotal: 27,
    refLastYear: 794840,
    vsLastYearPercent: 0.7455,
    rhythm: "CRÍTICO",
    ticketMedioPU: 1520,
    piecesPerAttendance: 2.53,
    conversionRate: 49
  };

  return { sellers, weeks, weekDetails, commissions, overview, updatedAt: new Date().toISOString(), source: "fallback" };
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
