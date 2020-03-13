// API URL's
const fetchAllChannels = `https://api.sr.se/api/v2/channels?format=json`

// Channel ID's p1 = 132, p2 = 163, p3 = 164

// DOM Selectors all channels
const channelInfo = document.getElementById('channelInfo')
const channelDescription = document.getElementById('channelDescription')
const scheduleInfo = document.getElementById('scheduleInfo')
const channelAudio = document.getElementById('channelAudio')
const channelSchedule = document.getElementById('channelSchedule')
const seeChannelSchedule = document.getElementById('seeChannelSchedule')


// DOM Selectors for schedule for a specific channel
const scheduleContainer = document.getElementById('scheduleContainer')
const displaySchedule = document.getElementById('displaySchedule')

document.getElementById("scheduleContainer").classList.remove('schedule-container')


// Fetch all channels

fetch(fetchAllChannels)
  .then((response) => {
    return response.json()
  })
  .then((channelArray) => {

    console.log(channelArray)

    //Filter array to only show P1, P2 and P3
    const filteredChannels = channelArray.channels.filter(item => item.id === 132 || item.id === 163 || item.id === 164)
    console.log(filteredChannels)


    filteredChannels.forEach((channel) => {

      let channelId = channel.id
      const description = channel.tagline
      const image = channel.image
      const audio = channel.liveaudio.url
      const channelName = channel.name


      // Print information to DOM
      channelInfo.innerHTML +=
        `
        <div class="channel-image" id="channelImg">
        <img src="${image}" alt="Logo for radio channel">
        </div>
        `

      // API URL to fetch program that sends right now for each channel
      const fetchProgramRightNow = `https://api.sr.se/api/v2/scheduledepisodes/rightnow?format=json&channelid=${channelId}`


      fetch(fetchProgramRightNow)
        .then((response) => {
          return response.json()
        })
        .then((rightNowArray) => {

          console.log(rightNowArray)
          console.log(channelName)
          console.log(channelId)

          const titleNow = rightNowArray.channel.currentscheduledepisode.title
          const descrNow = rightNowArray.channel.currentscheduledepisode.description

          //Print information to DOM about program that plays now and button to see whole schedule

          scheduleInfo.innerHTML +=
            `<div class="container">
              <div class="channel-program-now" id="channelProgramNow">
              <p>Spelas nu: ${titleNow} <br>
              <audio src="${audio}" controls></audio></p>
              </div>
              <div class="channel-schedule" id="channelSchedule">
              <button id="${channelName}" class="${channelName}">Se tablå ${channelName} >></button>
              </div>
              </div>
              `

          // Function to see specific channel schedule when button is clicked
          const getTodaysChannelSchedule = (channel) => {

            const UrlTodaysSchedule = `http://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=${channel}`

            fetch(UrlTodaysSchedule)
              .then((response) => {
                return response.json()
              })
              .then((todaysSchedule) => {

                console.log(channelName)
                console.log(channelId)

                const todaysScheduleArray = todaysSchedule.schedule
                console.log(todaysScheduleArray)

                document.getElementById("scheduleContainer").classList.add("schedule-container")


                // forEach to get values for each episode
                todaysScheduleArray.forEach((program) => {

                  //Transform start time from string to hours and minutes
                  const startTimeUtc = program.starttimeutc
                  const startTime = new Date(Number(startTimeUtc.match(/^\/Date\((\d+)\)\/$/)[1]))
                  const programStart = startTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })

                  const programTitle = program.title
                  const programImage = program.imageurl
                  const programDescription = program.description

                  //Change information in DOM
                  document.getElementById('headingSchedule').innerHTML = `Radio tablå kanal ${program.channel.name}`
                  //document.getElementById('secondNextDay').innerHTML = `${getDates('daySecondNext')}`

                  document.getElementById('tab').innerHTML =
                    `
                  <button>Idag</button>
                  <button id="tomorrowButton">Imorgon</button>
                  <button class="second-next-day" id="secondNextDay">${getDates('daySecondNext')}</button>
                  `

                  // Print information to DOM
                  displaySchedule.innerHTML +=
                    `
                    <div class="episode" id="episode">
                    <p>${programStart}</p>
                    <img src="${programImage}" alt="">
                    <p class="program-title">${programTitle}</p>
                    <p class="program-description">${programDescription}</p>
                    </div>
                    `
                  // End tag for each scheduleArray
                })

                //End tag fetch UrlTodaysSchedule
              })



            //End tag function getTodaysChannelSchedule
          }


          //Invoke function when clicking button
          document.getElementById(`${channelName}`).addEventListener("click", () => getTodaysChannelSchedule(channelId))

          // Function to see specific channel schedule for tomorrow when button is clicked
          const getTomorrowsChannelSchedule = (channel) => {

            console.log('getTomorrowsChannelSchedule')

            const urlTomorrowsSchedule = `http://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=164&date=2020-03-14`
            //const urlTomorrowsSchedule = `http://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=${channelId}&date=${getDates('dateTomorrow')}`

            fetch(urlTomorrowsSchedule)
              .then((response) => {
                return response.json()
              })
              .then((tomorrowsSchedule) => {

                console.log('urlTomorrowsSchedule')
                console.log(channelName)
                console.log(channelId)

                const tomorrowsScheduleArray = tomorrowsSchedule.schedule

                // forEach to get values for each episode
                tomorrowsScheduleArray.forEach((program) => {

                  //Transform start time from string to hours and minutes
                  const tomorrowStartTimeUtc = program.starttimeutc
                  const tomorrowStartTime = new Date(Number(startTimeUtc.match(/^\/Date\((\d+)\)\/$/)[1]))
                  const tomorrowProgramStart = startTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })

                  const tomorrowProgramTitle = program.title
                  const tomorrowProgramImage = program.imageurl

                  // Print information to DOM
                  displaySchedule.innerHTML +=
                    `
                    <div class="episode" id="episode">
                    <p>${tomorrowProgramStart}</p>
                    <img src="${tomorrowProgramImage}" alt="">
                    <p>${tomorrowProgramTitle}</p>
                    </div>
                    `
                  // End tag for each tomorrowsScheduleArray
                })

                //End tag fetch urlTomorrowsSchedule
              })

            //End tag function getTomorrowsChannelSchedule
          }


          //Invoke function when clicking button
          document.getElementById('tomorrowButton').addEventListener("click", () => getTomorrowsChannelSchedule(channelId))

          // End tag for fetch of fetchProgramRightNow
        })


      //End tag filteredChannels.forEach
    });

    // End tag fetchAllChannels
  })




