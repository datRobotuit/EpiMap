import {
  Modal,
  Box,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

const genderOptions = [
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nữ" },
  { label: "Không xác định", value: "Không xác định" },
];

const statusOptions = [
  { label: "Đang điều trị", value: "Đang điều trị" },
  { label: "Khỏi", value: "Khỏi" },
  { label: "Tử vong", value: "Tử vong" },
];

export default function UpdatePatientModal({
  isOpen,
  onClose,
  onSuccess,
  onSubmit,
  initialData = {},
}) {
  const [form, setForm] = useState({
    Patient: "",
    Age: "",
    Gender: "",
    Province: "",
    Status: "",
    National: "",
    Type: "",
    Date: "",
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        Patient: initialData.Patient || "",
        Age: initialData.Age || "",
        Gender: initialData.Gender || "",
        Province: initialData.Province || "",
        Status: initialData.Status || "",
        National: initialData.National || "",
        Type: initialData.Type || "",
        Date: initialData.Date ? initialData.Date.slice(0, 10) : "",
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Chỉ gửi các trường đã thay đổi
  const getChangedFields = () => {
    const changed = {};
    Object.keys(form).forEach((key) => {
      if (form[key] !== (initialData[key] ?? (key === "Age" ? "" : ""))) {
        changed[key] =
          key === "Age" && form[key] !== "" ? Number(form[key]) : form[key];
      }
    });
    return changed;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const changedFields = getChangedFields();
      await onSubmit(changedFields);
      alert("Cập nhật bệnh nhân thành công!");
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      alert(error?.message || "Có lỗi khi cập nhật.");
    }
    setLoading(false);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className="max-w-[500px] p-2 bg-white rounded-lg shadow-lg mx-auto mt-3">
        <div className="flex flex-col gap-3">
          <div className="text-center text-3xl font-bold leading-loose">
            Cập nhật bệnh nhân
          </div>
          <TextField
            label="Họ tên"
            value={form.Patient}
            onChange={(e) => handleChange("Patient", e.target.value)}
            placeholder="Nhập họ tên"
            fullWidth
          />
          <TextField
            label="Tuổi"
            value={form.Age}
            onChange={(e) => handleChange("Age", e.target.value)}
            placeholder="Nhập tuổi"
            type="number"
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="gender-label">Giới tính</InputLabel>
            <Select
              labelId="gender-label"
              value={form.Gender}
              label="Giới tính"
              onChange={(e) => handleChange("Gender", e.target.value)}
              placeholder="Chọn giới tính"
            >
              {genderOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Tỉnh/TP"
            value={form.Province}
            onChange={(e) => handleChange("Province", e.target.value)}
            placeholder="Nhập tỉnh/thành phố"
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="status-label">Trạng thái</InputLabel>
            <Select
              labelId="status-label"
              value={form.Status}
              label="Trạng thái"
              onChange={(e) => handleChange("Status", e.target.value)}
              placeholder="Chọn trạng thái"
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Quốc tịch"
            value={form.National}
            onChange={(e) => handleChange("National", e.target.value)}
            placeholder="Nhập quốc tịch"
            fullWidth
          />
          <TextField
            label="Loại bệnh"
            value={form.Type}
            onChange={(e) => handleChange("Type", e.target.value)}
            placeholder="Nhập loại bệnh"
            fullWidth
          />
          <TextField
            label="Ngày phát hiện"
            value={form.Date}
            onChange={(e) => handleChange("Date", e.target.value)}
            placeholder="YYYY-MM-DD"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <div className="flex justify-end space-x-2 mt-2">
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              Lưu
            </Button>
            <Button variant="outlined" onClick={onClose} disabled={loading}>
              Hủy
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
