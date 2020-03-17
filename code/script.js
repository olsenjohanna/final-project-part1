//Hamburger dropdown menu
const openMenu = () => {
  document.getElementById('menu').classList.toggle('show')
}

document.getElementById('hamburger').addEventListener("click", () => openMenu())


// Scroll to top function
document.getElementById('btnScrollToTop').addEventListener("click", function () {

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  })

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


// DOM Selectors all channels
const channelInfo = document.getElementById('channelInfo')
const scheduleInfo = document.getElementById('scheduleInfo')
const channelSchedule = document.getElementById('channelSchedule')

//Create global variable for channel ID
let selectedChannel = ''

// DOM Selectors for schedule for a specific channel
const scheduleContainer = document.getElementById('scheduleContainer')
const displaySchedule = document.getElementById('displaySchedule')

// Remove styling for schedule-container
document.getElementById("scheduleContainer").classList.remove('schedule-container')

// API URL to fetch all Channels
const fetchAllChannels = `https://api.sr.se/api/v2/channels?format=json`

// Channel ID's p1 = 132, p2 = 163, p3 = 164

// Fetch all channels
let filteredChannels

fetch(fetchAllChannels)
  .then((response) => {
    return response.json()
  })
  .then((channelArray) => {
    console.log('fetchAllChannels')

    //Filter array to only show P1, P2 and P3
    // save filteredChannels to the global variable filteredChannels
    filteredChannels = channelArray.channels.filter(
      item => item.id === 132 || item.id === 163 || item.id === 164
    )

    // Then call the renderChannelCards function to show something in the browser
    renderChannelCards(filteredChannels)
  })


// This function takes care of rendering the cards for each channel
const renderChannelCards = channels => {
  channels.forEach(channel => {
    const { id, tagline, image, liveaudio, name } = channel // destructure from the channel

    // Print information to DOM
    channelInfo.innerHTML += `
    <div class="channel-image"> 
      <img src="${image}" alt="Logo for radio channel">
    </div>
    `

    // Call this function to fetch right now programs for each channel
    renderChannelScheduleInfo(channel)

    // When info and buttons are created, add event listeners to them, delay 0,5 sec
    setTimeout(() => addEventListenerToButton(name, id, 'Today'), 500)
  })
}


// This function fetches programs right now for each channel and renders that part
const renderChannelScheduleInfo = channel => {
  const { id, liveaudio, name } = channel // destructure from the channel

  // API URL to fetch program that sends right now for each channel
  const fetchProgramRightNow = `https://api.sr.se/api/v2/scheduledepisodes/rightnow?format=json&channelid=${id}`


  fetch(fetchProgramRightNow)
    .then(response => {
      return response.json()
    })
    .then(rightNowObject => {

      const titleNow = rightNowObject.channel.currentscheduledepisode.title
      const descrNow = rightNowObject.channel.currentscheduledepisode.description

      //Print information to DOM about program that plays now and button to see whole schedule
      scheduleInfo.innerHTML += `
        <div class="container">
          <div class="channel-program-now" id="channelProgramNow">
          <p>Spelas nu: ${titleNow}</p>
          <audio src="${liveaudio.url}" controls></audio>
          </div>
          <div class="channel-schedule" id="channelSchedule-${id}">
          <button id="${name}" class="${name}">Se tablå ${name} >></button>
          </div>
        </div>
      `
    })
}


