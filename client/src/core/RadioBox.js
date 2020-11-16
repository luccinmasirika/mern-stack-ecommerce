import {
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  ListItem,
  Radio,
  RadioGroup,
} from '@material-ui/core'
import React, { useState } from 'react'

const RadioBox = ({ prices, handleFilters }) => {
  const [value, setValue] = useState(0)

  const handleChange = (event) => {
    handleFilters(event.target.value)
    setValue(event.target.value)
  }

  return (
    <CardContent>
      <FormControl component='fieldset'>
        <FormLabel component='legend'>Prices</FormLabel>
        <RadioGroup aria-label='prices'>
          {prices.map((p, i) => (
            <FormControlLabel
              value={`${p._id}`}
              name={p}
              onChange={handleChange}
              control={<Radio />}
              label={p.name}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </CardContent>
  )
}

export default RadioBox
