import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";

const Date_picker = ({ setModalOpen, Submit, ModalOpen }) => {
  console.log("modal open", ModalOpen);
  const formik = useFormik({
    initialValues: {
      StartDate: "",
      EndDate: "",
    },
    validate: (values) => {
      const errors = {};
      const { StartDate, EndDate } = values;

      if (!StartDate && !EndDate) {
        return errors;
      }

      if (StartDate && EndDate) {
        if (EndDate < StartDate) {
          errors.EndDate = "End must be greater than start Date";
        }
      } else {
        errors.StartDate =
          "If selecting one Date, fill both fields with the same Date";
        errors.EndDate =
          "If selecting one Date, fill both fields with the same Date";
      }
      return errors;
    },
    onSubmit: (values) => {
      Submit(values);
      setModalOpen(false);
    },
  });
  return (
    <>
      <Dialog
        open={ModalOpen}
        onClose={() => setModalOpen(false)}
        PaperProps={{
          style: {
            width: "400px",
            height: "300px",
            overflow: "hidden",
          },
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Custom Date</DialogTitle>
          <DialogContent>
            <TextField
              name="StartDate"
              label="Start Date"
              type="date"
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formik.values.StartDate}
              onChange={formik.handleChange}
              fullWidth
              error={
                formik.touched.StartDate && Boolean(formik.errors.StartDate)
              }
              helperText={formik.touched.StartDate && formik.errors.StartDate}
            />
            <TextField
              name="EndDate"
              label="End Date"
              type="date"
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formik.values.EndDate}
              onChange={formik.handleChange}
              fullWidth
              error={formik.touched.EndDate && Boolean(formik.errors.EndDate)}
              helperText={formik.touched.EndDate && formik.errors.EndDate}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary">
              OK
            </Button>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Date_picker;
