# Blueprint - Feature Specification

## The Idea
A live, centralized configuration and template distribution feature hosted directly on `jurgen.fyi`. It serves as the single source of truth for project configurations, AI agent guidelines, code style rules, and template scaffolding across current and future web development projects.

## The Goal
Provide a rapid, repeatable, and maintainable workflow to bootstrap new web development projects or synchronize configuration files across existing ones without manual copy-pasting or maintaining third-party package dependencies.

---

## Architecture & State Model

The system uses a **Dual-Manifest Architecture** to keep the remote source of truth decoupled from individual project state:

```
┌────────────────────────────────────────────────────────┐
│ Remote Registry (jurgen.fyi/blueprint/)                │
│ ├─ manifest.json     (Catalogue, version, file URLs)   │
│ ├─ installer.ps1     (PowerShell automation script)    │
│ └─ [config files]    (.editorconfig, AGENTS.md, etc.)  │
└────────────────────────────────────────────────────────┘
                           │
                           │  HTTP GET (irm / Invoke-WebRequest)
                           ▼
┌────────────────────────────────────────────────────────┐
│ Target Project Folder                                  │
│ ├─ .blueprint.json   (Local lockfile & file tracker)   │
│ └─ [Installed files] (.editorconfig, AGENTS.md, etc.)  │
└────────────────────────────────────────────────────────┘
```

### 1. Remote Manifest (`/public/blueprint/manifest.json`)
The public catalogue defining available configuration files, template versions, and categories:
```json
{
  "version": "1.0.0",
  "updatedAt": "2026-09-13T20:45:00Z",
  "files": [
    {
      "id": "agents",
      "name": "AGENTS.md",
      "category": "AI Instructions",
      "description": "Autonomous AI coding agent instructions and project guidelines",
      "default": true
    },
    {
      "id": "editorconfig",
      "name": ".editorconfig",
      "category": "Code Quality",
      "description": "Consistent cross-editor indentation and charset configuration",
      "default": true
    },
    {
      "id": "prettier",
      "name": ".prettierrc",
      "category": "Code Quality",
      "description": "Prettier formatting standards",
      "default": true
    },
    {
      "id": "tailwind",
      "name": "tailwind.config.js",
      "category": "Styling",
      "description": "Tailwind CSS theme setup and plugin extensions",
      "default": false
    },
    {
      "id": "plan",
      "name": "PLAN.md",
      "category": "Project Management",
      "description": "Architecture and roadmap planning template",
      "default": true
    }
  ]
}
```

### 2. Local Lockfile (`.blueprint.json` in Target Project)
Created in the project root upon installation to track state, enabling safe updates, uninstalls, and drift detection:
```json
{
  "version": "1.0.0",
  "installedAt": "2026-09-13T20:45:00Z",
  "source": "https://jurgen.fyi/blueprint",
  "installedFiles": [
    "AGENTS.md",
    ".editorconfig",
    ".prettierrc",
    "PLAN.md"
  ]
}
```

---

## User Flow & Friction Remediations

### 1. Acquisition (Eliminating Download & Security Policy Friction)
* **Primary (Recommended):** An in-terminal one-liner copyable directly from `jurgen.fyi/blueprint`:
  ```powershell
  irm https://jurgen.fyi/blueprint/installer.ps1 | iex
  ```
  *Benefit:* Bypasses Windows Mark-of-the-Web blocks and eliminates manual file-moving from the `Downloads` directory.
* **Secondary:** A **Download Installer** button for offline or manual use, with an accompanying instruction snippet to unblock:
  ```powershell
  Unblock-File .\installer.ps1; .\installer.ps1
  ```
* **Platform Scope Note:** The web page highlights that the automation installer is tailored for **Windows (PowerShell 5.1+)**.

### 2. Remote Catalogue Discovery
When executed, the installer queries `https://jurgen.fyi/blueprint/manifest.json` to discover the latest version and the available files.

### 3. Interactive Configuration Selection
The installer prompts the user with an interactive terminal checklist:
* Pre-selects recommended default files (`default: true`).
* Allows toggling specific configurations on/off (e.g., skip `tailwind.config.js` if the project uses a different CSS framework).

### 4. Installation & Local Lockfile Creation
* The installer downloads only the selected files into the current working directory.
* If a target file already exists, the installer prompts before overwriting:
  ```text
  ⚠️ '.editorconfig' already exists. Overwrite? [Y]es / [N]o / [B]ackup
  ```
* Writes `.blueprint.json` to record installed files and the version stamp.

### 5. Update Routine (`installer.ps1 -Update`)
* Reads `.blueprint.json` and compares the installed version against the remote `manifest.json`.
* If a new version is detected, it informs the user and presents a list of updated files.
* **Conflict Safeguard:** Prompts for confirmation before modifying any file, preventing project-specific customizations from being overwritten silently.

### 6. Clean Uninstall (`installer.ps1 -Uninstall`)
* Reads `.blueprint.json` to identify precisely which files were placed by the installer.
* Deletes only the tracked files and removes `.blueprint.json`.
* Leaves all user-created files and git history completely untouched.

### 7. Template Reset (`installer.ps1 -Reset`)
* Restricts "Reset" strictly to **blueprint-managed files** recorded in `.blueprint.json`.
* Re-downloads fresh, upstream default copies of those files, restoring them to factory template condition without modifying or deleting any other project files.

---

## CLI Command Reference

| Command | Description |
| :--- | :--- |
| `irm https://jurgen.fyi/blueprint/installer.ps1 \| iex` | Run interactive installer directly from the web |
| `.\installer.ps1` | Interactive install/scaffold in current directory |
| `.\installer.ps1 -Update` | Check for updates and sync modified template files with confirmation |
| `.\installer.ps1 -Uninstall` | Remove all blueprint-managed files and local tracker |
| `.\installer.ps1 -Reset` | Restore all blueprint-managed files back to upstream defaults |
| `.\installer.ps1 -Force` | Skip overwrite confirmations (useful for automated CI/CD setup) |

---

## Web Page UI Requirements (`/blueprint`)

1. **Terminal Command Banner:**
   * Prominently displays `irm https://jurgen.fyi/blueprint/installer.ps1 | iex`.
   * Includes an instant "Copy Command" button with visual feedback.
2. **Download Installer Button:**
   * Direct download link to `/blueprint/installer.ps1`.
   * Tooltip / note detailing `Unblock-File .\installer.ps1` for browser downloads.
3. **Platform Badge:**
   * Badge stating: `Windows PowerShell (5.1+)`.
4. **Interactive File Showcase:**
   * Clean table/card view of all available templates from `manifest.json`.
   * Displays filename, category badge, description, and direct view/download links.
