import React, { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Box, Button, Card, CardHeader, Chip, Dialog, Divider, Grid, Icon, IconButton, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";

// 아이콘
import ImageIcon from '@mui/icons-material/Image';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

// css 연결
import './search.css';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TimeAgo from "timeago-react";
import BoardDetail from "layouts/home/Board/BoardDetail";
import Footer from "examples/Footer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetWithExpiry } from "api/LocalStorage";
import { useAddLike } from "api/customHook";
import { wrong } from "api/alert";

export default function MySearchList() {
  const uid = GetWithExpiry("uid");
  const nickname = GetWithExpiry("nickname");
  const query = sessionStorage.getItem("search");
  const location = useLocation();
  const [pageLoading, setPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [field, setField] = useState('title');
  const [field2, setField2] = useState('');
  const [field3, setField3] = useState('');
  const [type, setType] = useState(1);
  const [count, setCount] = useState(12);
  const [page, setPage] = useState(0);
  const [research, setResearch] = useState(false);
  const [boardList, setBoardList] = useState([{
    bid: -1,
    uid: -1,
    title: '',
    bContents: '',
    modTime: null,
    viewCount: 0,
    likeCount: 0,
    replyCount: 0,
    image: '',
    shareUrl: '',
    nickname: '',
    hashTag: '',
    isDeleted: 0
  }]);

  const [bid, setBid] = useState(0);
  const [open, setOpen] = useState(false);
  // 창 열고 닫기
  const handleOpen = (e) => {
    setOpen(true);
    setBid(e);
  }
  const handleClose = () => {
    setOpen(false);
    setBid(-1);
  };
  const [is, setIs] = useState(false);

  useEffect(() => {
    if (query != null) {
      axios.get('http://localhost:8090/board/list', {
        params: {
          c: count,
          f: field,
          f2: field2,
          f3: field3,
          q: query,
          type: type,
        }
      }).then(res => {
        setBoardList(res.data);
        setResearch(true);
        console.log(res.data); // 데이터를 콘솔에 출력하여 확인합니다.
        if (res.data.length > 0) {
          setIs(true);
        }
        else {
          setIs(false);
        }
      })
        .catch(error => console.log(error));
    }
    else {
      setIs(false);
    }
  }, [query, page, research]);

  const { data: allcount } = useQuery({
    queryKey: ['BoardCount'],
    queryFn: () => getBoardListCount(),
    placeholderData: (p) => p,
  })

  useEffect (() => {
    setField("hashTag");
  },[sessionStorage.getItem('tag')])
  
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
      // queryClient.refetchQueries(['boardList']);
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

  if (isLoading) {
    return (<div>로딩 중...</div>)
  }

  // 최신순으로 정렬
  const sortedDataList = boardList.data?.slice().sort((a, b) => new Date(b.modTime) - new Date(a.modTime));
  const handleSearch = (i) => {
    if (i === 1) {
      setField('title');
      setField2('');
      setField3('');
      setType(1);
      setCount(12);
      setResearch(false);
    } else if (i === 2) {
      setField('bContents');
      setField2('');
      setField3('');
      setType(1);
      setCount(12);
      setResearch(false);
    } else if (i === 3) {
      setField('hashTag');
      setField2('');
      setField3('');
      setType(1);
      setCount(12);
      setResearch(false);
    } else if (i === 4) {
      setField('title');
      setField2('bContents');
      setField3('');
      setType(2);
      setCount(12);
      setResearch(false);
    } else if (i === 5) {
      setField('nickname');
      setField2('');
      setField3('');
      setType(1);
      setCount(12);
      setResearch(false);
    } else if (i === 6) {
      setField('title');
      setField2('bContents');
      setField3('nickname');
      setType(3);
      setCount(12);
      setResearch(false);
    }
  }

  const navigate = useNavigate();
  const [searchtext, setSearchtext] = useState(sessionStorage.getItem("search"));

  useEffect(() => {
    setSearchtext(query);
  }, [query])

  const handleSearchs = () => {
    if (searchtext === '' || searchtext === null) {
      wrong('검색어를 입력하십시오');
    }
    else {
      sessionStorage.setItem("search", searchtext);
      if (location.pathname !== 'search') {
        navigate('/search');
      }
      else {
        window.location.replace('/search');
      }
    }
  }

  const handleSearchText = (e) => {
    setSearchtext(e.target.value);
  }

  function handleKeyPress(event) {
    if (event && event.key === 'Enter') {
      event.preventDefault();
      handleSearchs();
    }
  }

  const renderPlaceholder = (value) => {
    switch (value) {
      case 1: return "제목";
      case 2: return "내용";
      case 3: return "#해시태그";
      case 4: return "제목+내용";
      case 5: return "아이디";
      case 6: return "제목+내용+아이디";
    }
  };

  return (
    <div>
      <Box sx={{ width: '50%', minHeight: '1000px' }}>
        <Grid container sx={{ padding: '20px' }}>
          <Grid item >
            {/* 헤드라인 */}
            <Stack direction={'row'}
              sx={{
                alignItems: 'center',
                width: '50%',
              }}>
              <Select
                style={{ height: '2.5rem' }}
                defaultValue={!sessionStorage.getItem("tag") ? 1 : 3}
                value={renderPlaceholder(field)}
                onChange={(e) => handleSearch(e.target.value)}
                inputProps={{ 'aria-label': 'Without label' }}
                sx={{
                  marginRight: '10px',
                  color: 'purple',
                  textAlign: 'center',
                  fontWeight: 'bold', width: '50%'
                }}
              >
                <MenuItem value={1}>제목</MenuItem>
                <MenuItem value={2}>내용</MenuItem>
                <MenuItem value={3}>#해시태그</MenuItem>
                <MenuItem value={4}>제목+내용</MenuItem>
                <MenuItem value={5}>아이디</MenuItem>
                <MenuItem value={6}>제목+내용+아이디</MenuItem>
              </Select>

              <TextField
                id="outlined-multiline-flexible"
                variant="standard"
                placeholder="검색어를 입력하세요!"
                onChange={handleSearchText}
                value={searchtext}
                onKeyUp={handleKeyPress}
                sx={{ width: '40vw' }}
              />
              <IconButton
                size="small"
                color="inherit"
                disableRipple
                sx={{ cursor: 'pointer', mx: 2 }}
                onClick={handleSearchs}
              />
            </Stack>
            <Divider sx={{ marginTop: '2rem', marginBottom: '2rem' }}></Divider>

            {/* 목록 */}
            <Grid container spacing={3}>
              {Array.isArray(boardList) && boardList.length > 0 ? (
                boardList.map((data, idx) => (
                  <Grid key={idx} item lg={4}>
                    <MDBox mb={3}>
                      <Card sx={{
                        height: "100%",
                        transition: 'box-shadow 0.3s',
                        '&:hover': {
                          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
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
                          title={<Typography variant="subtitle3" sx={{ fontSize: "15px", color: 'purple' }}>{data.nickname}</Typography>}
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
                              <MDTypography component="div" variant="button" color="text" fontWeight="light" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {data.bContents}
                              </MDTypography>
                            </button>
                            <Divider />
                            <MDBox display="flex" alignItems="center">
                              <MDTypography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
                                <Icon>schedule</Icon>
                              </MDTypography>
                              <MDTypography variant="button" color="text" fontWeight="light">
                                <TimeAgo datetime={data.modTime} />
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                        </MDBox>
                      </Card>
                    </MDBox>
                  </Grid>
                ))
              ) : (
                <Grid item lg={12}>
                  <MDTypography>
                    검색 결과가 없습니다!
                  </MDTypography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <div id="observe" style={{ display: 'flex', height: '10px' }}></div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <BoardDetail bid={bid} uid={uid} handleClose={handleClose} nickname={nickname} handleButtonLike={handleButtonLike} />
      </Dialog>
      <Footer />
    </div>
  );
}
