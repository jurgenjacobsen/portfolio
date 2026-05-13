---
title: Archivum Markdown
createdAt: 2026-04-30
updatedAt: 2026-05-13
tags: [Go, Typescript, React, TailwindCSS]
description: This is my first actual Go application built with Wails and React with the goal of having a light weight fast desktop app for markdown editing.
highlight: true
image: /img/archivum-markdown.png
github: https://github.com/jurgenjacobsen/archivum-markdown
link: #
slug: archivum-markdown
---

# Building a High-Performance Markdown Editor with Go and React
I’ve always wanted a writing tool that felt as fast as a native app but remained as flexible as a modern web interface. This led me to build Archivum Markdown, a desktop editor designed for speed, simplicity, and focus.

# Why I Built This
Most Markdown editors are either too heavy (consuming gigabytes of RAM) or too simple (lacking workspace management). For my first major project using Go, I chose to use the Wails framework. Wails allows me to write the heavy-duty logic—like file system watching and PDF generation—in Go, while crafting a beautiful, responsive UI using React and Tailwind CSS.

# Key Technical Features
- **Native Performance**: By using Go for the backend, the application handles file system operations and workspace monitoring with minimal overhead.

- **Recursive File Watching**: The app uses fsnotify to monitor entire directories. If you add, rename, or delete a file in your workspace from outside the app, the sidebar updates instantly.

- **Chromium-Powered PDF Export**: I implemented a "Print to PDF" feature using chromedp. It converts Markdown to styled HTML and then uses a headless browser to generate a pixel-perfect A4 document.

- **Smart Auto-Save**: To ensure no progress is ever lost, I built a custom hook that triggers a save operation after one second of typing inactivity.

- **Synchronized Scrolling**: The editor and the live preview stay perfectly in sync, allowing for a seamless "what you see is what you get" experience.

# The Tech Stack
- **Backend**: Go with Wails.
- **Frontend**: TypeScript, React and Tailwind CSS.
- **Markdown Parsing**: Powered by the goldmark library in Go for GFM (GitHub Flavored Markdown) support.

# How to Try It
## Production Environment
You can download the latest release for your operating system from the GitHub releases page: 
**[Archivum Markdown - Releases](https://github.com/jurgenjacobsen/archivum-markdown/releases)**

## Development Environment
If you want to explore the code or build it yourself, you'll need Go (v1.23+) and the Wails CLI.

```
# Clone the repo
git clone https://github.com/jurgenjacobsen/archivum-markdown

# Run in development mode
wails dev

# Build for your current OS
wails build
```

This project has been a massive learning experience in bridging the gap between systems programming with Go and modern frontend development with React. Stay tuned for more updates!