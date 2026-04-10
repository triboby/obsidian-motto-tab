import { Plugin, WorkspaceLeaf } from 'obsidian';
import { MottoTabSettingsTab, MottoTabSettings, DEFAULT_SETTINGS } from './src/settings';
import { MottoView, MOTTO_VIEW_TYPE } from './src/ui';

export default class MottoTabPlugin extends Plugin {
  settings: MottoTabSettings = DEFAULT_SETTINGS;

  async onload() {
    await this.loadSettings();

    // 注册设置
    this.addSettingTab(new MottoTabSettingsTab(this.app, this));

    // 注册新标签页视图
    this.registerView(
      MOTTO_VIEW_TYPE,
      (leaf: WorkspaceLeaf) => new MottoView(leaf, this.settings)
    );

    // 当打开新标签页时，显示自定义页面
    this.registerEvent(
      this.app.workspace.on('active-leaf-change', (leaf: WorkspaceLeaf | null) => {
        if (!leaf) return;

        const viewType = leaf.getViewState().type;
        if (viewType === 'empty') {
          leaf.setViewState({
            type: MOTTO_VIEW_TYPE,
            active: true,
          });
        }
      })
    );

    // 初始化时，如果当前存在 empty tab，则替换它
    this.app.workspace.onLayoutReady(() => {
      this.app.workspace.getLeavesOfType('empty').forEach((leaf) => {
        leaf.setViewState({
          type: MOTTO_VIEW_TYPE,
          active: true,
        });
      });
    });
  }

  async loadSettings() {
    this.settings = { ...DEFAULT_SETTINGS, ...await this.loadData() };
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}