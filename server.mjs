import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { extname, join, normalize, resolve } from "node:path"
import { exec } from "node:child_process"

const rootDirectory = resolve(process.cwd())
const defaultPort = Number(process.env.PORT) || 4173
const host = process.env.HOST || "127.0.0.1"
const shouldOpenBrowser = process.argv.includes("--open")

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${host}:${defaultPort}`)
  const pathName = decodeURIComponent(requestUrl.pathname)
  const requestedPath = pathName === "/" ? "/index.html" : pathName
  const safePath = normalize(requestedPath).replace(/^(\.\.[/\\])+/, "")
  const filePath = resolve(rootDirectory, `.${safePath}`)

  if (!filePath.startsWith(rootDirectory)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" })
    response.end("Forbidden")
    return
  }

  try {
    const targetPath = existsSync(filePath) ? filePath : join(rootDirectory, "index.html")
    const fileContent = await readFile(targetPath)
    const extension = extname(targetPath).toLowerCase()
    const contentType = mimeTypes[extension] || "application/octet-stream"

    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": contentType,
    })
    response.end(fileContent)
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" })
    response.end(`Could not load the simulator: ${error.message}`)
  }
})

server.listen(defaultPort, host, () => {
  const localUrl = `http://${host}:${defaultPort}/`
  console.log(`Credit risk with AI is running at ${localUrl}`)
  console.log("Press Ctrl+C in this terminal to stop the local server.")

  if (shouldOpenBrowser) {
    openBrowser(localUrl)
  }
})

function openBrowser(url) {
  const command =
    process.platform === "win32"
      ? `start "" "${url}"`
      : process.platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`

  exec(command, (error) => {
    if (error) {
      console.error(`Could not open the browser automatically: ${error.message}`)
    }
  })
}
