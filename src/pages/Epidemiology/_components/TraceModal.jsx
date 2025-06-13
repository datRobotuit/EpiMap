import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function TraceModal({ open, onClose, traceData }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Truy vết bệnh nhân</DialogTitle>
      <DialogContent>
        {traceData ? (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Mã bệnh nhân: <b>{traceData.patientId}</b>
            </Typography>
            {traceData.visitedLocations.map((loc, idx) => (
              <div key={idx} style={{ marginBottom: 24 }}>
                <Typography variant="h6" color="primary">
                  {loc.location} <span style={{ color: '#888', fontWeight: 400, fontSize: 14 }}>({new Date(loc.time).toLocaleString('vi-VN')})</span>
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Họ tên</TableCell>
                      <TableCell>Giới tính</TableCell>
                      <TableCell>Năm sinh</TableCell>
                      <TableCell>Điện thoại</TableCell>
                      <TableCell>Địa chỉ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loc.people.map((p) => (
                      <TableRow key={p._id}>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>{p.gender}</TableCell>
                        <TableCell>{p.dob ? new Date(p.dob).getFullYear() : ''}</TableCell>
                        <TableCell>{p.phone}</TableCell>
                        <TableCell>{p.address}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </>
        ) : (
          <Typography color="textSecondary">Không có dữ liệu truy vết.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
