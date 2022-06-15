import React, { useState } from 'react'
import helper from '../lib/helpers'
import useImportState from '../hooks/useFormState'

export default function PaceCalculator() {
  const initialState = {
    distance: 0,
    raceHours: 0,
    raceMins: 0,
    raceSecs: 0,
    paceMins: 0,
    paceSecs: 0,
  }
  const [state, setState] = useState(initialState)

  const handleChange = (evt) => {
    const { value, name } = evt.target
    setState({
      ...state,
      [name]: parseFloat(value) || '',
    })
  }

  const calculate = () => {
    if (helper.hasFinishTimeBeenEntered(state)) {
      const pace = helper.calculatePace(state)
      setState({
        ...state,
        ...pace,
      })
    } else {
      const finishTime = helper.calculateFinishTime(state)
      setState({
        ...state,
        ...finishTime,
      })
    }
  }

  const enableCalculateButton = () => {
    // check that distance and race time or pace is populated
    return (
      state.distance &&
      (state.raceHours ||
        state.raceMins ||
        state.raceSecs ||
        state.paceMins ||
        state.paceSecs)
    )
  }

  return (
    <>
      <div className='Distance-section'>
        <span>Distance</span>
        <select
          name='distance'
          id='distance'
          onChange={handleChange}
          defaultValue={0}
        >
          <option value='0'>Please Select a race distance</option>
          <option value='3.1'>5k</option>
          <option value='6.2'>10k</option>
          <option value='10'>10 miles</option>
          <option value='13.1'>Half marathon</option>
          <option value='26.2'>Marathon</option>
        </select>
      </div>
      <div>
        <span>Finish Time</span>
        <label htmlFor='hours'>Hours:</label>
        <input
          type='number'
          id='hours'
          name='raceHours'
          min='0'
          max='23'
          value={state.raceHours}
          onChange={handleChange}
        />
        <label htmlFor='mins'>Mins:</label>
        <input
          type='number'
          id='mins'
          name='raceMins'
          min='0'
          max='59'
          value={state.raceMins}
          onChange={handleChange}
        />
        <label htmlFor='seconds'>Seconds:</label>
        <input
          type='number'
          id='seconds'
          name='raceSecs'
          min='0'
          max='59'
          value={state.raceSecs}
          onChange={handleChange}
        />
      </div>
      <div>
        <span>Pace</span>
        <label htmlFor='pacemins'>Mins:</label>
        <input
          type='number'
          id='pacemins'
          name='paceMins'
          value={state.paceMins}
          onChange={handleChange}
        />
        <label htmlFor='paceseconds'>Seconds:</label>
        <input
          type='number'
          id='paceseconds'
          name='paceSecs'
          value={state.paceSecs}
          onChange={handleChange}
        />
      </div>
      <button disabled={!enableCalculateButton()} onClick={calculate}>
        Calculate
      </button>
    </>
  )
}
