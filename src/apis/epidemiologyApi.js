import EpidemiologyEndpoints from "../services/endpoints/epidemiology.endpoints";
import { api } from "~/services/api";

class EpidemiologyApi {
  async getPatients(params) {
    try {
      const res = await api.get(EpidemiologyEndpoints.getPatients, { params });
      return res.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra khi lấy danh sách bệnh nhân.");
    }
  }

  async addPatient(patientData) {
    try {
      const res = await api.post(EpidemiologyEndpoints.addPatient, patientData);
      return res.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra khi thêm bệnh nhân.");
    }
  }

  async deletePatientsByIds(ids) {
    try {
      const res = await api.post(EpidemiologyEndpoints.deletePatientsByIds, {
        ids,
      });
      return res.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra khi xóa bệnh nhân.");
    }
  }

  async updatePatient(patientId, patientData) {
    try {
      const res = await api.put(
        `${EpidemiologyEndpoints.updatePatient}?patientId=${patientId}`,
        patientData
      );
      return res.data;
    } catch (error) {
      throw new Error("Có lỗi xảy ra khi cập nhật bệnh nhân.");
    }
  }
}

export default new EpidemiologyApi();
