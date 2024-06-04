import React, { useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
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
import Iconify from '../../../components/iconify';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDeclarationList, getBoardList } from "api/axiosGet";
import { DataGrid } from '@mui/x-data-grid';

export default function AdminBoardList({ selected, handleClick }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(1);
  const [currentUserId, setCurrentUserId] = useState('');
  const rowsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const [value, setValue] = useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setCurrentUserId('')
  };

  // 보드 리스트
  const { data: boards, isLoading, isError } = useQuery({
    queryKey: ['boards'],
    queryFn: () => getBoardList(0, 'title', '', '', searchTerm, 1, -1),
    // count를 0으로 설정하여 모든 데이터 가져오기
  });

  // 신고 보드
  const { data: declaration } = useQuery({
    queryKey: ['boards2'],
    queryFn: () => getDeclarationList(),
  });

  // 데이터 가져오기 후 콘솔 로그 추가
  // console.log('Boards 데이터가 있나? :', boards);

  // 검색어가 존재하면 필터링된 데이터, 그렇지 않으면 전체 데이터를 반환
  const filteredBoards = searchTerm
    ? boards?.filter(board =>
      board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : boards || [];

  const filteredDeclaration = searchTerm
    ? declaration?.filter(decl =>
      decl.dTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      decl.uid.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : declaration || [];

    const formatDate = (dateString) => {
      return dateString.replace('T', ' ');
    };


  const rowsDeclaration = filteredDeclaration.map((data, index) => ({
    id: index,
    bid: data.bid ? (data.bid + "번") : null,
    uid: data.uid,
    dTitle: data.dTitle,
    dContents: data.dContents,
       modTime: formatDate(data.modTime),
    state: data.state,
  }));

  const columnsDeclaration = [
    { field: 'bid', headerName: '게시글 번호', flex: 1 },
    { field: 'uid', headerName: '사용자 번호', flex: 1 },
    { field: 'dTitle', headerName: '제목', flex: 1 },
    { field: 'dContents', headerName: '내용', flex: 1 },
    { field: 'modTime', headerName: '등록 일자', flex: 1 },
    { field: 'state', headerName: '처리 상태', flex: 1 },
  ];

  const rowsBoards = filteredBoards.map((data, index) => ({
    id: index,
    bid: data.bid + "번",
    nickname: data.nickname,
    title: data.title,
    bContents: data.bContents,
    modTime: formatDate(data.modTime),
  }));


  const columnsBoards = [
    { field: 'bid', headerName: '글번호', flex: 1 },
    { field: 'nickname', headerName: '닉네임', flex: 1 },
    { field: 'title', headerName: '제목', flex: 2 },
    { field: 'bContents', headerName: '내용', flex: 3 },
    { field: 'modTime', headerName: '등록 일자', flex: 3 },
  ];


  return (
    <DashboardLayout>
      <DashboardNavbar />

      <br />
      <Box sx={{ width: '100%', p: 4 }}>
        <div>
          <Typography id="modal-modal-title" variant="h6" component="div">
            <TextField
              sx={{ ml: 40, mb: 3 }}
              label="Search"
              variant="outlined"
              onChange={handleSearch}
            />
          </Typography>
        </div>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="one" label="신고글 목록" />
          <Tab value="two" label="게시글 목록" />
        </Tabs>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {(value === 'one') ? (
            <div style={{ padding: '2rem' }}>
              <Typography variant="h4" > 신고글 목록 </Typography>
              <Stack direction="column" alignItems="center" justifyContent="space-between" mb={5}>

                <div style={{ height: 450, width: '100%' }}>
                  <DataGrid                    
                    rows={rowsDeclaration}
                    columns={columnsDeclaration}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                      },
                      sorting: {
                        sortModel: [{ field: 'modTime', sort: 'asc' }],
                      },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                  />
                </div>

                <Popover
                  open={!!open}
                  anchorEl={open}
                  onClose={handleCloseMenu}
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: { width: 200 },
                  }}
                >
                  <MenuItem style={{ width: '100%' }}>
                    <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                    유저프로필 수정
                  </MenuItem>

                  <MenuItem sx={{ color: 'error.main' }}>

                  </MenuItem>
                </Popover>
              </Stack>
            </div>
          ) : (
            <div style={{ padding: '2rem' }}>
              <Typography variant="h4" > 게시글 목록 </Typography>
              <Stack direction="column" alignItems="center" justifyContent="space-between" mb={5}>


                <div style={{ height: 400, width: '75vw' }}>
                  <DataGrid
                    rows={rowsBoards}
                    columns={columnsBoards}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                      },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                  />
                </div>

                <Popover
                  open={!!open}
                  anchorEl={open}
                  onClose={handleCloseMenu}
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: { width: 200 },
                  }}
                >
                  <MenuItem style={{ width: '100%' }}>
                    <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                    유저프로필 수정
                  </MenuItem>

                  <MenuItem sx={{ color: 'error.main' }}>

                  </MenuItem>
                </Popover>
              </Stack>
            </div>
          )}
        </Typography>
      </Box>
    </DashboardLayout>
  );
}

AdminBoardList.propTypes = {
  handleClick: PropTypes.func,
  selected: PropTypes.any,
};
