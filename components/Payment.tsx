"use client";
import { useAppContext } from "@/context/appContext";
import { deleteCookie } from "@/lib/cookies-client";
import { fetchData } from "@/lib/fetchData";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  ArrowUpRight,
  Calendar,
  Coins,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { DateToText } from "@/lib/DateToText";
import { WalletIcon } from "./Icons";

interface WalletHistoryEntry {
  id: string;
  point: number;
  paymentamount: number;
  validTo?: string;
  updatedAt: string;
  status: boolean;
}
interface Wallet {
  id: number;
  buyerAmount: number;
  point: number;
  paymentamount: number;
  checkAt: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface WalletHistory {
  history: WalletHistoryEntry[];
}

interface UserType {
  id: number;
  userType: string;
  color: string;
  buyAmount: number;
  ratio: number;
}

interface Type {
  wallet: Wallet;
  userType: UserType;
}

interface Offer {
  type: string;
  ratio: number;
}

interface OffersResponse {
  offers: Offer[];
}

const Payment = ({ session }: { session: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
  const [loadingLogout, setLoadingLogout] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [walletHistoryDialog, setWalletHistoryDialog] =
    useState<boolean>(false);
  const [walletHistory, setWalletHistory] = useState<WalletHistory>({
    history: [],
  });

  const [type, setType] = useState<Type | null>(null);
  const [offers, setOffers] = useState<OffersResponse | null>(null);
  const [srRatio, setSrRatio] = useState<number | null>(null);

  const { token, user } = useAppContext();
  const fetchWallet = async () => {
    try {
      setLoadingFetch(true);
      const type = await fetchData(`/api/user/user-type/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setType(type.data);
      const walletHistory = await fetchData(
        `/api/user/wallet/wallet-history/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWalletHistory(walletHistory.data);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoadingFetch(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      console.log({ session });

      const { data } = await axios.post(
        `/api/payment/${session}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOffers(data);
      console.log(data);
      toast.success(data.message);
      setSuccess(true);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      setLoadingLogout(true);
      deleteCookie("token");
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLogout(false);
    }
  };

  const fetchAboutApp = async () => {
    try {
      const settings = await fetchData("/api/app-data?fields=sr_ratio", {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      setSrRatio(settings.data.appData[0].sr_ratio);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [success]);

  useEffect(() => {
    fetchAboutApp();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-8 w-full px-8 py-4 h-full overflow-x-auto">
        <div className="grid grid-cols-2 gap-5 items-center">
          {loadingFetch && (
            <LoaderIcon className="!size-5 m-auto col-span-full row-span-2" />
          )}
          {!loadingFetch && (
            <>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  className="hover:opacity-80 transition-opacity"
                  onClick={() => setWalletHistoryDialog(true)}
                >
                  <WalletIcon className="size-6 text-primary" />
                </button>
                <h3 className="text-2xl font-bold">{user.fullname}</h3>
              </div>
              <h3 className="text-2xl font-bold text-right">
                {type?.userType.userType}
              </h3>
              {srRatio && type?.wallet.point && (
                <div className="flex col-span-full flex-col gap-2 bg-[#F0F2F5] border rounded-lg p-3 shadow-[0px_4px_10px_-4px_#00000040]">
                  <h3 className="text-xl font-bold">You have total</h3>
                  <div className="flex justify-around gap-2">
                    <span className="text-sm">
                      Points: {type?.wallet.point}
                    </span>
                    <span className="text-sm">
                      SR: {type?.wallet.point / srRatio}
                    </span>
                    <span className="text-sm">
                      Purchase: {type?.wallet.buyerAmount}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {success && offers && (
          <div className="flex col-span-full flex-col gap-2 bg-[#F0F2F5] border rounded-lg p-3 shadow-[0px_4px_10px_-4px_#00000040]">
            <h3 className="text-xl font-bold">Available Offers</h3>
            <ul className="space-y-2 pl-2">
              <li className="grid grid-cols-5 w-full gap-2">
                <span className="font-bold col-span-2">Type</span>
                <span className="font-semibold">Total Points</span>
                <span className="font-semibold">Point back</span>
                <span className="font-semibold">Value SR</span>
              </li>
              {offers?.offers.map((offer) => (
                <li key={offer.type} className="grid grid-cols-5 w-full gap-2">
                  <span className="font-semibold col-span-2">{offer.type}</span>
                  <span>{offer.ratio}%</span>
                  {srRatio && <span>{offer.ratio * srRatio}</span>}
                  <span>{offer.ratio}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-end gap-3">
          {!success && (
            <button
              onClick={handlePayment}
              disabled={loading}
              className="bg-transparent hover:bg-primary w-44 h-10  text-black border-primary border-2 font-semibold rounded-full transition-colors"
            >
              {loading ? <LoaderIcon className="!size-5 m-auto" /> : "Payment"}
            </button>
          )}
          <button
            disabled={loadingLogout}
            className=" bg-primary rounded-full w-44 h-10  text-white font-semibold hover:opacity-80 transition-opacity"
            onClick={logout}
          >
            {loadingLogout ? (
              <LoaderIcon className="!size-5 m-auto" />
            ) : (
              "logout"
            )}
          </button>
        </div>
      </div>

      <Dialog open={walletHistoryDialog} onOpenChange={setWalletHistoryDialog}>
        <DialogContent className="h-[80dvh] flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="text-center">Wallet History</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <ul className="space-y-4  overflow-y-auto ">
            {!walletHistory.history.length && (
              <li key={walletHistory.history.length}>noHistory</li>
            )}
            {walletHistory.history.map((entry) => (
              <li
                key={entry.id}
                className="flex items-start space-x-4 border p-4 rounded-lg shadow-md"
              >
                <div>
                  <CreditCard className="text-blue-500 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    transactionID: {entry.id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <Coins className="inline w-4 h-4 mr-1 text-yellow-500" />{" "}
                    totalPoints: {entry.point}
                  </p>
                  <p className="text-sm text-gray-600">
                    <ArrowUpRight className="inline w-4 h-4 mr-1 text-green-500" />{" "}
                    totalPayment: ${entry.paymentamount}
                  </p>
                  <p className="text-sm text-gray-600">
                    <Calendar className="inline w-4 h-4 mr-1 text-purple-500" />
                    validTo: {DateToText(entry.validTo ?? "")}
                  </p>
                  <p className="text-sm text-gray-600">
                    <RefreshCw className="inline w-4 h-4 mr-1 text-indigo-500" />{" "}
                    updatedAt: {DateToText(entry.updatedAt)}
                  </p>
                  <p
                    className={`text-sm font-medium mt-2 ${
                      entry.status ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    status: {entry.status ? "active" : "inactive"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Payment;
