/*
Utils are general building blocks. Platform-specific, but not
application-specific

They're useful for abstracting away the configuration for native methods,
or defining new convenience methods for things like working with files,
data munging, etc.

NOTE: Utils should be general enough to be useful in any Node application.
For application-specific concerns, use `helpers.js`.
*/
import fs from 'fs'
import path from 'path'

export const requireOptional = (filePath) => {
  try {
    return import(filePath)
  } catch (e) {
    // We want to ignore 'MODULE_NOT_FOUND' errors, since all that means is that
    // the user has not set up a global overrides file.
    // All other errors should be thrown as expected.
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e
    }
  }
}

export const mkDirPromise = (dirPath) =>
  new Promise<void>((resolve, reject) => {
    fs.mkdir(dirPath, (err) => {
      err ? reject(err) : resolve()
    })
  })

// Simple promise wrappers for read/write files.
// utf-8 is assumed.
export const readFilePromise = (fileLocation) =>
  new Promise((resolve, reject) => {
    fs.readFile(fileLocation, 'utf-8', (err, text) => {
      err ? reject(err) : resolve(text)
    })
  })

export const writeFilePromise = (fileLocation, fileContent) =>
  new Promise<void>((resolve, reject) => {
    fs.writeFile(fileLocation, fileContent, 'utf-8', (err) => {
      err ? reject(err) : resolve()
    })
  })

// Somewhat counter-intuitively, `fs.readFile` works relative to the current
// working directory (if the user is in their own project, it's relative to
// their project). This is unlike `require()` calls, which are always relative
// to the code's directory.
export const readFilePromiseRelative = (fileLocation) =>
  readFilePromise(path.join(__dirname, fileLocation))

export const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}
