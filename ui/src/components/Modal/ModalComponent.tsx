import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { SxProps } from "@mui/system";

interface ModalComponentProps {
  buttonType: "text" | "icon";
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  modalTitle: string;
  modalDescription: string;
  buttonStyle?: SxProps;
  modalStyle?: SxProps;
}

const defaultModalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ModalComponent: React.FC<ModalComponentProps> = ({
  buttonType,
  buttonLabel = "Open Modal",
  buttonIcon,
  modalTitle,
  modalDescription,
  buttonStyle,
  modalStyle,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {buttonType === "text" ? (
        <Button onClick={handleOpen} sx={buttonStyle}>
          {buttonLabel}
        </Button>
      ) : (
        <IconButton onClick={handleOpen} sx={buttonStyle}>
          {buttonIcon}
        </IconButton>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="generic-modal-title"
        aria-describedby="generic-modal-description"
      >
        <Box sx={{ ...defaultModalStyle, ...modalStyle }}>
          <Typography id="generic-modal-title" variant="h6" component="h2">
            {modalTitle}
          </Typography>
          <Typography id="generic-modal-description" sx={{ mt: 2 }}>
            {modalDescription}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalComponent;
