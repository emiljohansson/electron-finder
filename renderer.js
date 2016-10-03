const fs = require('fs')

const listEl = document.querySelector('.list')
const startPath = __dirname + '/'
let currentPath = startPath

function readCurrentDir () {
  fs.readdir(currentPath, (err, files) => {
    if (err) {
      console.error(err)
    }
    iterateFiles(files)
  })
}

function iterateFiles (files) {
  const content = {
    dirs: [
      '../'
    ],
    files: []
  }
  if (!files) {
    return
  }
  files.forEach((file) => {
    const stats = getStats(file)
    if (stats.isDirectory()) {
      if (file[0] !== '.') {
        content.dirs.push(file)
      }
      return
    }
    content.files.push(file)
  })
  updateView(content)
}

function getStats(file) {
  try {
    return fs.lstatSync(currentPath + '/' + file)
  } catch (e) {
    return {
      isDirectory: () => false
    }
  }
}

function updateView(content) {
  listEl.innerHTML = ''
  content.dirs.forEach(createDirectory)
  content.files.forEach(createFile)
}

function createDirectory(name) {
  const el = document.createElement('div')
  el.className = 'dir'
  el.innerHTML = name
  el.addEventListener('click', () => {
    cd(name)
  })
  listEl.appendChild(el)
}

function createFile(name) {
  const el = document.createElement('div')
  el.className = 'file'
  el.innerHTML = name
  listEl.appendChild(el)
}

function cd(folderName) {
  if (folderName === '../') {
    goUpOneLevel()
    return
  } else {
    currentPath += '/' + folderName
  }
  readCurrentDir()
}

function goUpOneLevel() {
  if (currentPath === '/') {
    return
  }
  let newPath = currentPath.split('/')
  newPath.pop()
  newPath.pop()
  currentPath = newPath.join('/') + '/'
  readCurrentDir()
}

readCurrentDir()
