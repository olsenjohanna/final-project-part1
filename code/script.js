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


// DOM Selectors schedule for specific channel
const scheduleContainer = document.getElementById('scheduleContainer')
const displaySchedule = document.getElementById('displaySchedule')


// Function to show all channels (P1,P2,P3)
const showChannels = () => {

  // Fetch all channels

  fetch(fetchAllChannels)
    .then((response) => {
      return response.json()
    })
    .then((channelArray) => {

      //Filter array to only show P1, P2 and P3
      const filteredChannels = channelArray.channels.filter(item => item.id < 200)
      console.log(filteredChannels)


      filteredChannels.forEach((channel) => {

        let channelId = channel.id
        const description = channel.tagline
        const image = channel.image
        const audio = channel.liveaudio.url
        console.log(channel.color)


        // Print information to DOM
        channelInfo.innerHTML +=
          `
        <div class="channel-image" id="channelImg">
        <img src="${image}" alt="">
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

            const titleNow = rightNowArray.channel.currentscheduledepisode.title
            const descrNow = rightNowArray.channel.currentscheduledepisode.description
            const colorClass = rightNowArray.channel.name
            console.log(channelId)

            //Print information to DOM about program that plays now and button to see whole schedule

            scheduleInfo.innerHTML +=
              `<div class="container">
              <div class="channel-program-now" id="channelProgramNow">
              <p>Spelas nu: ${titleNow} <br>
              <audio src="${audio}" controls></audio></p>
              </div>
              <div class="channel-schedule" id="channelSchedule">
              <button id="seeChannelSchedule" class="${colorClass}" value=${channelId}>Se tablå >></button>
              </div>
              </div>
              `

            // End tag for fetch of fetchProgramRightNow
          })


        //End tag filteredChannels.forEach
      });

      // End tag fetchAllChannels
    })

}

//Invoke function to show all channels
showChannels()


// Get dates for today, tomorrow and the second next day in format yyyy-mm-dd
const getDates = () => {

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
  console.log(todaysDate)

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
  console.log(tomorrowsDate)

  //Second next days date
  const secondNext = new Date(tomorrow)
  secondNext.setDate(tomorrow.getDate() + 1)

  const weekdayLong = secondNext.toLocaleDateString('sv-SE', { weekday: 'long' })
  console.log(weekdayLong)

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
  console.log(secondNextDate)

}

getDates()


//Function for todays schedule for selected channel

//const seeTodaysSchedule = (channel) => {

// API url for 
const fetchChannelSchedule = `http://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=132`
//const fetchChannelSchedule = `http://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=${channel}`

fetch(fetchChannelSchedule)
  .then((response) => {
    return response.json()
  })
  .then((schedules) => {

    const scheduleArray = schedules.schedule
    console.log(scheduleArray)

    scheduleArray.forEach((program) => {

      let startTimeUtc = program.starttimeutc
      //console.log(startTimeUtc)

      let startTime = new Date(Number(startTimeUtc.match(/^\/Date\((\d+)\)\/$/)[1]))
      const programStart = startTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
      console.log(programStart)

      const programTitle = program.title
      console.log(programTitle)
      //console.log(program.program.name)

      const programImage = program.imageurl

      // Print information to DOM

      displaySchedule.innerHTML +=
        `
            <div class="episode" id="episode">
            <p>${programStart}</p>
            <img src="${programImage}" alt="">
            <p>${programTitle}</p>
            </div>
            `
      // End tag for each scheduleArray
    })

    //End tag fetch
  })

  //End tag for function to see todays schedule
//}

  //Call for function to see todays schedule

  //seeChannelSchedule.addEventListener("onclick", () => seeTodaysSchedule(seeChannelSchedule.value))

