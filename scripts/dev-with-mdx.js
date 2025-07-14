#!/usr/bin/env node

/**
 * Development Script with MDX Watch
 *
 * This script runs both Gatsby development server and MDX file watching
 * simultaneously for a seamless development experience.
 */

const { spawn } = require("child_process")
const path = require("path")

console.log("🚀 Starting development environment with MDX support...\n")

// Start Gatsby development server
const gatsby = spawn("gatsby", ["develop"], {
  stdio: ["inherit", "pipe", "pipe"],
  shell: true,
})

// Start MDX watch mode
const mdxWatcher = spawn("node", ["scripts/mdx-to-js-converter.js", "--watch"], {
  stdio: ["inherit", "pipe", "pipe"],
  shell: true,
})

// Handle Gatsby output
gatsby.stdout.on("data", data => {
  const output = data.toString()
  // Add prefix to Gatsby output
  output.split("\n").forEach(line => {
    if (line.trim()) {
      console.log(`[Gatsby] ${line}`)
    }
  })
})

gatsby.stderr.on("data", data => {
  const output = data.toString()
  output.split("\n").forEach(line => {
    if (line.trim()) {
      console.log(`[Gatsby Error] ${line}`)
    }
  })
})

// Handle MDX watcher output
mdxWatcher.stdout.on("data", data => {
  const output = data.toString()
  output.split("\n").forEach(line => {
    if (line.trim()) {
      console.log(`[MDX] ${line}`)
    }
  })
})

mdxWatcher.stderr.on("data", data => {
  const output = data.toString()
  output.split("\n").forEach(line => {
    if (line.trim()) {
      console.log(`[MDX Error] ${line}`)
    }
  })
})

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down development environment...")
  gatsby.kill("SIGINT")
  mdxWatcher.kill("SIGINT")
  process.exit(0)
})

process.on("SIGTERM", () => {
  gatsby.kill("SIGTERM")
  mdxWatcher.kill("SIGTERM")
  process.exit(0)
})

// Handle child process exits
gatsby.on("close", code => {
  if (code !== 0) {
    console.log(`[Gatsby] Process exited with code ${code}`)
  }
})

mdxWatcher.on("close", code => {
  if (code !== 0) {
    console.log(`[MDX] Process exited with code ${code}`)
  }
})

console.log("✅ Development environment started!")
console.log("📝 Edit MDX files in blog-posts/ - they will auto-convert to JS")
console.log("🌐 Gatsby will be available at http://localhost:8000")
console.log("📊 GraphQL explorer at http://localhost:8000/___graphql")
console.log("\nPress Ctrl+C to stop both processes\n")
