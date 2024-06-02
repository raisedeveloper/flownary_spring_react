import { useContext, useEffect, useRef, useState } from "react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

// TimeAgo + 한글화
import TimeAgo from "timeago-react";
import * as timeago from 'timeago.js';
import ko from 'timeago.js/lib/lang/ko';

// Components Material 
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Iconify from "components/iconify/iconify";

// Mui Materials
import {
  Avatar, Box, Button, Chip, Divider, List, ListItem, ListItemAvatar,
  ListItemText, Modal, Paper, Stack, TextField, Typography, InputAdornment,
  IconButton, Link, CardMedia, CardHeader, Icon, Dialog, Popper, Grid, Card
} from "@mui/material";

// Mui Icon - Materials
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SubjectIcon from '@mui/icons-material/Subject';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import SettingsIcon from '@mui/icons-material/Settings';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import GridViewIcon from '@mui/icons-material/GridView';
import DehazeIcon from '@mui/icons-material/Dehaze';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';

import { UserContext, GetWithExpiry } from "api/LocalStorage";
import { getMyBoardList, getLikedBoardList, getUser } from "api/axiosGet";
import { disableBoard, deleteBoard } from "api/axiosPost";
import { deleteConfirm, Declaration } from "api/alert";
import { useAddLike } from "api/customHook";

import { AntSwitch } from '../home/postingStyle.jsx';
import PostingModal from "../home/Board/PostingModal"
import BoardDetail from "layouts/home/Board/BoardDetail";
import "./mypage.css";
import { insertDeclaration } from "api/axiosPost.js";
import { UpdateDisabledRounded } from "@mui/icons-material";
import { getChatCid } from "api/axiosGet.js";
import FollowMeList from "./FollowmeList.jsx";
import FollowList from "./FollowList.jsx";

