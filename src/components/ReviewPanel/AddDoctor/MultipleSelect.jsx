import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

 
export default function MultipleSelectCheckmarks({list,selectedIds,setSelectedIds}) {
  

  const handleChange = (event) => {
    setSelectedIds(event.target.value);
  };

  return (
     
      <FormControl fullWidth  margin="normal">
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          fullWidth 
          value={selectedIds}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => 
            selected.map((id) => list?.find((name) => name.id === id).option).join(', ')
          }
          // MenuProps={MenuProps}
        >
          {list?.map((name) => (
            <MenuItem key={name?.id} value={name?.id}>
              <Checkbox checked={selectedIds?.indexOf(name?.id) > -1} />
              <ListItemText primary={name?.option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl> 
  );
}
