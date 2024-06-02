// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Box, Typography } from "@mui/material";

export default function Team() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          OUR TEAM
        </Typography>
        <Box mt={1}>
          <Typography variant="h6" marginBottom={3}>
            회사 연혁
          </Typography>
          <img
            // src="/images/bestTeamWork.png"  // 이 부분을 실제 이미지 URL로 교체
            src="/images/company_intro_clear3.png"  // 이 부분을 실제 이미지 URL로 교체
            alt="Team Member"
            style={{ maxWidth: '100%', maxHeight: '600px' }}
          />
        </Box>
      </Box>
      <Footer />
    </DashboardLayout>
  );
}
