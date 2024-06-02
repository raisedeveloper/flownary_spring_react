import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import {
  Avatar, Box, Button, Chip, Divider, List, ListItem, ListItemAvatar,
  ListItemText, Modal, Paper, Stack, TextField, Typography, InputAdornment,
  IconButton, Link,
  CardContent,
  Icon,
} from "@mui/material";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SubjectIcon from '@mui/icons-material/Subject';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import SettingsIcon from '@mui/icons-material/Settings';
import BookmarkIcon from '@mui/icons-material/Bookmark';

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import NotificationItem from "examples/Items/NotificationItem";

export default function Notifications() {

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box m={3}>
        <Card sx={{ height: "100%",  boxShadow: 'none', backgroundColor:'beige'  }}>
          <Box mx={3} mt={3}>
            <MDTypography variant="h6" fontWeight="medium">
              패밀리 알림
            </MDTypography>
            <CardContent sx={{ fontSize: 'large', fontWeight: 'bolder' }}>
              <NotificationItem icon={<Icon>send_outlined</Icon>} title="새로운 메시지가 있습니다" />
              <NotificationItem icon={<Icon>diversity_1</Icon>} title="새로운 패밀리를 찾아보세요" />
              <NotificationItem icon={<Icon>history_edu</Icon>} title="패밀리User의 새로운 게시물이 있습니다" />
            </CardContent>
          </Box>
        </Card>
      </Box>
      <Box m={3}>
        <Card sx={{ height: "100%",  boxShadow: 'none', backgroundColor:'beige'  }}>
          <Box mx={3} mt={3}>
            <MDTypography variant="h6" fontWeight="medium">
              할 일 / 일정
            </MDTypography>
            <CardContent sx={{ fontSize: 'large', fontWeight: 'bolder' }}>
              <NotificationItem icon={<Icon>playlist_add_check</Icon>} title="오늘의 할 일이 있습니다" />
              <NotificationItem icon={<Icon>event_available</Icon>} title="오늘의 일정이 있습니다" />
            </CardContent>
          </Box>
        </Card>
      </Box>
      <Box m={3}>
        <Card sx={{ height: "100%",  boxShadow: 'none', backgroundColor:'beige'  }}>
          <Box mx={3} mt={3}>
            <MDTypography variant="h6" fontWeight="medium">
              댓글 / 좋아요
            </MDTypography>
            <CardContent sx={{ fontSize: 'large', fontWeight: 'bolder' }}>
              <NotificationItem icon={<Icon>reply_all</Icon>} title="새로운 댓글이 있습니다" />
              <NotificationItem icon={<Icon>favorite</Icon>} title="User가 좋아요를 눌렀습니다" />
            </CardContent>
          </Box>
        </Card>
      </Box>
      <Box m={3}>
        <Card sx={{ height: "100%",  boxShadow: 'none', backgroundColor:'beige'  }}>
          <Box mx={3} mt={3}>
            <MDTypography variant="h6" fontWeight="medium">
              보안 알림
            </MDTypography>
            <CardContent sx={{ fontSize: 'large', fontWeight: 'bolder' }}>
              <NotificationItem icon={<Icon color='warning'>warning</Icon>} title="보안상의 문제가 있습니다" />
            </CardContent>
          </Box>
        </Card>
      </Box>



    </DashboardLayout>
  );
}