function mypage() {

  const queryClient = new QueryClient();
  timeago.register('ko', ko);

  // useLocation으로 state 받기
  const { state } = useLocation();
  const { activeUser } = useContext(UserContext);

  // 파라메터에 있는 uid 받기
  const { uid } = state != undefined ? state : activeUser;


  // const uid = parseInt(GetWithExpiry('uid'));
  const [bid, setBid] = useState(0);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  //게시물 책갈피 토글
  const [showBoard, setShowBoard] = useState(true); // 게시글를 보여줄지 여부
  const [showLikes, setShowLikes] = useState(false); // 좋아요를 보여줄지 여부

  const [changepage, setChangepage] = useState(true);
  const [currentBid, setCurrentBid] = useState(null);

  // 게시물 사진 , 글영역
  const [showPhoto, setShowPhoto] = useState(false);
  const [expanded, setExpanded] = useState({});

  const board = useQuery({
    queryKey: ['boardmypage', uid],
    queryFn: () => getMyBoardList(uid),
  });

  const likes = useQuery({
    queryKey: ['boardLikeList', uid],
    queryFn: () => getLikedBoardList(uid),
  });

  const user = useQuery({
    queryKey: ['mypageuser', uid],
    queryFn: () => getUser(uid),
  });

  const handleOpen = (e) => {
    setOpen(true);
    setBid(e);
  };

  const handleClose = () => {
    setOpen(false);
    setBid(-1);
  };

  const handleOpen2 = () => {
    setOpen2(true);
  }

  const handleClose2 = () => {
    setOpen2(false);
  };
  const handleOpen3 = () => {
    setOpen3(true);
  }

  const handleClose3 = () => {
    setOpen3(false);
  };


  const addLike = useAddLike();
  const addLikeForm = (sendData) => {
    addLike(sendData);
  }

  const handleToggle = (bid) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [bid]: !prevExpanded[bid]
    }));
  };

  function handleButtonLike(bid, uid2) {
    if (uid == -1)
      return;

    const sendData = {
      uid: uid,
      fuid: uid2,
      oid: bid,
      type: 1,
    }

    addLikeForm(sendData);
  }

  // 댓글 좋아요 버튼 누를 때 넘기기
  function handleButtonLikeReply(rid, uid2) {
    if (uid == -1)
      return;

    const sendData = {
      uid: activeUser.uid,
      fuid: uid2,
      oid: rid,
      type: 2,
    }

    addLikeForm(sendData);
  }
  // 대댓글 좋아요 버튼 누를 때 넘기기
  function handleButtonLikeReReply(rrid, uid2) {
    if (uid === -1) return;

    const sendData = {
      uid: activeUser.uid,
      fuid: uid2,
      oid: rrid,
      type: 3,
    }
    addLikeForm(sendData);

  }
  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      A simple {name} alert with{" "}
      <MDTypography component="a" href="#" variant="body2" fontWeight="medium" color="white">
        an example link
      </MDTypography>
      . Give it a click if you like.
    </MDTypography>
  );

  const toggleBoard = () => {
    if (!showBoard) {
      setShowBoard(true);
      setShowLikes(false);
    }
  };

  const toggleLikes = () => {
    if (!showLikes) {
      setShowLikes(true);
      setShowBoard(false);
    }
  };

  const hanldlePhotoButton = () => {
    setShowPhoto(false);
  }

  const hanldlePhotoButton2 = () => {
    setShowPhoto(true);
  }

  //popper
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);

  const openPopover = Boolean(anchorEl);
  const openPopover2 = Boolean(anchorEl2);
  // const id = openPopover ? 'simple-popper' : 'close';
  // const id2 = openPopover ? 'simple-popper' : 'close';
  const popperRef = useRef(null);
  const [confirm, setConfirm] = useState('');

  const handleClick = (event, bid) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setCurrentBid(bid);
  };

  const handleClick2 = (event, bid) => {
    setAnchorEl2(anchorEl2 ? null : event.currentTarget);
    setCurrentBid(bid);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
  };

  const handleClickInside = (event) => {
    event.stopPropagation(); // 팝오버 내부의 이벤트 전파를 중지합니다.
  };

  // 삭제
  const handleDelete = async () => {
    handleClosePopover();
    const check = await deleteConfirm();

    if (check === 1) {
      await deleteBoard(currentBid);
      if (uid !== undefined) {
        queryClient.invalidateQueries(['boardmypage', uid]);
      }
      board.refetch();
    }
  };

  // 수정
  const navigate = useNavigate();
  const handleUpdate = () => {
    handleClosePopover();
    sessionStorage.setItem("bid", bid);
    navigate("../home/Update");
  }

  // 신고
  const handleSiren = async () => {
    handleClosePopover();
    console.log(activeUser.uid);
    const check = await Declaration(activeUser.uid);
    if (check !== 0) {
      const sendData = {
        bid: currentBid, uid: activeUser.uid, dTitle: check[0], dContents: check[1]
      }
      await insertDeclaration(sendData);
    }
  }

  // 활성화/비활성화
  const handlePublicButton = (bid, isDeleted) => {
    const d = isDeleted === -1 ? 0 : -1;
    disableBoard(bid, d).then(() => {
      board.refetch();
    });
    console.log(d);
  };

  if (board.isLoading || user.isLoading) {
    return (
      <div>Loading</div>
    )
  }

  const findChatMake = async (uid) => {
    if (uid && uid == activeUser.uid)
      return;

    const cid = await getChatCid(uid, activeUser.uid);

    if (cid == -1) {
      navigate("/chattingtemp", { state: { uid1: activeUser.uid, uid2: uid } });
    }
    else {
      navigate("/chatting", { state: { cid: cid } });
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* 상단 정보 넣는 Stack 태그 */}
      <Stack direction={'row'} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}> {/* 방향을 row로 지정하면 가로 방향으로 배치됨 */}

        {/* Avatar 태그 : 유튜브 프사처럼 동그란 이미지 넣을 수 있는 것 */}
        <Avatar
          sx={{
            width: '9rem',
            height: '9rem',
            margin: '10px',
            fontSize: '60px',
            border: '2px solid primary.main', // 외곽선 색과 굵기 지정
          }} >
          {user && user.data &&
            <div
              style={{
                width: '9rem',
                height: '9rem',
                borderRadius: '50%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url('https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${user.data.profile}')` // 이미지 URL 동적 생성
              }}
            >
            </div>}
        </Avatar>

        {/* 프사 옆 정보와 팔로우 버튼 만드는 Stack 공간 */}
        <Stack sx={{ padding: '20px' }} fontWeight={'bold'}>
          <Stack direction={'row'} spacing={2} sx={{ marginTop: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h4" fontWeight={'bold'}>
              {user.data.nickname}
            </Typography>
            {/* <Button onClick={handleCheckingPwd}><SettingsIcon sx={{ fontSize: '50px', color: 'darkgray' }} /></Button> */}
          </Stack>
          <Stack direction={'row'} spacing={2} sx={{ marginTop: '10px', marginBottom: '15px' }}>
            <Box sx={{ cursor: 'pointer' }} >
              게시물 수
            </Box>
            <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpen3('팔로워', '여기에 팔로워 수에 대한 정보를 표시')}>
              팔로워 
            </Box>
            <Box sx={{ cursor: 'pointer' }} onClick={() => handleOpen2('팔로잉', '여기에 팔로잉 수에 대한 정보를 표시')}>
              팔로잉 
            </Box>
          </Stack>
          <Stack direction={'row'} spacing={2}>
            <Button color="primary" className='msg_button' style={{ border: "3px solid #BA99D1" }} sx={{ width: '50%' }}>팔로우</Button>
            <Button color="primary" className='msg_button' style={{ border: "3px solid #BA99D1" }} sx={{ width: '70%' }} onClick={() => findChatMake(user.data.id)}>메시지</Button>

            {/* <Button variant="outlined" color="secondary" className='msg_button' sx={{ width: '130px' }} onClick={handlePwd}>비밀번호 변경</Button> */}
          </Stack>
        </Stack>
        <Stack direction={'column'} spacing={2} sx={{ marginTop: '10px', marginBottom: '15px' }}>
        </Stack>
      </Stack >
      {/* <FollowerModal open={followerModalOpen} handleClose={handleClose} content={modalContent} />
      <SettingModal open={SettingModalOpen} handleClose={handleClose} /> */}

      {/* 소개문 넣는 Stack */}
      <Stack sx={{ paddingLeft: '30px', paddingRight: '30px' }}>
        {/* <Link href={user.snsDomain}>{user.snsDomain}</Link> */}
        {/* {user.statusMessage} */}
      </Stack>
      <Divider sx={{ marginTop: '20px', marginBottom: '10px' }}></Divider>
      {/* 게시물과 태그 넣는 거 생성 */}
      <Stack direction="row" justifyContent="center" alignItems='center' spacing={5} sx={{ mt: 2 }}>
        <Stack direction="row" sx={{ cursor: 'pointer' }}>
          <SubjectIcon sx={{ fontSize: 'large' }} style={{ color: showBoard ? 'red' : 'rgb(0,0,0)' }} />
          <Typography onClick={toggleBoard} sx={{ fontSize: 'large' }}>게시물</Typography>
        </Stack>
        {uid === activeUser.uid &&
          <Stack direction="row" sx={{ cursor: 'pointer' }}        >
            <Icon sx={{ fontSize: 'large' }} style={{ color: showLikes ? 'red' : 'rgb(0,0,0)' }}>favorite</Icon>
            <Typography onClick={toggleLikes} sx={{ fontSize: 'large' }} >좋아요</Typography>
          </Stack>}
      </Stack>
      <br />
      {/* 게시물 표시하는 Grid */}
      {showBoard &&
        <Grid container spacing={1} sx={{ position: 'relative' }}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, mr: 3 }}>
            <GridViewIcon onClick={hanldlePhotoButton} sx={{ cursor: 'pointer', mr: 2 }} />
            <DehazeIcon onClick={hanldlePhotoButton2} sx={{ cursor: 'pointer' }} />
          </Grid>
          {!showPhoto ?
            (board && board.data && board.data.map((data, idx) => {
              const modTime = data.modTime;
              if (!modTime) return null; // modTime이 없으면 건너뜁니다.

              const yearFromModTime = new Date(modTime).getFullYear(); // modTime에서 연도를 추출합니다.
              if (yearFromModTime !== selectedYear) return null; // 선택한 연도와 다른 경우 건너뜁니다.

              return (
                <Grid key={idx} item xs={3}>
                  <MDBox mb={3}>
                    <Card sx={{
                      height: "100%",
                      transition: 'box-shadow 0.3s', // 추가: 호버 시 그림자 효과를 부드럽게 만들기 위한 트랜지션
                      '&:hover': {
                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // 추가: 호버 시 그림자 효과
                      }
                    }}>
                      <MDBox padding="1rem">
                        {data.image &&
                          <MDBox onClick={handleOpen.bind(null, data.bid)}
                            variant="gradient"
                            borderRadius="lg"
                            py={2}
                            pr={0.5}
                            sx={{
                              position: "relative", // 이미지를 부모 요소에 상대적으로 위치하도록 설정합니다.
                              height: "12.5rem",
                              overflow: "visible", // 이미지가 부모 요소를 넘어가지 않도록 설정합니다.
                              transition: 'box-shadow 0.3s', // 호버 시 그림자 효과를 부드럽게 만들기 위한 트랜지션을 설정합니다.
                              '&:hover img': { // 이미지가 호버될 때의 스타일을 지정합니다.
                                transform: 'scale(1.05)', // 이미지를 확대합니다.
                                transition: 'transform 0.35s ease-in-out', // 확대 효과를 부드럽게 만들기 위한 트랜지션을 설정합니다.
                              },
                              '&:hover': { // MDBox가 호버될 때의 스타일을 지정합니다.
                                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // 그림자 효과를 추가합니다.
                              }
                            }}
                          >
                            <img
                              src={data.image ? `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.image.split(',')[0]}` : ''}
                              alt="Paella dish"
                              style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, borderRadius: 'inherit' }}
                            />
                          </MDBox>
                        }
                      </MDBox>
                    </Card>
                  </MDBox>
                </Grid>
              );
              // 게시글 영역
            })) :
            (
              board && board.data && board.data.map((data, idx) =>
                <Grid key={idx} item xs={12} md={6} lg={4} >
                  <MDBox mb={3}>
                    <Card sx={{
                      height: "100%",
                      transition: 'box-shadow 0.3s', // 추가: 호버 시 그림자 효과를 부드럽게 만들기 위한 트랜지션
                      '&:hover': {
                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // 추가: 호버 시 그림자 효과
                      }
                    }}>
                      <CardHeader
                        sx={{ padding: 1 }}
                        avatar={
                          <Avatar
                            aria-label="recipe"
                            src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.profile}`}
                          />
                        }
                        action={<>
                          {
                            data.uid === activeUser.uid && (<>
                              <IconButton aria-label="settings" onClick={(event) => handleClick(event, data.bid)} ref={popperRef}>
                                <MoreVertIcon />
                              </IconButton>
                              <Popper
                                id={openPopover ? 'simple-popper' : 'close'}
                                onClose={handleClosePopover}
                                open={openPopover}
                                anchorEl={anchorEl}
                                placement="bottom-end"
                                modifiers={[
                                  {
                                    name: 'offset',
                                    options: {
                                      offset: [0, 10],
                                    },
                                  },
                                ]}
                              >
                                <Paper
                                  style={{
                                    padding: '0.3rem',
                                    backgroundColor: 'white',
                                    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                                    borderRadius: '8px',
                                  }}
                                  onClick={(e) => e.stopPropagation()} // 팝오버 내부 클릭 시 이벤트 전파 막기
                                >
                                  <Button
                                    sx={{
                                      py: 0,
                                      pl: 1,
                                      pr: 1,
                                      color: 'blue',
                                      '&:hover': { color: 'blue' },
                                    }}
                                    onClick={handleUpdate}
                                  >
                                    <Iconify style={{ marginRight: '0.1rem' }} icon="lucide:edit" />수정
                                  </Button>
                                  <Button
                                    sx={{
                                      py: 0,
                                      pl: 1,
                                      pr: 1,
                                      color: 'red',
                                      '&:hover': { color: 'red' },
                                    }}
                                    onClick={() => handleDelete()}
                                  >
                                    <Iconify style={{ marginRight: '0.1rem' }} icon="solar:trash-bin-trash-bold" />삭제
                                  </Button>
                                </Paper>
                              </Popper>

                            </>)
                          }</>
                        }
                        title={<Typography variant="subtitle3" sx={{ fontSize: "15px", color: 'purple' }}>{data.nickname}</Typography>}
                      />

                      <MDBox padding="1rem">
                        {data.image &&
                          <MDBox onClick={handleOpen.bind(null, data.bid)}
                            variant="gradient"
                            borderRadius="lg"
                            py={2}
                            pr={0.5}
                            sx={{
                              position: "relative", // 이미지를 부모 요소에 상대적으로 위치하도록 설정합니다.
                              height: "12.5rem",
                              overflow: "visible", // 이미지가 부모 요소를 넘어가지 않도록 설정합니다.
                              transition: 'box-shadow 0.3s', // 호버 시 그림자 효과를 부드럽게 만들기 위한 트랜지션을 설정합니다.
                              '&:hover img': { // 이미지가 호버될 때의 스타일을 지정합니다.
                                transform: 'scale(1.05)', // 이미지를 확대합니다.
                                transition: 'transform 0.35s ease-in-out', // 확대 효과를 부드럽게 만들기 위한 트랜지션을 설정합니다.
                              },
                              '&:hover': { // MDBox가 호버될 때의 스타일을 지정합니다.
                                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // 그림자 효과를 추가합니다.
                              }
                            }}
                          >
                            <img
                              src={data.image ? `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.image.split(',')[0]}` : ''}
                              alt="Paella dish"
                              style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, borderRadius: 'inherit' }}
                            />
                          </MDBox>
                        }
                        <MDBox pt={3} pb={1} px={1}>
                          <button onClick={handleOpen.bind(null, data.bid)} style={{ border: 'none', backgroundColor: 'transparent', padding: 0, margin: 0 }}>
                            <MDTypography variant="h6" textTransform="capitalize">
                              {data.title}
                            </MDTypography>
                            {expanded[data.bid] ? (
                              <MDTypography component="div" variant="button" color="text" fontWeight="light">
                                {data.bContents}
                              </MDTypography>
                            ) : (
                              <MDTypography component="div" variant="button" color="text" fontWeight="light" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {data.bContents}
                              </MDTypography>
                            )}
                          </button>
                          <Button onClick={() => handleToggle(data.bid)}>{expanded[data.bid] ? '...' : '...'}</Button>
                          <Divider />
                          <MDBox display="flex" alignItems="center">
                            <MDTypography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
                              <Icon>schedule</Icon>
                            </MDTypography>
                            <MDTypography variant="button" color="text" fontWeight="light">
                              <TimeAgo datetime={data.modTime} locale='ko' />
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                        <Button onClick={() => handlePublicButton(data.bid, data.isDeleted)}>
                          <Typography sx={{ marginRight: '1em', fontSize: 'small', fontWeight: 'bold' }} style={{ color: 'black' }}>
                            {data.isDeleted == 0 ? '공개' : '비공개'}
                          </Typography>
                          <AntSwitch sx={{ marginTop: '0.25em' }} checked={data.isDeleted == 0} inputProps={{ 'aria-label': 'ant design' }} />
                        </Button>
                      </MDBox>
                    </Card>
                  </MDBox>
                </Grid>
              ))}
        </Grid>
      }

      {uid === activeUser.uid && showLikes &&
        <Grid container spacing={1} sx={{ position: 'relative' }}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, mr: 3 }}>
            <GridViewIcon onClick={hanldlePhotoButton} sx={{ cursor: 'pointer', mr: 2 }} />
            <DehazeIcon onClick={hanldlePhotoButton2} sx={{ cursor: 'pointer' }} />
          </Grid>
          {!showPhoto ?
            (likes && likes.data && likes.data.map((data, idx) => {
              const modTime = data.modTime;
              if (!modTime) return null; // modTime이 없으면 건너뜁니다.

              const yearFromModTime = new Date(modTime).getFullYear(); // modTime에서 연도를 추출합니다.
              if (yearFromModTime !== selectedYear) return null; // 선택한 연도와 다른 경우 건너뜁니다.

              return (
                <Grid key={idx} item xs={3}>
                  <MDBox mb={3}>
                    <Card sx={{
                      height: "100%",
                      transition: 'box-shadow 0.3s', // 추가: 호버 시 그림자 효과를 부드럽게 만들기 위한 트랜지션
                      '&:hover': {
                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // 추가: 호버 시 그림자 효과
                      }
                    }}>
                      <MDBox padding="1rem">
                        {data.image &&
                          <MDBox
                            variant="gradient"
                            borderRadius="lg"
                            py={2}
                            pr={0.5}
                            sx={{
                              position: "relative", // 이미지를 부모 요소에 상대적으로 위치하도록 설정합니다.
                              height: "12.5rem",
                              overflow: "visible", // 이미지가 부모 요소를 넘어가지 않도록 설정합니다.
                              transition: 'box-shadow 0.3s', // 호버 시 그림자 효과를 부드럽게 만들기 위한 트랜지션을 설정합니다.
                              '&:hover img': { // 이미지가 호버될 때의 스타일을 지정합니다.
                                transform: 'scale(1.05)', // 이미지를 확대합니다.
                                transition: 'transform 0.35s ease-in-out', // 확대 효과를 부드럽게 만들기 위한 트랜지션을 설정합니다.
                              },
                              '&:hover': { // MDBox가 호버될 때의 스타일을 지정합니다.
                                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // 그림자 효과를 추가합니다.
                              }
                            }}
                          >
                            <button onClick={handleOpen.bind(null, data.bid)}>
                              <img
                                src={data.image ? `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.image.split(',')[0]}` : ''}
                                alt="Paella dish"
                                style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, borderRadius: 'inherit' }}
                              />
                            </button>
                          </MDBox>
                        }
                      </MDBox>
                    </Card>
                  </MDBox>
                </Grid>
              );
              // 게시글 영역
            })) :
            (likes && likes.data && likes.data.map((data, idx) =>
              <Grid key={idx} item xs={12} md={6} lg={4} >
                <MDBox mb={3}>
                  <Card sx={{
                    height: "100%",
                    transition: 'box-shadow 0.3s', // 추가: 호버 시 그림자 효과를 부드럽게 만들기 위한 트랜지션
                    '&:hover': {
                      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // 추가: 호버 시 그림자 효과
                    }
                  }}>
                    <CardHeader
                      sx={{ padding: 1 }}
                      avatar={
                        <Avatar
                          aria-label="recipe"
                          src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.profile}`}
                        />
                      }
                      action={<>
                        {
                          data.uid === activeUser.uid ? (<>
                            <IconButton aria-label="settings" onClick={(event) => handleClick(event, data.bid)} ref={popperRef}>
                              <MoreVertIcon />
                            </IconButton>
                            <Popper
                              id={openPopover ? 'simple-popper' : 'close'}
                              onClose={handleClosePopover}
                              open={openPopover}
                              anchorEl={anchorEl}
                              placement="bottom-end"
                              modifiers={[
                                {
                                  name: 'offset',
                                  options: {
                                    offset: [0, 10],
                                  },
                                },
                              ]}
                            >
                              <Paper style={{
                                padding: '0.3rem',
                                backgroundColor: 'white',
                                boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                                borderRadius: '8px',
                              }}
                                onClick={handleClickInside}>
                                <Button sx={{
                                  py: 0,
                                  pl: 1,
                                  pr: 1,
                                  color: 'blue',
                                  '&:hover': { color: 'blue' },
                                }} onClick={handleUpdate}><Iconify style={{ marginRight: '0.1rem' }} icon="lucide:edit" />수정</Button>
                                <Button sx={{
                                  py: 0,
                                  pl: 1,
                                  pr: 1,
                                  color: 'red',
                                  '&:hover': { color: 'red' },
                                }} onClick={() => handleDelete()}><Iconify style={{ marginRight: '0.1rem' }} icon="solar:trash-bin-trash-bold" />삭제</Button>
                              </Paper>
                            </Popper >
                          </>) : <>
                            <IconButton aria-label="settings" onClick={(event) => handleClick2(event, data.bid)} ref={popperRef} >
                              <MoreVertIcon />
                            </IconButton>
                            <Popper
                              id={openPopover2 ? 'simple-popper' : 'close'}
                              onClose={handleClosePopover}
                              open={openPopover2}
                              anchorEl={anchorEl2}
                              placement="bottom-end"
                              modifiers={[
                                {
                                  name: 'offset',
                                  options: {
                                    offset: [0, 10],
                                  },
                                },
                              ]}
                            >
                              <Paper style={{
                                padding: '0.3rem',
                                backgroundColor: 'white',
                                boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                                borderRadius: '8px',
                              }}
                                onClick={handleClickInside}>
                                <Button onClick={() => handleSiren()} sx={{ py: 0, pl: 1, pr: 1, color: 'red', '&:hover': { color: 'red' } }}><Iconify style={{ marginRight: '0.1rem' }} icon="ph:siren-bold" />신고 하기</Button>
                              </Paper>
                            </Popper >
                          </>
                        }</>
                      }
                      title={<Typography variant="subtitle3" sx={{ fontSize: "15px", color: 'purple' }}>{data.nickname}</Typography>}
                    />

                    <MDBox padding="1rem">
                      {data.image &&
                        <MDBox onClick={handleOpen.bind(null, data.bid)}
                          variant="gradient"
                          borderRadius="lg"
                          py={2}
                          pr={0.5}
                          sx={{
                            position: "relative", // 이미지를 부모 요소에 상대적으로 위치하도록 설정합니다.
                            height: "12.5rem",
                            overflow: "visible", // 이미지가 부모 요소를 넘어가지 않도록 설정합니다.
                            transition: 'box-shadow 0.3s', // 호버 시 그림자 효과를 부드럽게 만들기 위한 트랜지션을 설정합니다.
                            '&:hover img': { // 이미지가 호버될 때의 스타일을 지정합니다.
                              transform: 'scale(1.05)', // 이미지를 확대합니다.
                              transition: 'transform 0.35s ease-in-out', // 확대 효과를 부드럽게 만들기 위한 트랜지션을 설정합니다.
                            },
                            '&:hover': { // MDBox가 호버될 때의 스타일을 지정합니다.
                              boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', // 그림자 효과를 추가합니다.
                            }
                          }}
                        >
                          <img
                            src={data.image ? `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.image.split(',')[0]}` : ''}
                            alt="Paella dish"
                            style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, borderRadius: 'inherit' }}
                          />
                        </MDBox>}
                      <MDBox pt={3} pb={1} px={1}>
                        <button onClick={handleOpen.bind(null, data.bid)} style={{ border: 'none', backgroundColor: 'transparent', padding: 0, margin: 0 }}>
                          <MDTypography variant="h6" textTransform="capitalize">
                            {data.title}
                          </MDTypography>
                          {expanded[data.bid] ? (
                            <MDTypography component="div" variant="button" color="text" fontWeight="light">
                              {data.bContents}
                            </MDTypography>
                          ) : (
                            <MDTypography component="div" variant="button" color="text" fontWeight="light" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {data.bContents}
                            </MDTypography>
                          )}
                        </button>
                        <Button onClick={() => handleToggle(data.bid)}>{expanded[data.bid] ? '...' : '...'}</Button>
                        <Divider />
                        <MDBox display="flex" alignItems="center">
                          <MDTypography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
                            <Icon>schedule</Icon>
                          </MDTypography>
                          <MDTypography variant="button" color="text" fontWeight="light">
                            <TimeAgo datetime={data.modTime} locale='ko' />
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    </MDBox>
                  </Card>
                </MDBox>
              </Grid>
            ))}
        </Grid>}
      <br />
      <Footer />
      <Dialog
        open={open}
        onClose={handleClose}
        // TransitionComponent={Transition}
        aria-labelledby="customized-dialog-title"
        keepMounted
        PaperProps={{
          sx: {
            width: '60%', // 원하는 너비 퍼센트로 설정
            height: '80vh', // 원하는 높이 뷰포트 기준으로 설정
            maxWidth: 'none', // 최대 너비 제한 제거
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

        <BoardDetail bid={bid} uid={uid} handleClose={handleClose} nickname={user.data.nickname} handleButtonLikeReply={handleButtonLikeReply} handleButtonLikeReReply={handleButtonLikeReReply} handleButtonLike={handleButtonLike} />
      </Dialog>
      <Dialog
        open={open2}
        onClose={handleClose2}
        // TransitionComponent={Transition}
        aria-labelledby="customized-dialog-title"
        keepMounted
        PaperProps={{
          sx: {
            width: '60%', // 원하는 너비 퍼센트로 설정
            height: '80vh', // 원하는 높이 뷰포트 기준으로 설정
            maxWidth: 'none', // 최대 너비 제한 제거
          },
        }}
      >
        <IconButton aria-label="close" onClick={handleClose2}
          sx={{
            position: 'absolute', right: 8, top: 8,
            color: (theme) => theme.palette.grey[500],
            zIndex: 2
          }} >
          <CloseIcon />
        </IconButton>
        <FollowList uid={uid} handleClose2={handleClose2} />
      </Dialog>

      <Dialog
        open={open3}
        onClose={handleClose3}
        // TransitionComponent={Transition}
        aria-labelledby="customized-dialog-title"
        keepMounted
        PaperProps={{
          sx: {
            width: '60%', // 원하는 너비 퍼센트로 설정
            height: '80vh', // 원하는 높이 뷰포트 기준으로 설정
            maxWidth: 'none', // 최대 너비 제한 제거
          },
        }}
      >
        <IconButton aria-label="close" onClick={handleClose3}
          sx={{
            position: 'absolute', right: 8, top: 8,
            color: (theme) => theme.palette.grey[500],
            zIndex: 2
          }} >
          <CloseIcon />
        </IconButton>
        <FollowMeList uid={uid} />
      </Dialog>
    </DashboardLayout >
  );
}

export default mypage;