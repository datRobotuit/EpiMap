// Vietnam provinces sample epidemic data
export const provincesData = [
    { province: "Hà Nội", cases: 1250, recovered: 980, deaths: 12, active: 258 },
    { province: "TP.HCM", cases: 1500, recovered: 1100, deaths: 18, active: 382 },
    { province: "Đà Nẵng", cases: 650, recovered: 520, deaths: 8, active: 122 },
    { province: "Cần Thơ", cases: 430, recovered: 360, deaths: 5, active: 65 },
    { province: "Hải Phòng", cases: 380, recovered: 310, deaths: 4, active: 66 },
    { province: "Hà Tĩnh", cases: 220, recovered: 180, deaths: 2, active: 38 },
    { province: "Nghệ An", cases: 290, recovered: 240, deaths: 3, active: 47 },
    { province: "Thanh Hóa", cases: 310, recovered: 250, deaths: 3, active: 57 },
];

// National summary statistics
export const nationalStats = {
    totalCases: 8950,
    activeCases: 1420,
    recovered: 7350,
    deaths: 180,
    vaccinated: {
        firstDose: 68000000,
        secondDose: 65000000,
        booster: 35000000,
    }
};

// Time series data for daily cases
export const dailyCases = [
    { date: "2025-05-01", cases: 120 },
    { date: "2025-05-02", cases: 145 },
    { date: "2025-05-03", cases: 132 },
    { date: "2025-05-04", cases: 165 },
    { date: "2025-05-05", cases: 189 },
    { date: "2025-05-06", cases: 201 },
    { date: "2025-05-07", cases: 178 },
    { date: "2025-05-08", cases: 156 },
    { date: "2025-05-09", cases: 143 },
    { date: "2025-05-10", cases: 167 },
    { date: "2025-05-11", cases: 198 },
    { date: "2025-05-12", cases: 210 },
    { date: "2025-05-13", cases: 187 },
    { date: "2025-05-14", cases: 164 },
];

// Demographic breakdown
export const demographics = {
    age: {
        "0-18": 850,
        "19-35": 2450,
        "36-50": 2350,
        "51-65": 1980,
        "65+": 1320
    },
    gender: {
        male: 4800,
        female: 4150
    }
};