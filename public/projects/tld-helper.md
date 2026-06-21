---
title: TLD Helper
createdAt: 2026-04-30
updatedAt: 2026-06-07
tags: [Python]
description: An interactive CLI tool to explore domain extensions. It allows you to fetch domain extensions and WHOIS information.
highlight: true
image: /img/hello-world.png
github: https://github.com/jurgenjacobsen/tld-helper
link: #
slug: tld-helper
downloads: 
    hideUnavailable: true
    disableAll: true
    hideDownloads: true
---

# TLD Helper
An interactive CLI tool to manage and explore Top-Level Domains (TLDs). It allows you to fetch official IANA lists, filter for buyable suffixes using the Public Suffix List, and perform WHOIS lookups.

## Features
*   **Interactive TUI**: A beautiful terminal dashboard with live prefixing, filtering, and asynchronous WHOIS lookup.
*   **All TLDs**: Fetches the latest official TLD list from IANA.
*   **Buyable TLDs**: Filters the Public Suffix List to identify potentially registrable domains (excluding private/internal suffixes).
*   **WHOIS Lookup**: Quick domain registration checks directly from the menu.
*   **Domain Analysis**: Prepend a custom word to all buyable TLDs to preview and analyze potential domain name options.
*   **Auto-Updates**: Integrated GitHub Action keeps the `all_tlds.txt` and `buyable_tlds.txt` updated automatically.

## Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/jurgenjacobsen/tld-helper.git
    cd tld-helper
    ```

2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

## Usage
Run the main script to start the application. By default, it opens a beautiful, modern Dashboard terminal interface (TUI):

```bash
python main.py
```

If you prefer the old interactive CLI menu, run with the `--cli` flag:

```bash
python main.py --cli
```

### Dashboard TUI Features:
*   **Real-time Prepend Prefix**: Type a prefix in the input box, and the domains list will update instantly to show `<prefix>.<tld>`.
*   **Real-time Filter/Search**: Filter the listed domains/suffixes dynamically as you type.
*   **Auto-WHOIS**: Click or highlight a domain from the list, and it will fill the lookup field. Pressing Enter or clicking `Run WHOIS` runs a background query and displays results instantly in the details panel.
*   **Asynchronous Processing**: Actions like fetching new lists or querying WHOIS are executed in worker threads, keeping the TUI completely responsive and smooth.
*   **Hotkeys**:
    - `q`: Quit the application
    - `Ctrl + S`: Save the currently generated/filtered domain list to a text file
    - `Ctrl + W`: Run a WHOIS lookup for the typed/selected domain

### CLI Menu Options (Fallback):
*   `Look for all available TLD domains`: Downloads the official IANA list to `all_tlds.txt`.
*   `Look for buyable TLD domains`: Filters the Public Suffix List and saves to `buyable_tlds.txt`.
*   `Generate domains by prepending a word to buyable TLDs`: Creates a list of domains prepending your custom brand name or keyword to all buyable TLDs. Saves to `<word>_domains.txt` and offers interactive previews, searches/filters, and WHOIS lookups.
*   `Run WHOIS`: Enter a domain to see its registration data.

## Automation
This repository uses GitHub Actions to automatically refresh the TLD lists every month (on the 1st day). This ensures that `all_tlds.txt` and `buyable_tlds.txt` are always up to date with the latest registry changes.

## License
MIT
