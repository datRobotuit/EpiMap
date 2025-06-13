import epidemiologyApi from "../../apis/epidemiologyApi";
import { getTraceByPatientId } from "../../apis/traceApi";
import AddPatientModal from "./_components/AddPatientModal";
import TraceModal from "./_components/TraceModal";
import UpdatePatientModal from "./_components/UpdatePatientModal";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Input,
  Checkbox,
  Pagination,
  MenuItem,
  Select,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const columns = [
  { id: "Patient", label: "Họ tên", minWidth: 120 },
  { id: "Age", label: "Tuổi", minWidth: 60 },
  { id: "Gender", label: "Giới tính", minWidth: 80 },
  { id: "Province", label: "Tỉnh/TP", minWidth: 100 },
  { id: "Status", label: "Trạng thái", minWidth: 100 },
  { id: "Type", label: "Loại bệnh", minWidth: 100 },
  { id: "Date", label: "Ngày phát hiện", minWidth: 120 },
];

const caseTypes = [
  { value: "all", label: "Tất cả" },
  { value: "Đang điều trị", label: "Đang điều trị" },
  { value: "Khỏi", label: "Khỏi" },
  { value: "Tử vong", label: "Tử vong" },
];

const statusColor = {
  "Đang điều trị": "bg-orange-100 text-orange-700",
  Khỏi: "bg-green-100 text-green-700",
  "Tử vong": "bg-red-100 text-red-700",
};

