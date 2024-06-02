import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, Box, Button } from '@mui/material';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { getFamilyUserList } from 'api/axiosGet';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { 
    field: 'profile', headerName: '프로필', width: 100,
    renderCell: (params) => (
      <Box>
        {params.value && <Avatar src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${params.value}`} />}
      </Box>
    ),
  },
  {
    field: 'name', headerName: '이름', width: 130,
    renderCell: (params) => (
      <Box>
        {params.row.status === 2 && <FontAwesomeIcon icon={faCrown} style={{ color: 'orange' }} />} {/* ID가 1일 때만 왕관 아이콘을 표시 */}
        {params.value}
      </Box>
    ),
  },
  {
    field: 'status', headerName: '구성원', width: 100,
    renderCell: (params) => (
      <Box>
        {params.value === 2 && '패밀리장'}
        {params.value === 1 && '관리자'}
        {params.value === 0 && '소속원'}
      </Box>
    )
  },
  { field: 'regTime', headerName: '가입시간', width: 200 },

];

const rows = [
  { id: 1, lastName: 'Snow', nickname: 'nick', status: '방장' },
  { id: 2, lastName: 'Lannister', nickname: 'Cersei', status: '가족' },
  { id: 3, lastName: 'Lannister', nickname: 'Jaime', status: '가족' },
  { id: 4, lastName: 'Stark', nickname: 'Arya', status: '가족' },
  { id: 5, lastName: 'Targaryen', nickname: 'Daenerys', status: '가족' },
  { id: 6, lastName: 'Melisandre', nickname: 'james', status: '가족' },
  { id: 7, lastName: 'Clifford', nickname: 'Ferrara', status: '가족' },
  { id: 8, lastName: 'Frances', nickname: 'Rossini', status: '가족' },
  { id: 9, lastName: 'Roxie', nickname: 'Harvey', status: '가족' },
  { id: 10, lastName: 'Roxie', nickname: 'Harvey', status: '가족' },
];



function FamilyUserList(props) {
  const faid = props.faid;

  if (faid === -1)  {
    return (
      <Box sx={{ height: 400, width: '100%' }}>
        <Box>
          데이터가 없습니다
        </Box>
      </Box>
    )
  }

  const { data: familyUserList, isLoading, isError } = useQuery({
    queryKey: ['familyuserlist', faid],
    queryFn: () => getFamilyUserList(faid),
  })

  if (isLoading)  {
    return (
      <Box sx={{ height: 400, width: '100%' }}>
        <Box>
          로딩 중...
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Box>
        <DataGrid
          rows={familyUserList}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </Box>
    </Box>
  );
}

FamilyUserList.propTypes = {
  faid: PropTypes.number,
}

export default FamilyUserList;