// Get dates for today, tomorrow and the second next day in format yyyy-mm-dd
const getDates = (dag) => {

  //Todays date
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const yyyy = today.getFullYear()

  let mm = month
  let dd = day

  if (month < 10) {
    mm = '0' + month
  }

  if (day < 10) {
    dd = '0' + day
  }

  const todaysDate = `${yyyy}-${mm}-${dd}`

  //Tomorrows date 
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const tomorrowYear = tomorrow.getFullYear()
  const tomorrowMonth = tomorrow.getMonth() + 1
  const tomorrowDay = tomorrow.getDate()

  let tmm = tomorrowMonth
  let tdd = tomorrowDay

  if (tomorrowMonth < 10) {
    tmm = '0' + tomorrowMonth
  }

  if (tomorrowDay < 10) {
    tdd = '0' + tomorrowDay
  }

  const tomorrowsDate = `${tomorrowYear}-${tmm}-${tdd}`

  //Second next days date
  const secondNext = new Date(tomorrow)
  secondNext.setDate(tomorrow.getDate() + 1)

  const weekdayLong = secondNext.toLocaleDateString('sv-SE', { weekday: 'long' })

  const secondNextYear = secondNext.getFullYear()
  const secondNextMonth = secondNext.getMonth() + 1
  const secondNextDay = secondNext.getDate()

  let smm = secondNextMonth
  let sdd = secondNextDay

  if (secondNextMonth < 10) {
    smm = '0' + secondNextMonth
  }

  if (secondNextDay < 10) {
    sdd = '0' + secondNextDay
  }

  const secondNextDate = `${secondNextYear}-${smm}-${sdd}`

  if (dag === 'dateToday') {
    return todaysDate
  } else if (dag === 'dateTomorrow') {
    return tomorrowsDate
  } else if (dag === 'dateSecondNext') {
    return secondNextDate
  } else if (dag === 'daySecondNext')
    return weekdayLong.charAt(0).toUpperCase() + weekdayLong.slice(1)

}

console.log(getDates('dateToday'))
console.log(getDates('dateTomorrow'))
console.log(getDates('dateSecondNext'))
console.log(getDates('daySecondNext'))



/*

// Function to see specific channel schedule for tomorrow when button is clicked
          const getTomorrowsChannelSchedule = (channel) => {

            console.log('getTomorrowsChannelSchedule')

            const urlTomorrowsSchedule = `http://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=164&date=2020-03-14`
            //const urlTomorrowsSchedule = `http://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=${channelId}&date=${getDates('dateTomorrow')}`

            fetch(urlTomorrowsSchedule)
              .then((response) => {
                return response.json()
              })
              .then((tomorrowsSchedule) => {

                console.log('urlTomorrowsSchedule')
                console.log(channelName)
                console.log(channelId)

                const tomorrowsScheduleArray = tomorrowsSchedule.schedule

                // forEach to get values for each episode
                tomorrowsScheduleArray.forEach((program) => {

                  //Transform start time from string to hours and minutes
                  const tomorrowStartTimeUtc = program.starttimeutc
                  const tomorrowStartTime = new Date(Number(startTimeUtc.match(/^\/Date\((\d+)\)\/$/)[1]))
                  const tomorrowProgramStart = startTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })

                  const tomorrowProgramTitle = program.title
                  const tomorrowProgramImage = program.imageurl

                  // Print information to DOM
                  displaySchedule.innerHTML +=
                    `
                    <div class="episode" id="episode">
                    <p>${tomorrowProgramStart}</p>
                    <img src="${tomorrowProgramImage}" alt="">
                    <p>${tomorrowProgramTitle}</p>
                    </div>
                    `
                  // End tag for each tomorrowsScheduleArray
                })

                //End tag fetch urlTomorrowsSchedule
              })

            //End tag function getTomorrowsChannelSchedule
          }


          //Invoke function when clicking button
          document.getElementById(`tomorrowButton`).addEventListener("click", () => getTomorrowsChannelSchedule(channelId))

          */