export default function Epidemiology() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [caseType, setCaseType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [traceModalOpen, setTraceModalOpen] = useState(false);
  const [traceData, setTraceData] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Lấy danh sách bệnh nhân
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        searchValue: search || undefined,
        medicalCondition: caseType !== "all" ? caseType : undefined,
      };
      const res = await epidemiologyApi.getPatients(params);
      setPatients(res.data);
      setTotalPages(res.totalPages);
      console.log("Fetched patients:", res.data);
    } catch (err) {
      setPatients([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, [page, search, caseType]);

  // Thêm bệnh nhân mới
  const handleAddPatient = async (patientData) => {
    setLoading(true);
    try {
      await epidemiologyApi.addPatient(patientData);
      fetchPatients();
      setIsAddModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  // Xóa các bệnh nhân đã chọn
  const handleDeletePatients = async (ids) => {
    const deleteIds = ids || selectedRows;
    if (deleteIds.length === 0) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa các bệnh nhân đã chọn?"))
      return;
    setLoading(true);
    try {
      await epidemiologyApi.deletePatientsByIds(deleteIds);
      setSelectedRows([]);
      fetchPatients();
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  // Cập nhật thông tin bệnh nhân
  const handleUpdatePatient = async (patientId, patientData) => {
    setLoading(true);
    try {
      await epidemiologyApi.updatePatient(patientId, patientData);
      fetchPatients();
      setEditingPatient(null);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(patients.map((row) => row._id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Truy vết bệnh nhân đầu tiên trong danh sách (hoặc bạn có thể chọn theo selectedRows)
  const handleTrace = async () => {
    if (!patients.length) return;
    setLoading(true);
    try {
      const patientId = selectedRows[0];
      const data = await getTraceByPatientId(patientId);
      setTraceData(data);
      setTraceModalOpen(true);
    } catch (err) {
      alert("Không thể lấy dữ liệu truy vết!");
    }
    setLoading(false);
  };

  // Hàm xử lý khi click vào header để sort
  const handleSort = (colId) => {
    setSortConfig((prev) => {
      if (prev.key === colId) {
        // Đảo chiều sort nếu click lại cùng 1 cột
        return {
          key: colId,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key: colId, direction: "asc" };
    });
  };

  // Sort dữ liệu trước khi render
  const sortedPatients = React.useMemo(() => {
    if (!sortConfig.key) return patients;
    const sorted = [...patients].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Nếu là ngày thì convert về Date
      if (sortConfig.key === "Date") {
        aValue = aValue ? new Date(aValue) : 0;
        bValue = bValue ? new Date(bValue) : 0;
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      // Nếu là Họ tên thì sort theo số
      if (sortConfig.key === "Patient") {
        const getNumber = (val) => {
          if (!val) return 0;
          const match = val.match(/^BN(\d+)$/i);
          return match ? parseInt(match[1], 10) : 0;
        };
        aValue = getNumber(aValue);
        bValue = getNumber(bValue);
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      // Nếu là số
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }
      // So sánh string
      return sortConfig.direction === "asc"
        ? String(aValue || "").localeCompare(String(bValue || ""))
        : String(bValue || "").localeCompare(String(aValue || ""));
    });
    return sorted;
  }, [patients, sortConfig]);

  // Hàm xuất Excel
  const handleExportExcel = () => {
    const exportData = sortedPatients.map((row) => [
      row.Patient,
      row.Age,
      row.Gender,
      row.Province,
      row.Status,
      row.Type,
      row.Date ? new Date(row.Date).toLocaleDateString("vi-VN") : "",
    ]);

    const header = [
      "Họ tên",
      "Tuổi",
      "Giới tính",
      "Tỉnh/TP",
      "Trạng thái",
      "Loại bệnh",
      "Ngày phát hiện",
    ];

    // Tạo worksheet và thêm header + data
    const worksheet = XLSX.utils.aoa_to_sheet([header, ...exportData]);

    // Định dạng độ rộng cột
    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 8 },
      { wch: 10 },
      { wch: 16 },
      { wch: 14 },
      { wch: 14 },
      { wch: 16 },
    ];

    // Freeze dòng tiêu đề
    worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

    // Tạo workbook và xuất file
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách bệnh nhân");

    // Ghi file với style
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(file, "danh_sach_benh_nhan.xlsx");
  };

  return (
    <div className="w-[1200px] h-screen mx-auto px-0 flex flex-col gap-6 py-5 font-text">
      {/* Header */}
      <div className="w-full flex flex-row justify-between items-center gap-2 mb-1">
        <div className="flex gap-2 items-center w-[700px]">
          <Select
            value={caseType}
            onChange={(e) => setCaseType(e.target.value)}
            variant="outlined"
            size="small"
            className="bg-neutral-100 rounded-lg"
            sx={{
              minWidth: 140,
              fontSize: 13,
              background: "#f3f4f6",
              borderRadius: "8px",
            }}
            displayEmpty
          >
            {caseTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
          <div className="flex-1 px-2 py-1 rounded-lg border border-neutral-300 flex items-center gap-2 bg-white shadow-sm">
            <SearchIcon
              className="w-4 h-4 text-neutral-400"
              fontSize="medium"
            />
            <Input
              disableUnderline
              className="flex-1 text-xs font-medium text-neutral-700 bg-transparent"
              placeholder="Tìm kiếm theo họ tên..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            className={`rounded-lg text-xs font-bold py-2 px-6 mr-2 shadow-lg transition-transform border-blue-500 ${
              selectedRows.length !== 1
                ? "bg-gray-200 text-gray-400"
                : "text-blue-700"
            }`}
            style={{
              marginRight: 8,
              background: selectedRows.length !== 1 ? "#f3f4f6" : "#e0f2fe",
            }}
            disabled={selectedRows.length !== 1}
            onClick={handleTrace}
          >
            Truy vết
          </Button>
          <Button
            variant="contained"
            className="bg-primary-gradient rounded-lg text-xs font-bold py-2 px-6 shadow-lg transition-transform"
            startIcon={<AddIcon className="text-white" fontSize="small" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Thêm ca mới
          </Button>
          <Button
            variant="outlined"
            className="rounded-lg text-xs font-bold py-2 px-6 shadow-lg transition-transform border-green-500 text-green-700"
            onClick={handleExportExcel}
          >
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full bg-white rounded-xl shadow-lg border border-zinc-200 overflow-x-auto min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <CircularProgress />
          </div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-t border-zinc-200">
                <th
                  className="px-2 py-2 text-left"
                  style={{
                    position: "sticky",
                    top: 0,
                    background: "#f3f4f6",
                    zIndex: 2,
                  }}
                >
                  <Checkbox
                    checked={
                      patients.length > 0 &&
                      selectedRows.length === patients.length
                    }
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < patients.length
                    }
                    onChange={handleSelectAll}
                    size="small"
                    sx={{ p: 0.5 }}
                  />
                </th>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className="px-2 py-2 text-left text-sm font-semibold text-blue-700 select-none"
                    style={{
                      minWidth: col.minWidth,
                      position: "sticky",
                      top: 0,
                      background: "#f3f4f6",
                      zIndex: 2,
                      cursor: col.id === "Status" ? "default" : "pointer",
                    }}
                    // Bỏ sort ở cột "Status"
                    {...(col.id !== "Status" && {
                      onClick: () => handleSort(col.id),
                    })}
                  >
                    {col.label}
                    {/* Bỏ icon sort ở cột "Status" */}
                    <span
                      style={{
                        display: "inline-block",
                        width: 24,
                        verticalAlign: "middle",
                      }}
                    >
                      {sortConfig.key === col.id && col.id !== "Status" ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowDropUpIcon
                            fontSize="medium"
                            style={{ fontSize: 20 }}
                          />
                        ) : (
                          <ArrowDropDownIcon
                            fontSize="medium"
                            style={{ fontSize: 20 }}
                          />
                        )
                      ) : null}
                    </span>
                  </th>
                ))}
                <th
                  className="px-2 py-2"
                  style={{
                    position: "sticky",
                    top: 0,
                    background: "#f3f4f6",
                    zIndex: 2,
                  }}
                ></th>
              </tr>
            </thead>
            <tbody>
              {sortedPatients.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    className="py-6 text-center text-gray-400"
                  >
                    Không có dữ liệu phù hợp.
                  </td>
                </tr>
              ) : (
                sortedPatients.map((row, idx) => (
                  <tr
                    key={row._id}
                    className={`border-t border-zinc-100 transition-colors duration-150 ${
                      selectedRows.includes(row._id)
                        ? "bg-blue-50"
                        : idx % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    } hover:bg-blue-100`}
                  >
                    <td className="px-2 py-2">
                      <Checkbox
                        checked={selectedRows.includes(row._id)}
                        onChange={() => handleSelectRow(row._id)}
                        size="small"
                        sx={{ p: 0.5 }}
                      />
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={`px-2 py-2 text-xs font-normal text-gray-800 ${
                          col.id === "Status" ? "font-semibold" : ""
                        }`}
                      >
                        {col.id === "Status" ? (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                              statusColor[row.Status] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {row.Status}
                          </span>
                        ) : col.id === "Date" && row.Date ? (
                          new Date(row.Date).toLocaleDateString("vi-VN")
                        ) : (
                          row[col.id]
                        )}
                      </td>
                    ))}
                    <td className="px-2 py-2 text-right whitespace-nowrap">
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          color="primary"
                          className="hover:bg-blue-100"
                          onClick={() => setEditingPatient(row)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          color="error"
                          className="hover:bg-red-100"
                          onClick={() => handleDeletePatients([row._id])}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer actions & Pagination */}
      <div className="w-full flex flex-row justify-between items-center gap-2 mt-1">
        <Button
          variant="contained"
          color="error"
          className={`rounded-lg text-xs font-bold py-2 px-6 shadow transition-all ${
            selectedRows.length === 0
              ? "bg-gray-200 text-gray-400"
              : "hover:scale-105"
          }`}
          disabled={selectedRows.length === 0}
          startIcon={<DeleteIcon className="text-white" fontSize="small" />}
          onClick={() => handleDeletePatients()}
        >
          Xóa
        </Button>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          shape="rounded"
          size="medium"
          siblingCount={1}
          boundaryCount={1}
          className="flex gap-2"
        />
      </div>

      {/* Modal truy vết */}
      <TraceModal
        open={traceModalOpen}
        onClose={() => setTraceModalOpen(false)}
        traceData={traceData}
      />
      {/* Modal thêm bệnh nhân */}
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchPatients}
        onSubmit={handleAddPatient}
      />

      {/* Modal chỉnh sửa bệnh nhân */}
      {editingPatient && (
        <UpdatePatientModal
          isOpen={!!editingPatient}
          onClose={() => setEditingPatient(null)}
          onSuccess={fetchPatients}
          onSubmit={(data) => handleUpdatePatient(editingPatient._id, data)}
          initialData={editingPatient}
        />
      )}
    </div>
  );
}
