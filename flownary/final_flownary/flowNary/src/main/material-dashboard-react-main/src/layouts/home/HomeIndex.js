import PropTypes from 'prop-types';

// @mui material components
import Grid from "@mui/material/Grid";
import axios from "axios";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Dashboard components
import TodoList from "./todoList/TodoListIndex";
import { Avatar, Box, Button, Card, CardContent, CardHeader, CardMedia, Divider, Icon, IconButton, Modal, Stack, Popover, Dialog, Typography, List, ListItem, Popper, Paper, } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { Bar } from "react-chartjs-2";
import MDTypography from "components/MDTypography";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import BoardDetail from "./Board/BoardDetail";
import Write from './write';
import CloseIcon from '@mui/icons-material/Close';

import { useLocation, useNavigate } from "react-router-dom";
import { GetWithExpiry } from "api/LocalStorage";
import { useAddLike, useGetUserNicknameLS } from "api/customHook";
import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getBoardList, getBoardListCount } from "api/axiosGet";
import { getBoard } from "api/axiosGet";
import TimeAgo from "timeago-react";
import * as timeago from 'timeago.js';
import ko from 'timeago.js/lib/lang/ko';

import AppTasks from '../admin/statistics/app-tasks';
import { UserContext } from "api/LocalStorage";
import { deleteBoard } from "api/axiosPost";
import { deleteConfirm } from "api/alert";
import Iconify from "components/iconify/iconify";
import { Declaration } from "api/alert";
import { insertDeclaration } from "api/axiosPost";


