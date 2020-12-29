# LSTN ALNG - A collaborative listening room using Spotify

This project is a site where multiple users can propose songs, vote for them, and listen to the queue together, synchronously via Spotify.

## User Stories

• User + one or more friends can all visit the same “Listening Room” together

• There will be an active song queue that anyone in the room can edit and add to and have it be played synchronously across all devices via Spotify.

## Setting up

The server can be run locally and also deployed to Heroku. You will need to register your own Spotify app and set the credentials in a couple of config files. For that:

1. Create an application on [Spotify's Developer Site](https://developer.spotify.com/my-applications/).

2. Add as redirect uris both http://localhost:3000/auth/callback (for development) and <production_domain>/auth/callback (if you want to deploy your app somewhere).

3. Create a `.env` file in the root of the project with the following variables;

   - `HOST`
   - `CLIENT_ID`
   - `CLIENT_SECRET`

Example:

```
HOST=http://localhost:3000
CLIENT_ID=<your_client_id>
CLIENT_SECRET=<your_client_secret>
```

## Dependencies

Install the dependencies running `npm install`.

## Running

During development, run `npm run dev`.

When running on production, run `npm run build && npm run start`.

## Next Edits:

• Include a chat box for each room.
