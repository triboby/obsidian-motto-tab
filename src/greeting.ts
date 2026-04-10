import { getLanguage } from 'obsidian';

// 国际化配置
export type Language = 'zh' | 'en';

interface GreetingConfig {
  start: number;  // 0-23
  end: number;    // 0-23
  zh: string;
  en: string;
}

const GREETINGS: GreetingConfig[] = [
  { start: 5, end: 11, zh: '早上好，今天也要加油呀', en: 'Good morning, stay motivated!' },
  { start: 12, end: 17, zh: '下午好，保持好状态', en: 'Good afternoon, keep it up!' },
  { start: 18, end: 21, zh: '晚上好，辛苦了', en: 'Good evening, great work today!' },
  { start: 22, end: 23, zh: '夜深了，注意休息', en: 'Late night, take care!' },
  { start: 0, end: 4, zh: '夜深了，注意休息', en: 'Late night, take care!' },
];

export function getGreeting(lang: Language = 'zh'): string {
  const hour = new Date().getHours();

  for (const greeting of GREETINGS) {
    if (hour >= greeting.start && hour <= greeting.end) {
      return lang === 'zh' ? greeting.zh : greeting.en;
    }
  }

  return GREETINGS[0].zh;
}

// 从 Obsidian 获取系统语言
export function getSystemLanguage(): Language {
  const lang = getLanguage();
  if (lang && lang.startsWith('zh')) {
    return 'zh';
  }
  return 'en';
}