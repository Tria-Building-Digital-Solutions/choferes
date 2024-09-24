import { useWeeklySummaries } from "./useWeeklySummary";
import { useBiweeklySummaries } from "./useBiweeklySummary";
import { useMonthlySummaries } from "./useMonthlySummary";

export const useSummaries = () => {
  const {
    weeklySummaries,
    fetchWeeklySummaries,
    handleAddWeeklySummary,
    handleUpdateWeeklySummary,
    handleDeleteWeeklySummary,
    totalWeeklyHours,
  } = useWeeklySummaries();

  const {
    biweeklySummaries,
    fetchBiweeklySummaries,
    handleAddBiweeklySummary,
    handleUpdateBiweeklySummary,
    handleDeleteBiweeklySummary,
    totalBiweeklyHours,
  } = useBiweeklySummaries();

  const {
    monthlySummaries,
    fetchMonthlySummaries,
    handleAddMonthlySummary,
    handleUpdateMonthlySummary,
    handleDeleteMonthlySummary,
    totalMonthlyHours,
  } = useMonthlySummaries();

  const handleSummaryChange = async (
    period: "weekly" | "biweekly" | "monthly",
    data: any
  ) => {
    if (period === "weekly") {
      await handleAddWeeklySummary(data);
    } else if (period === "biweekly") {
      await handleAddBiweeklySummary(data);
    } else if (period === "monthly") {
      await handleAddMonthlySummary(data);
    }
  };

  const handleSummaryUpdate = async (
    period: "weekly" | "biweekly" | "monthly",
    id: number,
    data: any
  ) => {
    if (period === "weekly") {
      await handleUpdateWeeklySummary(id, data);
    } else if (period === "biweekly") {
      await handleUpdateBiweeklySummary(id, data);
    } else if (period === "monthly") {
      await handleUpdateMonthlySummary(id, data);
    }
  };

  const handleSummaryDelete = async (
    period: "weekly" | "biweekly" | "monthly",
    id: number
  ) => {
    if (period === "weekly") {
      await handleDeleteWeeklySummary(id);
    } else if (period === "biweekly") {
      await handleDeleteBiweeklySummary(id);
    } else if (period === "monthly") {
      await handleDeleteMonthlySummary(id);
    }
  };

  return {
    weeklySummaries,
    biweeklySummaries,
    monthlySummaries,
    totalWeeklyHours,
    totalBiweeklyHours,
    totalMonthlyHours,
    fetchWeeklySummaries,
    fetchBiweeklySummaries,
    fetchMonthlySummaries,
    handleSummaryChange,
    handleSummaryUpdate,
    handleSummaryDelete
  };
};