// Function to see specific channel schedule when button is clicked
const getTodaysChannelSchedule = channelId => {
  const UrlTodaysSchedule = `http://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=${channelId}`

  fetch(UrlTodaysSchedule)
    .then(response => {
      return response.json()
    })
    .then(todaysSchedule => {

      const todaysScheduleArray = todaysSchedule.schedule

      // Add styling for schedule container
      document.getElementById('scheduleContainer').classList.add('schedule-container')

      // Clear DOM before adding new information about channel schedule
      displaySchedule.innerHTML = ''

      // forEach to get values for each episode
      todaysScheduleArray.forEach(program => {
        console.log('program', program)
        //Transform start time from string to hours and minutes
        const startTimeUtc = program.starttimeutc
        const startTime = new Date(Number(startTimeUtc.match(/^\/Date\((\d+)\)\/$/)[1]))
        const programStart = startTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })

        const programTitle = program.title
        const programImage = program.imageurl
        const programDescription = program.description
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
                    <img src="${programImage}" alt="">
                    <p class="program-title">${programTitle}</p>
                    </div>
                    <div class="episode-description">
                    <p>${programDescription}</p>
                    </div>
                    </div>
                    `

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

        // When info and buttons are created, add event listeners to them, delay 0,5 sec
        setTimeout(() => addEventListenerToButton(`todayButton${selectedChannel}`, program.channel.id, 'Tomorrow'), 500)
        setTimeout(() => addEventListenerToButton(`tomorrowButton${selectedChannel}`, program.channel.id, 'Tomorrow'), 500)
        setTimeout(() => addEventListenerToButton(`secondNextDayButton${selectedChannel}`, program.channel.id, 'SecondNextDay'), 500)

        // End tag for each scheduleArray
      })

      //End tag fetch UrlTodaysSchedule
    })

  //End tag function getTodaysChannelSchedule
}


// Function to see specific channel schedule for tomorrow when button is clicked
const getTomorrowsChannelSchedule = (channel) => {

  const urlTomorrowsSchedule = `http://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=${channel}&date=${getDates('dateTomorrow')}`

  console.log(urlTomorrowsSchedule)
  console.log(getDates('dateTomorrow'))

  fetch(urlTomorrowsSchedule)
    .then((response) => {
      return response.json()
    })
    .then((tomorrowsSchedule) => {

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

      console.log('tomorrowsSchedule', tomorrowsSchedule.pagination)
      console.log('tomorrowsSchedule', tomorrowsSchedule.pagination.nextpage)

      const tomorrowsScheduleArray = tomorrowsSchedule.schedule
      console.log('tomorrowsScheduleArray', tomorrowsScheduleArray)

      // Clear DOM before adding new information about channel schedule 
      displaySchedule.innerHTML = ''

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

      //End tag fetch urlTomorrowsSchedule
    })

  //End tag function getTomorrowsChannelSchedule
}


// Function for get channel schedule for second next day
const getSecondNextDayChannelSchedule = (channel) => {

  const urlSecondNextDaySchedule = `http://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=${channel}&date=${getDates('dateSecondNext')}`

  console.log(getDates('getSecondNextDayChannelSchedule'))

  fetch(urlSecondNextDaySchedule)
    .then((response) => {
      return response.json()
    })
    .then((secondNextDaySchedule) => {

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

      const secondNextDayScheduleArray = secondNextDaySchedule.schedule

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

      //End tag fetch urlSecondNextDaySchedule
    })

  //End tag function getSecondNextDayChannelSchedule
}


//Invoke function when clicking on button/tab for today in schedule-container
//document.getElementById('todayButtonP1').addEventListener("click", () => getTodaysChannelSchedule('132'))

//Invoke function when clicking button
document.getElementById('tomorrowButton').addEventListener("click", () => getTomorrowsChannelSchedule('132'))

//Invoke function when clicking button
document.getElementById('secondNextDayButton').addEventListener("click", () => getSecondNextDayChannelSchedule('132'))



//Invoke functions

const addEventListenerToButton = (name, id, day) => {
  if (day === 'Today') {
    document.getElementById(name).addEventListener('click', () => getTodaysChannelSchedule(id + ''))
  } else if (day === 'Tomorrow') {
    document.getElementById(name).addEventListener('click', () => getTomorrowsChannelSchedule(id + ''))
  } else if (day === 'secondNextDay') {
    document.getElementById(name).addEventListener('click', () => getSecondNextDayChannelSchedule(id + ''))
  }
}


















