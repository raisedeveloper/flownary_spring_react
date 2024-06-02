import React, { useContext, useState } from "react";
import {
  Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography, TextField, Card,
  CardContent, CardHeader, IconButton, Dialog, Box, Button,
  Grid,
  Stack,
  Modal
} from "@mui/material";
import { Search } from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import CloseIcon from '@mui/icons-material/Close';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UserList from "./UserList";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "api/LocalStorage";
import { getFamilyList } from "api/axiosGet";
import { insertFamily } from "api/axiosPost";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "api/emptyCheck";

const familyData = [
  {
    avatar: "/static/images/avatar/1.jpg",
    primary: "등산모임",
    secondary: "같이 등산하실래요?",
    name: "nick"
  },
  {
    avatar: "/static/images/avatar/2.jpg",
    primary: "Summer BBQ",
    secondary: "Wish I could come, but I'm out of town this…",
    name: "Travis Howard",
    secondaryTo: "to Scott, Alex, Jennifer"
  },
  {
    avatar: "/static/images/avatar/3.jpg",
    primary: "Oui Oui",
    secondary: "Do you have Paris recommendations? Have you ever…",
    name: "Sandra Adams"
  }
];


export default function Family() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [newname, setNewname] = useState('');
  const [open, setOpen] = useState(false);
  const [modalopen, setModalopen] = useState(false);

  const [faid, setFaid] = useState(-1);
  const { activeUser } = useContext(UserContext);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  if (activeUser.uid === -1) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Typography>
          유저 정보 없음
        </Typography>
      </DashboardLayout>
    )
  }

  const { data: familylist, isLoading, isError } = useQuery({
    queryKey: ['familylist', activeUser.uid],
    queryFn: () => getFamilyList(activeUser.uid),
  })

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Typography>
          로딩 중...
        </Typography>
      </DashboardLayout>
    )
  }
  const filteredFamilyData = !isEmpty(familylist) ? familylist.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleOpen = (faid) => {
    setOpen(true);
    setFaid(faid);
  }

  const handleNew = () => {
    setModalopen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setFaid(-1);
  };

  const handleModalClose = () => {
    setModalopen(false);
  }

  // 클릭 시 마이페이지 이동 이벤트
  const handleMyPage = (uid) => {
    navigate("/mypage", {state: {uid: uid}}); // state를 통해 navigate 위치에 파라메터 제공
  }

  const makeNewFamily = async () => {

    const result = await insertFamily(newname, activeUser.uid, activeUser.nickname);

    if (result == -1)
      alert('이미 패밀리장인 패밀리가 있습니다');
    else {
      alert('패밀리 생성 성공');
      setOpen(true);
      setFaid(result);
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Typography variant="h4" gutterBottom>
        Family List
      </Typography>
      <Box>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <IconButton>
                <Search />
              </IconButton>
            ),
          }}
          sx={{ width: '35%', marginBottom: 3 }}
        />
        <Button sx={{ fontSize: 20 }} onClick={handleNew}><FontAwesomeIcon icon={faPlus} style={{ marginRight: '3px' }} /> Family방 생성</Button>
      </Box>
      <Divider sx={{ marginBottom: '10px', color: 'black' }} />

      <Box sx={{ padding: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f0f0f0', borderRadius: 2, boxShadow: 3, mb:3 }}> {/* 박스 배경 개선 */}
          <Grid container spacing={2}>
            {filteredFamilyData.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} lg={6} key={index}> {/* 여기서 xs를 12에서 6으로 변경 */}
                <Card sx={{ marginBottom: '10px' }}>
                  <CardHeader
                    avatar={<Avatar alt={item.leadername} src={item.leaderprofile} onClick={() => handleMyPage(item.leaderuid)} />}
                    title={item.name}
                    subheader={item.regTime}
                  />
                  <CardContent onClick={() => handleOpen(item.faid)}>
                    <Typography variant="body2" color="text.secondary">
                      유저 수 : {item.usercount}
                    </Typography>
                  </CardContent>
                </Card>
                {index < filteredFamilyData.length - 1 && <Divider />}
              </Grid>
            ))}
          </Grid>
        </Box>

      <Modal
        open={modalopen}
        onClose={handleModalClose}
        aria-labelledby="modaltitle"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modaltitle">
            새 패밀리 생성
          </Typography>
          <TextField label="패밀리 이름" variant="outlined"
            value={newname}
            onChange={(e) => setNewname(e.target.value)}
            sx={{marginTop: '10px'}}
          /> <br />
          <Button variant="outlined" onClick={makeNewFamily} sx={{color: 'black', marginTop: '10px'}}>생성</Button>
        </Box>
      </Modal>

      <Dialog
        open={open}
        onClose={handleClose}
        // TransitionComponent={Transition}
        aria-labelledby="customized-dialog-title"
        keepMounted
        PaperProps={{
          style: {
            width: '75vw', // 원하는 너비로 설정
            maxWidth: '75vw', // 최대 너비 고정
            height: '80vh', // 원하는 높이로 설정
            maxHeight: '80vh', // 최대 높이 고정
          },

        }}
      >
        <IconButton aria-label="close" onClick={handleClose}
          sx={{
            position: 'absolute', right: 8, top: 8,
            color: (theme) => theme.palette.grey[500],
            zIndex: 2
          }} >
          <CloseIcon />
        </IconButton>
        <UserList faid={faid} />
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}
