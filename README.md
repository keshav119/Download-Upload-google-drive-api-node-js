# Google Drive Script Setup Guide

## Prerequisites:
1. **Node.js and npm:**
   - Make sure you have Node.js and npm installed. You can download them from [Node.js official website](https://nodejs.org/).

2. **Google API Project:**
   - Create a new project in the [Google Cloud Console](https://console.cloud.google.com/).
   - Enable the Google Drive API for your project.
   - Create OAuth 2.0 credentials (client ID and client secret).
   - Download the credentials as `credentials.json` and save them in the same directory as your script.

## Google Drive Setup:
1. Create a Google Drive folder where you want to store the downloaded chunks.
   - Note the folder ID for later use.

2. Install all the necessary packages for importing the modules in the production environment.

## Steps to Feed Download File and Upload Location Details:
1. Share the file and folder on Google Drive with the email address `channakeshav99.ck@gmail.com`.
   
2. Use your own API credentials and make a new refresh token for the first time if you don't trust the above Gmail address.

3. Get the file and folder ID from the link and store it in a notepad.

4. Run the script using the console command:
   ```bash
   node index.js

## The script will prompt for arguments:
1. The first argument is the file ID. Paste the file ID and press Enter.

2. The second argument is the destination folder ID. Provide the folder ID and press Enter.

3. Finally, you can track the progress in the console itself.

For any doubts or queries, reach out to the same email address mentioned above.


