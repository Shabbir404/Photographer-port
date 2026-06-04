import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useWorks() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from("works")
        .select("*")
        .order("created_at", { ascending: false });

      if (sbError) throw sbError;
      setWorks(data || []);
    } catch (err) {
      setError(err.message);
      setWorks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  return { works, loading, error, refetch: fetchWorks };
}
