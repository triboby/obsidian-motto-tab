import { App, TFile, TAbstractFile, TFolder } from 'obsidian';

interface MottoItem {
  quote: string;
  author: string;
}

const DEFAULT_MOTTO = { quote: '保持热爱，奔赴山海', author: '' };

export async function loadMottos(app: App, filePath: string): Promise<MottoItem[]> {
  try {
    const vault = app.vault;
    const abstractFile = vault.getAbstractFileByPath(filePath);

    if (!abstractFile || abstractFile instanceof TFolder) {
      console.log(`[Motto Tab] 文件不存在: ${filePath}，使用默认 motto`);
      return [DEFAULT_MOTTO];
    }

    const file = abstractFile as TFile;
    const content = await vault.read(file);
    const mottos = parseMarkdownTable(content);

    if (!mottos || mottos.length === 0) {
      return [DEFAULT_MOTTO];
    }

    return mottos;
  } catch (error) {
    console.error('[Motto Tab] 读取 motto 失败:', error);
    return [DEFAULT_MOTTO];
  }
}

export function getRandomMotto(mottos: MottoItem[]): MottoItem {
  if (mottos.length === 0) {
    return DEFAULT_MOTTO;
  }
  const index = Math.floor(Math.random() * mottos.length);
  return mottos[index];
}

// 解析 Markdown table
function parseMarkdownTable(content: string): MottoItem[] {
  const lines = content.split('\n');
  const mottos: MottoItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // 跳过表头和分隔线
    if (trimmed.startsWith('|') && !trimmed.includes('---')) {
      // 解析表格行
      const cells = trimmed.split('|').filter(cell => cell.trim() !== '');

      if (cells.length >= 2) {
        const quote = cells[0].trim();
        const author = cells[1].trim();

        // 跳过表头
        if (quote !== '名言' && quote !== 'Quote' && quote !== '名句') {
          mottos.push({ quote, author });
        }
      }
    }
  }

  return mottos;
}