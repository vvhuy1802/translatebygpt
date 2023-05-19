chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Authorization",
    "Bearer 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"
  );

  var raw = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: "Dịch sang tiếng Việt: " + request.data,
      },
    ],
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://api.openai.com/v1/chat/completions", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const text = JSON.parse(result).choices[0].message.content;
      console.log(text);

      //create dialog html
      var dialog = document.createElement("div");
      dialog.id = "dialog";
      dialog.style =
        "position: fixed; bottom: 0; right: 0; z-index: 9999; width: 300px; height: 300px; background-color: #fff; border: 1px solid #000; border-radius: 5px; padding: 10px; overflow: auto;";
      dialog.innerHTML = `<div id='dialog-content' style='height: 100%; width: 100%;'>
          <div style='height: 90%; width: 100%; overflow: auto;'>
          <div style='position: absolute; top: 0; right: 0;'>
            <button id='copy_png' style='background-color: #fff; border: none; outline: none; cursor: pointer;'>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-copy" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"></path>
            <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
            </svg>
            </button>
          </div>
            <p style='font-size: 14px; font-weight: bold; margin: 0;'> ${text} </p>
          </div>
        </div>`;
      document.body.appendChild(dialog);
      //copy to clipboard
      document.getElementById("copy_png").addEventListener("click", () => {
        navigator.clipboard.writeText(text);
      });
      //click outside to close dialog
      document.addEventListener("click", (e) => {
        if (e.target.id !== "dialog" && e.target.id !== "copy_png") {
          dialog.remove();
        }
      });
    })
    .catch((error) => console.log("error", error));
});
