import salaryGradesData from './assets/salary-grades.json';

export function calculateSalaryRangeFromGrade(salaryGrade: string): { from: number; to: number } | undefined {
    // Normalize by removing leading zeros
    salaryGrade = String(parseInt(salaryGrade, 10));
    const gradeInfo = salaryGradesData.find((gradeData) => gradeData.grade.toString() === salaryGrade);
    // { "grade": 1, "hiringRate": 27574, "jobRate": 35574, "advanceAmount": 1145, "jobRateAdvance": 1130 }
    if (gradeInfo) {
        return {
            from: gradeInfo.hiringRate,
            to: gradeInfo.jobRate
        };
    }
}
