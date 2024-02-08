//Import necessary libraries.
const fs = require('fs').promises;
const os = require('os');
const path = require('path');
const saveAs = require('file-saver');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const axios = require('axios');
const readline = require('readline');
//import token and credentials files.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
let FILE_ID = (null);
let UPLOAD_FILE_ID = (null);
let FOLDER_ID = (nulln);
var chunks = [];
const CHUNK_SIZE = 1024*1024*10;

//function to get credentials from token file if existing in token file
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

//function to load credentials from credentials file
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

//funtion to check if token exists and if it doesnt exist, create a new file from authorizing google sign in
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}


//function to get the download file ID and upload folder ID
async function processFile() {
  
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
    
        rl.question('Enter the ID of the file to download chunks from: ', (downloadFileId) => {
          FILE_ID = downloadFileId;
    
          rl.question('Enter the ID of the folder to store the chunks: ', (folderId) => {
            FOLDER_ID = folderId;
    
            rl.close();
            resolve(authorize);
  
        });
      });
    });
}

//function to download and upload in chunks
async function listFiles(authClient) {
  const drive = google.drive({version: 'v3', auth: authClient});

  

  
  const fileInfo = await drive.files.get({
    fileId: FILE_ID,
    fields: 'id, name, size',
  });

  const { id, name, size } = fileInfo.data;
  console.log(`Downloading file: ${name}, Size: ${size} bytes`);

  if (!UPLOAD_FILE_ID) {
    const uploadResponse = await drive.files.create({
      requestBody: {
        name: `${name}`, // Adjust the name as needed
        parents: [FOLDER_ID], // Specify the folder ID where you want to store the file
      },
      media: {
        mimeType: 'video/mp4',
      },
    });

    UPLOAD_FILE_ID = uploadResponse.data.id;
    console.log(`Created file with ID: ${UPLOAD_FILE_ID}`);
  }

  const totalChunks = Math.ceil(size / CHUNK_SIZE);

  for (let i = 0; i < totalChunks; i++) {
    const startByte = i * CHUNK_SIZE;
    const endByte = Math.min((i + 1) * CHUNK_SIZE - 1, size - 1);

    const response = await drive.files.get(
      { fileId: id, alt: 'media', headers: { Range: `bytes=${startByte}-${endByte}` } },
      { responseType: 'stream' }
    );

    // Append subsequent chunks to the existing file
    await drive.files.update({
      fileId: UPLOAD_FILE_ID,
      media: {
        mimeType: 'video/mp4',
        body: response.data,
      },
      fields: 'id',
    });

    console.log(`Appended chunk ${i + 1} of ${totalChunks} to the file with ID: ${UPLOAD_FILE_ID}`);
  }

  console.log('File processing complete!');
}


processFile().then(authorize).then(listFiles).catch(console.error);