import { App, PluginSettingTab, Setting } from 'obsidian';
import { Language, getSystemLanguage } from './greeting';

export interface MottoTabSettings {
  mottoFilePath: string;
  greetingEnabled: boolean;
  fontSize: number;
}

// 插件接口，用于 settings tab 类型定义
interface MottoTabPlugin {
  settings: MottoTabSettings;
  saveSettings: () => Promise<void>;
}

// 国际化文本
const i18n = {
  zh: {
    mottoFilePath: 'Motto 文件路径',
    mottoFilePathDesc: 'Vault 根目录下存储 motto 的 markdown 文件路径',
    greetingEnabled: '显示问候语',
    greetingEnabledDesc: '根据时间显示暖心问候',
    fontSize: '字体大小',
    fontSizeDesc: 'Motto 文字大小 (px)',
  },
  en: {
    mottoFilePath: 'Motto File Path',
    mottoFilePathDesc: 'Path to the markdown file containing mottos in your vault',
    greetingEnabled: 'Show Greeting',
    greetingEnabledDesc: 'Show time-based greeting',
    fontSize: 'Font Size',
    fontSizeDesc: 'Motto font size (px)',
  },
};

export function t(key: keyof typeof i18n.zh, lang: Language): string {
  return i18n[lang][key];
}

export const DEFAULT_SETTINGS: MottoTabSettings = {
  mottoFilePath: '.mottos.md',
  greetingEnabled: true,
  fontSize: 28,
};

export class MottoTabSettingsTab extends PluginSettingTab {
  plugin: MottoTabPlugin;

  constructor(app: App, plugin: MottoTabPlugin) {
    super(app, plugin as unknown as import('obsidian').Plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    // 使用 Obsidian 系统语言
    const lang = getSystemLanguage();

    containerEl.empty();

    new Setting(containerEl)
      .setName(t('mottoFilePath', lang))
      .setDesc(t('mottoFilePathDesc', lang))
      .addText(text => text
        .setPlaceholder('.mottos.md')
        .setValue(this.plugin.settings.mottoFilePath)
        .onChange(async (value) => {
          this.plugin.settings.mottoFilePath = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName(t('greetingEnabled', lang))
      .setDesc(t('greetingEnabledDesc', lang))
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.greetingEnabled)
        .onChange(async (value) => {
          this.plugin.settings.greetingEnabled = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName(t('fontSize', lang))
      .setDesc(t('fontSizeDesc', lang))
      .addSlider(slider => slider
        .setLimits(16, 48, 2)
        .setValue(this.plugin.settings.fontSize)
        .onChange(async (value) => {
          this.plugin.settings.fontSize = value;
          await this.plugin.saveSettings();
        }));
  }
}