<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<div align="center">
  <h3 align="center">Court Musician</h3>
  <p align="center">
    A Discord music bot
    <br />
    <a href="https://discord.com/oauth2/authorize?client_id=1323865594960810004&permissions=0&integration_type=0&scope=bot+applications.commands">Add to Server</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About</a>
    </li>
    <li><a href="#commands">Commands</a></li>
  </ol>
</details>

<!-- ABOUT -->

## About

A music bot that still works with Youtube (for now)! Also supports Spotify, Soundcloud, and playback of local files after uploading it to the bot.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Commands -->

## Commands

The following information is available as part of Discord's slash commands as well.

- **/play**: Has the `/play song` and `/play file` subcommands. `/play song` accepts a search parameter (search term or direct link) and then plays the result. There are also optional arguments to define where to search from (Youtube, Spotify, Soundcloud) and also whether to put it on the top of the queue or not. `/play file` will play a local file that has been uploaded (see `/upload`).
- **/stop**: Stops the bot and leaves.
- **/skip**: Skips the current song. If it is the last song then the bot also leaves.
- **/clear**: Clears the queue.
- **/queue**: Displays what is in the queue.
- **/pause**: Pauses playing.
- **/resume**: Resumes playing.
- **/seek**: Seek to a certain portion of the song.
- **/shuffle**: Shuffles the queue.
- **/upload**: Uploads a media file that then gets downloaded on the server. Playback of this file can be done usng the `/play file` command.
- **/loop**: Makes the bot loop the current song or the whole queue.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