export default function Home() {

  timeago.register('ko', ko);
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState({});

  // const Transition = React.forwardRef(function Transition(props, ref) {
  //   return <Slide direction="right" ref={ref} {...props} />;
  // });

  const handleToggle = (bid) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [bid]: !prevExpanded[bid]
    }));
  };

  /////////////////////////////////////////////////////////////////////
  // 유저 정보 받아오기

  const navigate = useNavigate();

  const uid = GetWithExpiry("uid");
  const email = GetWithExpiry("email");
  const profile = GetWithExpiry("profile");

  const [bid, setBid] = useState(0);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [currentBid, setCurrentBid] = useState(null);


  // if (uid == -1) {
  //   navigate("/login");
  // }
  const nickname = useGetUserNicknameLS();

  const { activeUser } = useContext(UserContext);
  const [bContents, setBcontents] = useState('');
  const BoardDetailDialog = ({ open, handleClose, bid, uid, index, nickname, handleButtonLikeReply, handleButtonLikeReReply, handleButtonLike }) => {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: '90%',
            height: '80vh',
            maxWidth: 'none',
            zIndex: 0
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
        <BoardDetail bid={bid} uid={uid} index={index} handleClose={handleClose} nickname={nickname} handleButtonLikeReply={handleButtonLikeReply} handleButtonLikeReReply={handleButtonLikeReReply} handleButtonLike={handleButtonLike} />
      </Dialog>
    );
  };


  // 창 열고 닫기
  const handleOpen = (e) => {
    setOpen(true);
    setBid(e);
  }
  const handleClose = () => { setOpen(false); };

  const location = useLocation();
  const [path2, setPath2] = useState('');

  useEffect(() => {
    if (location.pathname) {
      const getPath = async () => {
        const path = location.pathname.split('/');
        if (path) {
          const lastPath = path.slice(-1)[0];
          setPath2(lastPath);
        }
        getPath();
      }
    };
  }, [location]);

  const [count, setCount] = useState(10);
  const [page, setPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const observerRef = useRef(null);

  /////////////////// useQuery로 BoardList 받기 ///////////////////

  const { data: boardList, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['boardList', uid],
    queryFn: ({ pageParam = 1 }) => getBoardList(pageParam * count, uid),
    getNextPageParam: (lastPage) => {
      if (lastPage) {
        if (lastPage.nextCursor !== undefined) {
          return lastPage.nextCursor;
        }
      } else {
        console.warn('Last page is undefined');
        return undefined;
      }
    },
  });


  const { data: allcount } = useQuery({
    queryKey: ['BoardCount'],
    queryFn: () => getBoardListCount(),
    placeholderData: (p) => p,
  })

  useEffect(() => {
    if (count >= allcount && allcount !== undefined)
      setPageLoading(false);
    else if (count < allcount && allcount !== undefined)
      setPageLoading(true);
  }, [count, allcount])

  const callback = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && pageLoading) // 타겟 요소가 화면에 들어오면 실행
    {
      setPage((prevpage) => prevpage + 1);
      setCount((prevcount) => prevcount + 4);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const observer = new IntersectionObserver(callback, {
        rootMargin: '0px 0px 0px 0px',
        threshold: 0,
      })

      const observerTarget = document.getElementById("observe"); // id가 observe인 태그를 사용
      queryClient.refetchQueries(['boardList']);
      if (observerTarget) {
        observer.observe(observerTarget);
      }
      return () => { // 페이지 종료 시 타겟 해제
        if (observer && observerTarget) {
          observer.unobserve(observerTarget);
        }
      };
    }, 1000)
  }, [page]);



  const addLike = useAddLike();
  const addLikeForm = (sendData) => {
    addLike(sendData);
  }

  // 좋아요 버튼 누를 때 넘기기
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
  if (isLoading) {
    <div>로딩중...</div>
  }

  //popover
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);

  const openPopover = Boolean(anchorEl);
  const openPopover2 = Boolean(anchorEl2);
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
      // boardList.refetch();
    }
  };

  // 수정
  const handleUpdate = () => {
    handleClosePopover();
    sessionStorage.setItem("bid", bid);
    navigate("../home/Update");
  }

  // 신고
  const handleSiren = async () => {
    handleClosePopover();
    console.log('있음?' + activeUser.uid);
    const check = await Declaration(activeUser.uid);
    if (check !== 0) {
      const sendData = {
        bid: currentBid, uid: activeUser.uid, dTitle: check[0], dContents: check[1]
      }
      await insertDeclaration(sendData);
    }
  }
  // 클릭 시 마이페이지 이동 이벤트
  const handleMyPage = (uid) => {
    navigate("/mypage", { state: { uid: uid } }); // state를 통해 navigate 위치에 파라메터 제공
  }


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mt={3}>
          <Stack direction="row" spacing={0}>
            <Stack direction="column" sx={{ flex: 1, mr: 3 }}>
              <Write />
              <Grid container spacing={3}>
                {(boardList && allcount && !isLoading) ? (
                  boardList.pages.map((page, index) => (
                    <React.Fragment key={index}>
                      {page && page.map((data, idx) => (
                        <Grid key={idx} item xs={12} md={6} lg={6}>
                          <MDBox mb={3}>
                            <Card sx={{
                              transition: 'box-shadow 0.3s',
                              '&:hover': {
                                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                              }
                            }}>
                              <CardHeader
                                sx={{ padding: 1 }}
                                avatar={
                                  <Avatar sx={{ cursor: 'pointer' }}
                                    aria-label="recipe" onClick={() => handleMyPage(data.uid)}
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
                                          <Button onClick={() => handleSiren(data.bid)} sx={{ py: 0, pl: 1, pr: 1, color: 'red', '&:hover': { color: 'red' } }}><Iconify style={{ marginRight: '0.1rem' }} icon="ph:siren-bold" />신고 하기</Button>
                                        </Paper>
                                      </Popper >
                                    </>
                                  }</>
                                }
                                title={<Typography variant="subtitle3" sx={{ fontSize: "15px", color: 'black', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleMyPage(data.uid)}>{data.nickname}</Typography>}
                              />

                              <MDBox padding="1rem">
                                {data.image ?
                                  <MDBox
                                    variant="gradient"
                                    borderRadius="lg"
                                    py={2}
                                    pr={0.5}
                                    sx={{
                                      position: "relative",
                                      height: "12.5rem",
                                      overflow: "visible",
                                      transition: 'box-shadow 0.3s',
                                      '&:hover img': {
                                        transform: 'scale(1.05)',
                                        transition: 'transform 0.35s ease-in-out',
                                      },
                                      '&:hover': {
                                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
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
                                  :
                                  <MDBox>
                                    <MDBox
                                      variant="gradient"
                                      borderRadius="lg"
                                      py={2}
                                      pr={0.5}
                                      sx={{
                                        position: "relative",
                                        height: "12.5rem",
                                        overflow: "visible",
                                        transition: 'box-shadow 0.3s',
                                        '&:hover img': {
                                          transform: 'scale(1.05)',
                                          transition: 'transform 0.35s ease-in-out',
                                        },
                                        '&:hover': {
                                          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                                        }
                                      }}
                                    >
                                      <button onClick={handleOpen.bind(null, data.bid)}>
                                        <img
                                          src="images/LightLogo.png"
                                          alt="Paella dish"
                                          style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'fill', position: 'absolute', top: 0, left: 0, borderRadius: 'inherit' }}
                                        />
                                      </button>
                                    </MDBox>
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
                                      <MDTypography component="div" variant="button" color="text" fontWeight="light" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
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
                    </React.Fragment>
                  ))
                ) : <></>}
              </Grid>

            </Stack>


            <Stack direction="column" sx={{ flex: 0.5 }}>
              <MDBox mb={3} sx={{ position: 'sticky', top: "5%" }}>
                <TodoList />
              </MDBox>
            </Stack>
          </Stack>
        </MDBox >
      </MDBox >
      {/* <div ref={observerRef}></div> */}
      <div id="observe" ref={observerRef} style={{ display: 'flex', height: '1rem' }}></div>

      {/* 게시글 모달 */}
      <Dialog
        open={open}
        onClose={handleClose}
        // TransitionComponent={Transition}
        aria-labelledby="customized-dialog-title"
        keepMounted
        PaperProps={{
          sx: {
            width: '90%', // 원하는 너비 퍼센트로 설정
            height: '80vh', // 원하는 높이 뷰포트 기준으로 설정
            maxWidth: 'none', // 최대 너비 제한 제거
            zIndex: 0
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
        <BoardDetail bid={bid} uid={uid} index={index} handleClose={handleClose} nickname={nickname} handleButtonLikeReply={handleButtonLikeReply} handleButtonLikeReReply={handleButtonLikeReReply} handleButtonLike={handleButtonLike} />
      </Dialog>

      <Footer />
    </DashboardLayout >
  );
}
// PropTypes 유효성 검사 추가
Home.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  bid: PropTypes.number.isRequired,
  uid: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  nickname: PropTypes.string.isRequired,
  handleButtonLikeReply: PropTypes.func.isRequired,
  handleButtonLikeReReply: PropTypes.func.isRequired,
  handleButtonLike: PropTypes.func.isRequired,
};