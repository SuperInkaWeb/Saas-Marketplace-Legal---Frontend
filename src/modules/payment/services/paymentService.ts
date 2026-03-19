import api from "@/lib/api";
import { PaymentResponse } from "../types";

export const paymentService = {
  getLawyerPayments: async (): Promise<PaymentResponse[]> => {
    const { data } = await api.get("/payments/lawyer");
    return data;
  }
};
