import { borderColor } from "@mui/system";

const GridStyle = {
  height: 400,
  width: "100%",
  border: 1,
  borderColor: "primary.main",
  "& .gridHeader--header": {
    backgroundColor: "secondary.main",
  },
  "& .MuiDataGrid-columnSeparator": {
    color: "primary.main",
    borderColor: "primary.main",
    borderRightWidth: 5,
  },
};

export default GridStyle;
