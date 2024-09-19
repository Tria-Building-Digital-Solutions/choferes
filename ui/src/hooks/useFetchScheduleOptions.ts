import { useEffect, useState } from "react";
import api from "../services/api";
import { Schedule } from "../models/Schedule";

const useFetchScheduleOptions = () => {
  const [options, setOptions] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await api.get("/schedules");
        setOptions(response.data);
      } catch (err) {
        setError("Error fetching options");
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  return { options, loading, error };
};

export default useFetchScheduleOptions;
