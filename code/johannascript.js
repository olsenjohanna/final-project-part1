// Fetch todays schedule for a specific channel

const UrlTodaysSchedule = `http://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=${channelId}`

//Global variable
let todaysScheduleArray

fetch(UrlTodaysSchedule)
  .then(response => {
    return response.json()
  })
  .then(todaysSchedule => {

    // Save todaysschedule array in a global variable

    todaysScheduleArray = todaysSchedule.schedule

    seeChannelSchedule(todaysScheduleArray)
  })


// Function to print todays schedule when pressing on button for "tablå"
const seeChannelSchedule = todaysSchedule => {

  // Add styling for schedule container
  document.getElementById('scheduleContainer').classList.add('schedule-container')

  // Clear DOM before adding new information about channel schedule
  displaySchedule.innerHTML = ''

  // forEach to get values for each episode
  todaysScheduleArray.forEach(program => {

    //Transform start time from string to hours and minutes
    const startTimeUtc = program.starttimeutc
    const startTime = new Date(Number(startTimeUtc.match(/^\/Date\((\d+)\)\/$/)[1]))
    const programStart = startTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })

    selectedChannel = program.channel.name

    //Change information in DOM
    document.getElementById('headingSchedule').innerHTML = `Radio tablå kanal ${selectedChannel}`

    // Tabs/buttons for the different days
    document.getElementById('tab').innerHTML =
      `
               <button id="todayButton${selectedChannel}">Idag</button>
               <button id="tomorrowButton${selectedChannel}">Imorgon</button>
               <button id="secondNextDayButton${selectedChannel}">${getDates('daySecondNext')}</button>
               `

    // Print information to DOM about the channel schedule for today
    displaySchedule.innerHTML +=
      `
                 <div class="episode" id="episode">
                 <div class="episode-information">
                 <p class="episode-start-time">${programStart}</p>
                 <img src="${program.imageurl}" alt="">
                 <p class="program-title">${program.title}</p>
                 </div>
                 <div class="episode-description">
                 <p>${program.description}</p>
                 </div>
                 </div>
                 `

    // Make todays tab/button active when pressing on button for "tablå"
    if (selectedChannel === 'P1') {
      document.getElementById('todayButtonP1').classList.add('active')
    } else if (selectedChannel === 'P2') {
      document.getElementById('todayButtonP2').classList.add('active')
    } else if (selectedChannel === 'P3') {
      document.getElementById('todayButtonP3').classList.add('active')
    }

    // When info and buttons are created, add event listeners to them, delay 0,5 sec
    setTimeout(() => addEventListenerToButton(`todayButton${selectedChannel}`, program.channel.id, 'Tomorrow'), 500)
    setTimeout(() => addEventListenerToButton(`tomorrowButton${selectedChannel}`, program.channel.id, 'Tomorrow'), 500)
    setTimeout(() => addEventListenerToButton(`secondNextDayButton${selectedChannel}`, program.channel.id, 'SecondNextDay'), 500)

  }


