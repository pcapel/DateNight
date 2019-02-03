const getValue = (id) => {
  return document.getElementById(id).value
}

const saveSettings = () => {
  let hostUrl = getValue('hostUrl')
  let serviceName = getValue('serviceName')
  console.log(hostUrl, serviceName)
  browser.storage.sync.set({
    hostUrl: hostUrl,
    serviceName: serviceName
  })
}

document.getElementById("save").addEventListener('click', saveSettings)
