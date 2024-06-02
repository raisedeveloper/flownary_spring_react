import { Card, Checkbox, Typography, FormGroup, FormControlLabel, TextField, Button } from "@mui/material";
import Done from '@mui/icons-material/Done';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { GetWithExpiry } from "api/LocalStorage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodoList } from "api/axiosGet";
import { wrong } from "api/alert";
import { updateTodoList } from "api/axiosPost";
import { updateTodo } from "api/axiosPost";
import { deleteTodo } from "api/axiosPost";

export default function TodoList() {
  const uid = GetWithExpiry("uid");
  const queryClient = useQueryClient();

  const [nowList, setNowList] = useState([]);

  const { data: dataList, isLoading, error } = useQuery({
    queryKey: ['todoList', uid],
    queryFn: () => getTodoList(uid),
  });

  const [newItemText, setNewItemText] = useState('');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const addItem = () => {
    if (dataList.length < 7 && newItemText.trim() !== '') {
      const newItem = {
        tid: dataList.data.tid,
        uid: uid,
        contents: newItemText,
        pri: 0
      };
      setdataList(prevItems => [...prevItems, newItem]);
      setNewItemText('');
    } else {
      wrong("Todo는 7개까지만 가능합니다.");
    }
  };

  const removeItem = async (tid) => {
    try {
      await deleteTodo(tid); // 항목 삭제 API 호출
      queryClient.invalidateQueries(['todoList', uid]); // 캐시 무효화
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // const updateItem = async ()

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ height: "90%", boxShadow: "none", backgroundColor: 'beige' }}>
        <MDBox pt={3} px={3}>
          <MDTypography variant="h6" fontWeight="medium">
            최대 7개 - 해야할 일!
          </MDTypography>
        </MDBox>
        <MDBox pt={3} px={3}>
          <FormGroup>
            {dataList && dataList.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <FormControlLabel
                  control={<Checkbox />}
                  label={item.contents}
                  onChange={() => console.log('Checkbox clicked:', item.contents)}

                />
                {/* <Button color="primary" onClick={updateItem(nowList.tid)}>수정</Button> */}
                <Button color="primary" onClick={() => removeItem(item.tid)}>삭제</Button>
                <br />
              </div>
            ))}
          </FormGroup>
        </MDBox>
        <br />
      </Card>
      <TextField
        placeholder="새로운 할 일 추가"
        value={newItemText}
        onChange={e => setNewItemText(e.target.value)}
      />
      <Button onClick={addItem()}>추가</Button>
    </DashboardLayout>
  );
}
