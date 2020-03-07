// API URL's
const fetchAllChannels = `http://api.sr.se/api/v2/channels?format=json`


// Channel ID's p1 = 132, p2 = 163, p3 = 164

// DOM Selectors all channels
const channelContainer = document.getElementById('channelContainer')
const channelImg = document.getElementById('channelImg')
const channelDescription = document.getElementById('channelDescription')
const channelProgramNow = document.getElementById('channelProgramNow')
const channelAudio = document.getElementById('channelAudio')
const channelSchedule = document.getElementById('channelSchedule')


// DOM Selectors schedule for specific channel
const scheduleContainer = document.getElementById('scheduleContainer')



fetch(fetchAllChannels)
  .then((response) => {
    return response.json()
  })
  .then((channelArray) => {

    console.log(channelArray)
    console.log(channelArray.channels)

    //Filter array to only show P1, P2 and P3
    const filteredChannels = channelArray.channels.filter(item => item.id < 200)
    console.log(filteredChannels)

    filteredChannels.forEach((channel) => {

      let channelId = channel.id
      const description = channel.tagline
      const image = channel.image
      const audio = channel.liveaudio.url

      console.log(channel.liveaudio.url)


      // Print information to DOM
      channelImg.innerHTML += `<img src="${image}" alt="">`
      //channelDescription.innerHTML += `<p>${description}</p>`



      // Fetch program that sends right now for each channel
      const fetchProgramRightNow = `http://api.sr.se/api/v2/scheduledepisodes/rightnow?format=json&channelid=${channelId}`

      const sendRightNow = (channelId) => {
        fetch(fetchProgramRightNow)
          .then((response) => {
            return response.json()
          })
          .then((rightNowArray) => {
            console.log(rightNowArray)

            const titleNow = rightNowArray.channel.currentscheduledepisode.title
            const descrNow = rightNowArray.channel.currentscheduledepisode.description

            channelProgramNow.innerHTML +=
              `<p>${titleNow} <br>
              <audio src="${audio}" controls></audio>
              </p>
           `

            console.log(rightNowArray.channel.currentscheduledepisode.title)
            console.log(rightNowArray.channel.currentscheduledepisode.description)
          })
      }

      sendRightNow()

      //End tag filteredChannels.forEach
    });

    // End tag fetchAllChannels
  })
