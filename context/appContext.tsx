"use client";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";

const ProviderContext = createContext<{
  user: any;
  session: any;
  loading: boolean;
  token: string;
}>({ user: null, session: {}, loading: true, token: "" });
axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL11 as string;
axios.defaults.withCredentials = true;

const ProvdierApp = ({
  children,
  user,
  token,
}: {
  children: ReactNode;
  user: string;
  token: string;
}) => {
  const [session, setSession] = useState({} as any);
  const params = useParams();
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `/api/order-session/${params.sessionId}`
      );
      setSession(data?.session);
    } catch (error) {
      console.error(error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);
  return (
    <ProviderContext.Provider value={{ user, session, loading, token }}>
      {children}
    </ProviderContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(ProviderContext);
};
export default ProvdierApp;
