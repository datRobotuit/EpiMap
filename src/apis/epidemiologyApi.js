import EpidemiologyEndpoints from "../services/endpoints/epidemiology.endpoints";
import { api } from "~/services/api";

class EpidemiologyApi {
  async getPatients(params) {
    try {
      const res = await api.get(EpidemiologyEndpoints.getPatients, { params });
      return {
        data: res.data.data,
        totalPages: res.data.totalPages,
        totalRecords: res.data.totalRecords,
        currentPage: res.data.currentPage,
      };
    } catch (error) {
      throw new Error(
        error?.response?.data?.msg ||
          "Có lỗi xảy ra khi lấy danh sách bệnh nhân."
      );
    }
  }

  async addPatient(patientData) {
    try {
      const res = await api.post(EpidemiologyEndpoints.addPatient, patientData);
      return res.data.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.msg || "Có lỗi xảy ra khi thêm bệnh nhân."
      );
    }
  }

  async deletePatientsByIds(ids) {
    try {
      const res = await api.post(EpidemiologyEndpoints.deletePatientsByIds, {
        ids,
      });
      return res.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.msg || "Có lỗi xảy ra khi xóa bệnh nhân."
      );
    }
  }

  async updatePatient(patientId, patientData) {
    try {
      const res = await api.patch(
        `${EpidemiologyEndpoints.updatePatient}?patientId=${patientId}`,
        patientData
      );
      return res.data.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.msg || "Có lỗi xảy ra khi cập nhật bệnh nhân."
      );
    }
  }
}

export default new EpidemiologyApi();
