import { google } from 'googleapis'
import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

const getClient = ({ scopes }) => {
  return google.auth.getClient({
    credentials: JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT, 'base64').toString(
        'ascii'
      )
    ),
    scopes: scopes,
  })
}

const authorizeSheets = async () => {
  const client = await getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return google.sheets({
    version: 'v4',
    auth: client,
  })
}

const addToCol = async (range, input) => {
  const sheets = await authorizeSheets()
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.append(
      {
        spreadsheetId: '1VeSNdJ6LT3X_ShFCQfSrfRZH8NGODLYvf3ZJtFj0mU4',
        range,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[input]],
        },
      },
      (err, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      }
    )
  })
}

exports.handler = async function (event, context, callback) {
  try {
    const sheetsRes = await addToCol('Local!F2', 'test')
    return {
      statusCode: sheetsRes.status,
      body: JSON.stringify(sheetsRes),
    }
  } catch (err) {
    console.log(err)
    return { statusCode: 500, body: err.toString() }
  }
};
