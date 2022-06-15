const helpers = {
  calculatePace: function (state) {
    const { distance, raceHours, raceMins, raceSecs } = state
    //sum the given time to a total number of seconds
    const hoursToSeconds = parseInt(raceHours * 60 * 60) || 0
    const minsToSeconds = parseInt(raceMins * 60) || 0
    const seconds = parseInt(raceSecs) || 0
    const totalTimeInSeconds = parseInt(
      hoursToSeconds + minsToSeconds + seconds
    )

    // get number of seconds of split
    const totalTimePerSplit = parseFloat(totalTimeInSeconds / distance)

    this.createSplitTimes(distance, totalTimePerSplit)
    const { mins, secs } = this.convertSecondsToHourMinsSecs(totalTimePerSplit)

    // return pace in mins:secs for updating state
    return { paceMins: mins, paceSecs: secs }
  },
  calculateFinishTime: function (state) {
    // convert the given split time into seconds
    const { distance, paceMins, paceSecs } = state
    const minsToSeconds = parseInt(paceMins * 60) || 0
    const seconds = parseInt(paceSecs) || 0
    const totalTimePerSplit = parseInt(minsToSeconds + seconds)

    // multiply total seconds of the split time by the total distance
    const totalTimeInSeconds = parseInt(totalTimePerSplit * distance)

    // take the newly calculated total race time in seconds and convert back to a hours, mins, seconds format
    const { hours, mins, secs } =
      this.convertSecondsToHourMinsSecs(totalTimeInSeconds)

    return {
      raceHours: hours,
      raceMins: mins,
      raceSecs: secs,
    }
  },
  hasFinishTimeBeenEntered: function (state) {
    const { raceHours, raceMins, raceSecs } = state
    return raceHours || raceMins || raceSecs ? true : false
  },
  convertSecondsToHourMinsSecs: function (seconds, zeroPad) {
    let calculatedHours = Math.floor(seconds / 3600)
    let calculatedMins = Math.floor((seconds % 3600) / 60)
    let calculatedSecs = Math.floor((seconds % 3600) % 60)

    if (zeroPad) {
      calculatedHours = String(calculatedHours).padStart(2, '0')
      calculatedMins = String(calculatedMins).padStart(2, '0')
      calculatedSecs = String(calculatedSecs).padStart(2, '0')
    }
    return {
      hours: calculatedHours,
      mins: calculatedMins,
      secs: calculatedSecs,
    }
  },
  createSplitTimes: function (distance, pace, metric) {
    //number of splits is taken from distance, for example 13.1 will mean 14 splits (13 plus the .1)
    let numberOfSplits = parseInt(distance)

    // calculate average pace per split
    let { mins: intervalMins, secs: intervalSecs } =
      this.convertSecondsToHourMinsSecs(pace, 'zeroPad')

    let splits = []
    for (let i = 1; i <= numberOfSplits; i++) {
      let splitSeconds = pace * i
      const { hours, mins, secs } = this.convertSecondsToHourMinsSecs(
        splitSeconds,
        'zeroPad'
      )
      let splitEntry = {
        split: i,
        interval: `${intervalMins}:${intervalSecs}`,
        cumulative: `${hours}:${mins}:${secs}`,
      }
      splits.push(splitEntry)
    }

    // check for partial split
    let partSplit = parseFloat(distance % 1)
    // if there is partial split
    if (partSplit) {
      let finishTime = pace * distance

      let {
        hours: finishHours,
        mins: finishMins,
        secs: finishSecs,
      } = this.convertSecondsToHourMinsSecs(finishTime)

      let finalEntry = {
        split: numberOfSplits + partSplit,
        interval: `${intervalMins}:${intervalSecs}`,
        cumulative: `${finishHours}:${finishMins}:${finishSecs}`,
      }
      splits.push(finalEntry)
    }

    return splits
  },
}

export default helpers
