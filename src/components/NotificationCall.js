const NotificationCall = (audioFileName, playListName) => {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Authorization",
    "Bearer AAAAznTdE3U:APA91bHPOU2TJQrd4cHcz7LDJpfWZzyU1j1QF8VNbB70s_pLFrZ9BmSEGUNBQRSi5-4H-ihlXb-Bhieuhbj1f3HvTiXLI5ua2OtL0lsUEUOEKejWGJCJK5JxnVf87odSWKY1-1vJ7123"
  );

  var raw = JSON.stringify({
    to: "ePL3WaNUTWWFdy7JImAD5L:APA91bHdCW-wsvwGz6Bc50eAfApZyPxAimFmI9BVRym8pWe9BTiUIDSK3wwgUAwDb7w7oI2mcoXJfgYLwkCmiKrb3h-O6005dfClCAL7-SaTqpzMI4yvzAHyguHA0IzaPHtN8sPcgEr1",
    notification: {
      title: "Playlist updated",
      body: audioFileName + " added to " + playListName,
    },
    data: {
      url: "url",
      dl: "deeplinking",
    },
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://fcm.googleapis.com/fcm/send", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

export default NotificationCall;
