<p align="center">
  <img src="./logo.png" alt="Motto Tab" width="200" />
</p>

# Motto Tab

Obsidian Plugin: Custom new tab page displaying daily mottos and time-based greetings.

## Features

- 🕐 **Real-time Clock** - Displays current time, updates every second
- 👋 **Warm Greetings** - Time-based greetings (Chinese/English support)
- 📝 **Daily Quote** - Reads famous quotes from a Markdown file with author attribution
- 🎨 **Theme Support** - Automatically adapts to Obsidian light/dark theme

## Installation

1. Download the latest release
2. Copy the `dist` folder to your Obsidian plugins directory:
   - `%APPDATA%\obsidian\plugins\motto-tab\` (Windows)
   - `~/Library/Application Support/obsidian/plugins/motto-tab/` (macOS)
3. Enable the plugin in Obsidian settings

## Settings

Configure in Obsidian settings under "Motto Tab":

- **Motto File Path** - Path to the Markdown file in your vault root
- **Show Greeting** - Toggle time-based greeting
- **Font Size** - Motto text size

## Motto Data Format

Create `.mottos.md` in your vault root using Markdown table format:

```markdown
| Quote | Author |
| ----- | ------ |
| If you sit at a poker table and can't spot the sucker within the first hour, you're the sucker. | Warren Buffett |
| Power is only accountable to its source. | Montesquieu |
| Weakness and ignorance are not the obstacles to survival, arrogance is. | Liu Cixin |
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Development mode
pnpm dev
```

Build output in `dist/` directory.

## License

MIT