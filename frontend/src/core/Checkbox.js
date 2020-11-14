import { FormControlLabel, ListItem } from '@material-ui/core'
import CheckboxMaterial from '@material-ui/core/Checkbox'
import React, { useState } from 'react'

const Checkbox = ({ categories, handleFilters }) => {
  const [checked, setCheked] = useState([])

  const handleToggle = (c) => () => {
    // return the first index or -1
    const currentCategoryId = checked.indexOf(c)
    const newCheckedCategoryId = [...checked]
    // if currently checked was not already in checked state > push
    // else pull/take off
    if (currentCategoryId === -1) {
      newCheckedCategoryId.push(c)
    } else {
      newCheckedCategoryId.splice(currentCategoryId, 1)
    }
    // console.log(newCheckedCategoryId);
    setCheked(newCheckedCategoryId)
    handleFilters(newCheckedCategoryId)
  }

  return categories.map((c, i) => (
    <ListItem key={i}>
      <FormControlLabel
        value={checked.indexOf(c._id === -1)}
        control={<CheckboxMaterial />}
        label={c.name}
        onChange={handleToggle(c._id)}
        labelPlacement='end'
      />
    </ListItem>
  ))
}

export default Checkbox
