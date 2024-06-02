import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import MDTypography from 'components/MDTypography';

function YearSelect({ selectedYear, onChange }) {
  // 년도 목록 생성 (예: 2000년부터 현재 년도까지)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2021 }, (_, index) => 2022 + index).reverse();

  return (
    <>
      <FormControl sx={{ display: 'flex', justifyContent: 'center' }}>
        <MDTypography mt={3} id="year-select-label">
          Year  
          <Select
            labelId="year-select-label"
            id="year-select"
            value={selectedYear}
            onChange={onChange}
            sx={{ width: "8vw", fontSize: 'large', mx:3, p:0.5 }}
          >
            {years.map(year => (
              <MenuItem key={year} value={year} >
                {year > 2022 ? year : "전체"} 년
              </MenuItem>
            ))}
          </Select>
        </MDTypography>

      </FormControl>
    </>
  );
}

YearSelect.propTypes = {
  selectedYear: PropTypes.number.isRequired, // selectedYear가 필수로 제공되어야 함을 지정
  onChange: PropTypes.func.isRequired, // onChange가 함수여야 함을 지정
};

export default YearSelect;
