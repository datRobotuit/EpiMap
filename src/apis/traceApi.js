import axios from "axios";
import { api } from "~/services/api";
export const getTraceByPatientId = async (patientId) => {
  const res = await api.get(`http://localhost:3000/admin/trace/${patientId}`);
  return res.data;
};
