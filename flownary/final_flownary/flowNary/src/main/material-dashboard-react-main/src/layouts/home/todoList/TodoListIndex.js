import {
  Card,
  Checkbox,
  Typography,
  FormGroup,
  FormControlLabel,
  TextField,
  Button,
  Stack,
  Grid,
  Popover,
  MenuItem,
  IconButton,
  List,
  ListItem,
} from "@mui/material";
import Done from "@mui/icons-material/Done";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { GetWithExpiry } from "api/LocalStorage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodoList } from "api/axiosGet";
import { wrong } from "api/alert";
import { updateTodoList, updateTodo, deleteTodo, insertTodo } from "api/axiosPost";
import Iconify from "components/iconify";
import PropTypes from "prop-types"; // PropTypes 추가

export default function TodoList() {
  const uid = GetWithExpiry("uid");
  const queryClient = useQueryClient();

  const [nowList, setNowList] = useState([]);
  const [update, setUpdate] = useState(0);
  const [newItemText, setNewItemText] = useState("");
  const [updateText, setUpdateText] = useState("");
  const [updateStates, setUpdateStates] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentEditIdx, setCurrentEditIdx] = useState(null);

  const handleOpenMenu = (event, idx) => {
    setAnchorEl(event.currentTarget);
    setCurrentEditIdx(idx);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCurrentEditIdx(null);
  };

  const { data: dataList, isLoading, error } = useQuery({
    queryKey: ["todoList", uid],
    queryFn: () => getTodoList(uid),
  });

  useEffect(() => {
    if (dataList) {
      setUpdateStates(dataList.map(() => false));
    }
  }, [dataList]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const addItem = async () => {
    if (!newItemText) {
      wrong("내용을 입력하세요.");
      return;
    }
    if (newItemText.length > 30) {
      wrong("30글자 이하로 적어주세요!");
      return;
    }
    const newItem = {
      uid: uid,
      contents: newItemText,
    };
    await insertTodo(newItem);
    queryClient.invalidateQueries(["todoList", uid]);
    setNewItemText("");
  };

  const handleText = (e) => {
    setNewItemText(e.target.value);
  };

  const handleCheckboxChange = async (idx) => {
    setAnchorEl(null);
    const updatedItem = {
      tid: dataList[idx].tid,
      contents: dataList[idx].contents,
      pri: dataList[idx].pri === 1 ? 0 : 1,
    };

    try {
      await updateTodo(updatedItem);
      queryClient.invalidateQueries(["todoList", uid]);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const removeItem = async (tid) => {
    try {
      await deleteTodo(tid);
      queryClient.invalidateQueries(["todoList", uid]);
      setAnchorEl(!anchorEl);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const updateItem = (idx, contents) => {
    setAnchorEl(!anchorEl);
    setUpdateStates(updateStates.map((state, index) => (index === idx ? true : false)));
    setUpdateText(contents);
  };

  const handleUpdateConfirm = async (idx, tid, pri) => {
    const updatedItem = {
      tid: tid,
      contents: updateText,
      pri: pri,
    };

    try {
      await updateTodo(updatedItem);
      setUpdateStates(updateStates.map((state, index) => (index === idx ? false : state)));
      queryClient.invalidateQueries(["todoList", uid]);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleUpdateText = (idx, e) => {
    setUpdateText(e.target.value);
  };

  function handleKeyPress(event) {
    if (event && event.key === "Enter") {
      event.preventDefault();
      addItem();
    }
  }

  const formatTextWithLineBreaks = (text, maxLength) => {
    let result = "";
    for (let i = 0; i < text.length; i += maxLength) {
      result += text.slice(i, i + maxLength) + "\n\n";
    }
    return result.trim();
  };

  return (
    <>
      <MDBox px={3} mt={7}>
        <MDTypography variant="h6" fontWeight="medium">
          To do
        </MDTypography>
      </MDBox>

      <MDBox pt={3} px={3}>
        <FormGroup>
          {dataList &&
            dataList.map((item, idx) => (
              <Grid
                container
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: "5rem",
                }}
              >
                <Grid item xs={11}>
                  {!updateStates[idx] ? (
                    <>
                      <FormControlLabel
                        control={<Checkbox checked={item.pri === 1} onChange={() => handleCheckboxChange(idx)} />}
                        label={
                          <pre
                            style={{
                              display: "flex",
                              alignItems: "center",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {formatTextWithLineBreaks(item.contents, 16)}
                          </pre>
                        }
                      />
                    </>
                  ) : (
                    <>
                      <TextField
                        value={updateText}
                        onChange={(e) => handleUpdateText(idx, e)}
                        sx={{ width: "60%" }}
                        variant="outlined"
                        fullWidth
                      />
                      <Button
                        color="info"
                        sx={{ ml: 2, mt: 0.3 }}
                        onClick={() => handleUpdateConfirm(idx, item.tid, item.pri)}
                        style={{ color: "lightcoral" }}
                      >
                        확인
                      </Button>
                    </>
                  )}
                </Grid>
                <Grid item xs={1}>
                  <div style={{ flexGrow: 1 }}>
                    <IconButton
                      width={20}
                      color={anchorEl && currentEditIdx === idx ? "inherit" : "default"}
                      onClick={(e) => handleOpenMenu(e, idx)}
                    >
                      <Iconify icon="eva:more-vertical-fill" width={20} sx={{ textDecoration: "none" }} />
                    </IconButton>
                    <Popover
                      open={Boolean(anchorEl && currentEditIdx === idx)}
                      anchorEl={anchorEl}
                      onClose={handleCloseMenu}
                      anchorOrigin={{ vertical: "top", horizontal: "left" }}
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
                      PaperProps={{
                        style: {
                          marginRight: 90,
                          backgroundColor: "white",
                          width: "8rem",
                        },
                      }}
                    >
                      <List>
                        <ListItem onClick={() => handleCheckboxChange(idx)}>
                          <Iconify icon="icon-park:check-correct" style={{ marginRight: 2 }} />
                          완료
                        </ListItem>
                        <ListItem onClick={() => updateItem(idx, item.contents)}>
                          <Iconify icon="lucide:edit" style={{ marginRight: 2 }} />
                          수정
                        </ListItem>
                        <ListItem onClick={() => removeItem(item.tid)} sx={{ color: "error.main" }}>
                          <Iconify icon="solar:trash-bin-trash-bold" style={{ marginRight: 2 }} />
                          삭제
                        </ListItem>
                      </List>
                    </Popover>
                  </div>
                </Grid>
              </Grid>
            ))}
        </FormGroup>
      </MDBox>

      <Grid sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 3 }}>
        <Grid>
          <TextField
            placeholder="새로운 할 일 추가"
            value={newItemText}
            onChange={handleText}
            style={{ width: "100%", marginLeft: "auto" }}
            onKeyUp={handleKeyPress}
          />
        </Grid>
        <Grid>
          <Button onClick={addItem} style={{ color: "lightcoral" }}>
            추가
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

TodoList.propTypes = {
  dataList: PropTypes.arrayOf(
    PropTypes.shape({
      tid: PropTypes.number.isRequired,
      contents: PropTypes.string.isRequired,
      pri: PropTypes.number.isRequired,
    })
  ),
  updateStates: PropTypes.arrayOf(PropTypes.bool),
  anchorEl: PropTypes.object,
  currentEditIdx: PropTypes.number,
  newItemText: PropTypes.string,
  updateText: PropTypes.string,
};

TodoList.defaultProps = {
  dataList: [],
  updateStates: [],
  anchorEl: null,
  currentEditIdx: null,
  newItemText: "",
  updateText: "",
};
