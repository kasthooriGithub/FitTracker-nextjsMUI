"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onCancel,
  onConfirm,
}) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 900 }}>{title}</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} variant="outlined" sx={{ borderRadius: 3 }}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="contained" sx={{ borderRadius: 3, fontWeight: 900,bgcolor: "error.main", "&:hover": { bgcolor: "error.dark" }   }}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
