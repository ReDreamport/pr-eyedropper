import * as http from "http"
import { showEyedropper } from "./eyedropper"
import { getLatestPickedColor, setLatestPickedColor } from "./main"

const port = 9477

const requestHandler = (request: http.ServerRequest, response: http.ServerResponse) => {
  const url = request.url
  let resText = JSON.stringify({ noHandler: true })
  if (url === "/init.js") {
    resText = JSON.stringify({ ready: true })
  } else if (url === "/show-eyedropper.js") {
    setLatestPickedColor("")
    showEyedropper()
    resText = JSON.stringify({ success: true })
  } else if (url === "/get-latest-color.js") {
    const color = getLatestPickedColor()
    if (color) {
      resText = JSON.stringify({ color })
      setLatestPickedColor("")
    } else {
      resText = JSON.stringify({ color: "" })
    }
  }

  response.setHeader("Access-Control-Allow-Origin", "*")
  response.setHeader("Access-Control-Allow-Credentials", "true")
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  response.setHeader("Access-Control-Allow-Headers", "Content-Type")

  response.end(resText)
}

export function initServer() {
  const server = http.createServer(requestHandler)

  server.listen(port, (err: Error) => {
    if (err) {
      return console.log("something bad happened", err)
    }

    console.log(`server is listening on ${port}`)
  })
}
