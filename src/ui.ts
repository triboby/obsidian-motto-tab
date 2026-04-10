import { ItemView, WorkspaceLeaf } from 'obsidian';
import { MottoTabSettings } from './settings';
import { getGreeting, getSystemLanguage } from './greeting';
import { loadMottos, getRandomMotto } from './motto';

export const MOTTO_VIEW_TYPE = 'motto-tab-view';

// UI 文本国际化
const uiI18n = {
  zh: {
    newNote: '新建笔记',
    loading: '加载中...',
    defaultMotto: '保持热爱，奔赴山海',
  },
  en: {
    newNote: 'New Note',
    loading: 'Loading...',
    defaultMotto: 'Stay passionate, chase your dreams.',
  },
};

export class MottoView extends ItemView {
  settings: MottoTabSettings;
  clockInterval: number | null = null;

  constructor(leaf: WorkspaceLeaf, settings: MottoTabSettings) {
    super(leaf);
    this.settings = settings;
  }

  getViewType(): string {
    return MOTTO_VIEW_TYPE;
  }

  getDisplayText(): string {
    return 'Motto Tab';
  }

  getIcon(): string {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return 'sunrise';
    } else if (hour >= 12 && hour < 18) {
      return 'sun';
    } else if (hour >= 18 && hour < 20) {
      return 'sunset';
    } else {
      return 'moon';
    }
  }

  private getUIText(key: keyof typeof uiI18n.zh): string {
    const lang = getSystemLanguage();
    return uiI18n[lang][key];
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    const lang = getSystemLanguage();

    // 构建新界面 HTML
    const html = `
      <div class="motto-tab-container">
        <!-- 右上角新建笔记按钮 -->
        <button class="motto-new-note-btn" id="btn-new-note">
          ${this.getUIText('newNote')}
        </button>

        <!-- 主内容区 -->
        <div class="motto-main">
          <!-- 时钟 -->
          <h1 class="motto-clock" id="clock">--:--</h1>

          <!-- 问候语 -->
          <h2 class="motto-greeting" id="greeting">
            ${this.settings.greetingEnabled ? getGreeting(lang) : ''}
          </h2>
        </div>

        <!-- 底部每日一言 -->
        <div class="motto-footer">
          <div class="motto-quote">
            <p class="motto-quote-text motto-text" id="motto-text">
              ${this.getUIText('loading')}
            </p>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // 启动时钟更新
    this.updateClock();
    this.clockInterval = window.setInterval(() => this.updateClock(), 1000);

    // 异步加载 motto
    loadMottos(this.app, this.settings.mottoFilePath).then((mottos) => {
      const motto = getRandomMotto(mottos);
      const mottoEl = container.querySelector('#motto-text');
      if (mottoEl) {
        let text = `"${motto.quote}"`;
        if (motto.author) {
          text += `<br><span class="motto-quote-author">— ${motto.author}</span>`;
        }
        mottoEl.innerHTML = text;
      }
    }).catch((error) => {
      console.error('[Motto Tab] 加载 motto 失败:', error);
      const mottoEl = container.querySelector('#motto-text');
      if (mottoEl) {
        mottoEl.innerHTML = `"${this.getUIText('defaultMotto')}"`;
      }
    });

    // 绑定新建笔记按钮事件
    const newNoteBtn = container.querySelector('#btn-new-note');
    newNoteBtn?.addEventListener('click', async () => {
      const fileName = lang === 'zh' ? `未命名 ${new Date().getTime()}.md` : `Untitled ${new Date().getTime()}.md`;
      const file = await this.app.vault.create(fileName, '');
      this.app.workspace.getLeaf(true).openFile(file);
    });
  }

  updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const clockEl = this.containerEl?.querySelector('#clock');
    if (clockEl) {
      clockEl.textContent = `${hours}:${minutes}`;
    }
  }

  async onClose() {
    if (this.clockInterval !== null) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }
}