// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Dashboard components
import ShowAlbumList from "./components/showAlbumList";
import { Box, Card, CardMedia, Divider, Icon } from "@mui/material";
import { Bar } from "react-chartjs-2";

function album() {

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ShowAlbumList />
      <Footer />
    </DashboardLayout >
  );
}

export default album;
