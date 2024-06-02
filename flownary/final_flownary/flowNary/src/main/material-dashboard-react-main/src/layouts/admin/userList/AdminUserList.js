// react 라이브러리
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// mui 라이브러리
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { Button, Grid, TextField } from '@mui/material';
import { MyLocation } from '@mui/icons-material';

// api 폴더
import axios from 'axios';
import { getUserList, getUser } from 'api/axiosGet';
import { updateUserStatus } from 'api/axiosPost';

// examples, components 등등 작업 폴더
import Iconify from '../../../components/iconify';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';


// ----------------------------------------------------------------------

Modal.setAppElement('#app'); // Modal 접근성을 위한 설정

export default function UserTableRow({ selected, handleClick }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(1);
  const [currentUserId, setCurrentUserId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState(null);

  // 유저 정보 불러오기
  const location = useLocation();
  const rowsPerPage = 10;

  // 메뉴 열기 핸들러
  const handleOpenMenu = (event, userId) => {
    setOpen(event.currentTarget);
    setCurrentUserId(userId)
  };

  // 유저 정보 변경
  const handleUpdateStatus = (event) => {
    mutate({ uid: currentUserId, status: 1 });
  }

  // 유저 정보 수정
  const handleUserProfileEdit = () => {
    const user = users.find((user) => user.uid === currentUserId);
    setModalUser(user);
    setIsModalOpen(true);
    handleCloseMenu();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalUser(null);
  };

  const handleProfileSave = () => {
    // 추후에 프로필 저장 후 변경 될 로직 작성
    setIsModalOpen(false);
  };


  // 메뉴 닫기 핸들러
  const handleCloseMenu = () => {
    setOpen(null);
    setCurrentUserId('')
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // location을 이용한 사용자 정보 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const uid = searchParams.get('uid');
    if (uid) {
      // API를 통해 해당 uid의 사용자 정보 가져오기
      getUser(uid).then((data) => {
        setUserData(data);
      }).catch((error) => {
        console.error("Error fetching user data:", error);
      });
    }
  }, [location]);


  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUserList(),
  });

  const { mutate } = useMutation({
    mutationFn: userData => { // {userId: userId, status: status}
      updateUserStatus(userData)
    },
    onSuccess: () => {
      alert('유저 정보를 삭제했습니다');
      queryClient.refetchQueries(['users']);
    },
    onError: () => { alert('유저 삭제에 실패했습니다.') },
  });
  // users 데이터가 없거나 로딩 중일 때 처리
  if (isLoading) {
    return (
      <TableRow>
        <TableCell>로딩 중...</TableCell>
      </TableRow>
    );
  }

  if (isError) {
    return (
      <TableRow>
        <TableCell>유저 정보를 불러오는데 실패 했습니다.</TableCell>
      </TableRow>
    );
  }


  const paginatedUsers = users.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // 유저 데이터가 있을 때 각 유저 정보를 테이블 행으로 렌더링
  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <Container sx={{ padding: '2rem' }}>
          <Typography variant="h4" > 유저 목록 </Typography>
          <Stack direction="column" alignItems="center" justifyContent="space-between" mb={5}>
            <TableContainer component={Paper} sx={{ margin: '1.5rem' }}>
              <Table>
                <TableBody>
                  {paginatedUsers && paginatedUsers.map((user) => (
                    <TableRow hover tabIndex={-1} role="checkbox" selected={selected} key={user.id}>
                      <TableCell component="th" scope="row" padding="none" align="center">
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                          <Avatar sx={{ width: '3rem', height: '3rem' }}>
                            <div
                              style={{
                                width: '3rem',
                                height: '3rem',
                                borderRadius: '50%',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundImage: `url(https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${user.profile})`,
                              }}
                            />
                          </Avatar>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2" noWrap>
                          {user.uname ? user.uname : "확인이 필요한 유저"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {user.provider === 'google' ? '구글유저' : '기본유저'}
                      </TableCell>
                      <TableCell align="center">
                        {user.status === -1 ? '관리자' : user.status === 1 ? '비활성화' : '활성화'}
                      </TableCell>
                      <TableCell align="center">
                        {user.regDate}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={e => handleOpenMenu(e, user.uid)}>
                          <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Popover
              open={!!open}
              anchorEl={open}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{ sx: { width: 200 }, }}
            >
              <MenuItem style={{ zIndex: 1500, backgroundColor: 'white' }}
                onClick={handleUserProfileEdit} sx={{ width: '100%' }}>
                <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                유저프로필 정보

              </MenuItem>

              <MenuItem style={{ zIndex: 1500, backgroundColor: 'white' }}
                onClick={handleUpdateStatus} sx={{ color: 'error.main' }}>
                <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                유저삭제
              </MenuItem>
            </Popover>
            <Pagination
              count={Math.ceil(users.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              shape="rounded"
            />
          </Stack>
        </Container>
      </DashboardLayout >

      {/* 모달 유저 상태보기 */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="User Profile Edit"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        {modalUser && (
          <div>
            <h2>{modalUser.uname} 프로필 정보</h2>
            <div>
              <TextField
                variant="outlined"
                defaultValue={modalUser.uid}
                margin="normal"
                label="UID"
                InputProps={{
                  readOnly: true,
                }}
                sx={{ width: '300px' }}
              />
            </div>
            <div>
              <TextField
                variant="outlined"
                defaultValue={modalUser.uname}
                margin="normal"
                label="이름"
                sx={{ width: '300px' }}
              />
            </div>
            <div>
              <TextField
                variant="outlined"
                defaultValue={modalUser.tel}
                margin="normal"
                label="전화번호"
                sx={{ width: '300px' }}
              />
            </div>
            <div>
              <TextField
                variant="outlined"
                defaultValue={modalUser.brith}
                margin="normal"
                label="생년월일"
                sx={{ width: '300px' }}
              />
            </div>
            <div>
              <TextField
                variant="outlined"
                defaultValue={modalUser.status}
                margin="normal"
                label="계정 활성화 상태"
                sx={{ width: '300px' }}
              />
            </div>
            <Button onClick={handleProfileSave}>저장</Button>
            <Button onClick={handleModalClose}>취소</Button>
          </div>
        )}
      </Modal>
    </>
  );
}

UserTableRow.propTypes = {
  handleClick: PropTypes.func,
  selected: PropTypes.any,
};