// Function to print todays schedule when pressing on tab for today
const getTodaysChannelSchedule = todaysSchedule => {

    // Make todays tab/button active when showing todays schedule
    if (selectedChannel === 'P1') {
      document.getElementById('todayButtonP1').classList.add('active')
      document.getElementById('tomorrowButtonP1').classList.remove('active')
      document.getElementById('secondNextDayButtonP1').classList.remove('active')
    } else if (selectedChannel === 'P2') {
      document.getElementById('todayButtonP2').classList.add('active')
      document.getElementById('tomorrowButtonP2').classList.remove('active')
      document.getElementById('secondNextDayButtonP2').classList.remove('active')
    } else if (selectedChannel === 'P3') {
      document.getElementById('todayButtonP3').classList.add('active')
      document.getElementById('tomorrowButtonP3').classList.remove('active')
      document.getElementById('secondNextDayButtonP3').classList.remove('active')
    }

    // Clear DOM before adding new information about channel schedule
    displaySchedule.innerHTML = ''

    // forEach to get values for each episode
    todaysSchedule.forEach(program => {

      //Transform start time from string to hours and minutes
      const startTime = new Date(Number(program.starttimeutc.match(/^\/Date\((\d+)\)\/$/)[1]))
      const programStart = startTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })

      selectedChannel = program.channel.name

      // Print information to DOM about the channel schedule for today
      displaySchedule.innerHTML +=
        `
                    <div class="episode" id="episode">
                    <div class="episode-information">
                    <p class="episode-start-time">${programStart}</p>
                    <img src="${program.imageurl}" alt="">
                    <p class="program-title">${program.title}</p>
                    </div>
                    <div class="episode-description">
                    <p>${program.description}</p>
                    </div>
                    </div>
                    `
      // End tag for each scheduleArray
    })

    //End tag function getTodaysChannelSchedule
  }


  // Fetch tomorrows schedule
  const urlTomorrowsSchedule = `http://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=${channel}&date=${getDates('dateTomorrow')}`

  let tomorrowsScheduleArray

  fetch(urlTomorrowsSchedule)
    .then((response) => {
      return response.json()
    })
    .then((tomorrowsSchedule) => {

      console.log('tomorrowsSchedule', tomorrowsSchedule.pagination)
      console.log('tomorrowsSchedule', tomorrowsSchedule.pagination.nextpage)

      tomorrowsScheduleArray = tomorrowsSchedule.schedule

      getTomorrowsChannelSchedule(tomorrowsScheduleArray)

    })

  const getTomorrowsChannelSchedule = (channel) => {

    // Clear DOM before adding new information about channel schedule 
    displaySchedule.innerHTML = ''

    // Make tomorrows tab/button active when showing todays schedule
    if (selectedChannel === 'P1') {
      document.getElementById('todayButtonP1').classList.remove('active')
      document.getElementById('tomorrowButtonP1').classList.add('active')
      document.getElementById('secondNextDayButtonP1').classList.remove('active')
    } else if (selectedChannel === 'P2') {
      document.getElementById('todayButtonP2').classList.remove('active')
      document.getElementById('tomorrowButtonP2').classList.add('active')
      document.getElementById('secondNextDayButtonP2').classList.remove('active')
    } else if (selectedChannel === 'P3') {
      document.getElementById('todayButtonP3').classList.remove('active')
      document.getElementById('tomorrowButtonP3').classList.add('active')
      document.getElementById('secondNextDayButtonP3').classList.remove('active')
    }

    // forEach to get values for each episode
    tomorrowsScheduleArray.forEach((program) => {

      //Transform start time from string to hours and minutes
      const tomorrowStartTime = new Date(Number(program.starttimeutc.match(/^\/Date\((\d+)\)\/$/)[1]))
      const tomorrowProgramStart = tomorrowStartTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })

      // Print information to DOM
      displaySchedule.innerHTML +=
        `
             <div class="episode" id="episode">
              <div class="episode-information">
              <p class="episode-start-time">${tomorrowProgramStart}</p>
              <img src="${program.imageurl}" alt="">
              <p class="program-title">${program.title}</p>
              </div>
              <div class="episode-description">
              <p>${program.description}</p>
              </div>
              </div>
     `

      // End tag for each tomorrowsScheduleArray
    })

    //End tag function getTomorrowsChannelSchedule
  }


  // Fetch second next days schedule
  const urlSecondNextDaySchedule = `http://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=${channel}&date=${getDates('dateSecondNext')}`

  let secondNextDayScheduleArray

  fetch(urlSecondNextDaySchedule)
    .then((response) => {
      return response.json()
    })
    .then((secondNextDaySchedule) => {

      secondNextDayScheduleArray = secondNextDaySchedule.schedule

      getSecondNextDayChannelSchedule(secondNextDayScheduleArray)
    })


  // Function for get channel schedule for second next day
  const getSecondNextDayChannelSchedule = (channel) => {

    // Make tomorrows tab/button active when showing todays schedule
    if (selectedChannel === 'P1') {
      document.getElementById('todayButtonP1').classList.remove('active')
      document.getElementById('tomorrowButtonP1').classList.remove('active')
      document.getElementById('secondNextDayButtonP1').classList.add('active')
    } else if (selectedChannel === 'P2') {
      document.getElementById('todayButtonP2').classList.remove('active')
      document.getElementById('tomorrowButtonP2').classList.remove('active')
      document.getElementById('secondNextDayButtonP2').classList.add('active')
    } else if (selectedChannel === 'P3') {
      document.getElementById('todayButtonP3').classList.remove('active')
      document.getElementById('tomorrowButtonP3').classList.remove('active')
      document.getElementById('secondNextDayButtonP3').classList.add('active')
    }


    // Clear DOM before adding new information about channel schedule
    displaySchedule.innerHTML = ''

    // forEach to get values for each episode
    secondNextDayScheduleArray.forEach((program) => {

      //Transform start time from string to hours and minutes
      const secondNextDayStartTime = new Date(Number(program.starttimeutc.match(/^\/Date\((\d+)\)\/$/)[1]))
      const secondNextDayProgramStart = secondNextDayStartTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })

      // Print information to DOM
      displaySchedule.innerHTML +=
        `
               <div class="episode" id="episode">
               <div class="episode-information">
               <p class="episode-start-time">${secondNextDayProgramStart}</p>
               <img src="${program.imageurl}" alt="">
               <p class="program-title">${program.title}</p>
               </div>
               <div class="episode-description">
               <p>${program.description}</p>
               </div>
               </div>
               `

      // End tag for each secondNextDayScheduleArray
    })

    //End tag function getSecondNextDayChannelSchedule
  }