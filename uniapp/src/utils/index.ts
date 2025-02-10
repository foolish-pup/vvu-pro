/**
 * 防抖函数
 * @param fn 函数
 * @param delay 延迟时间
 * @returns
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timer: number | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 运行环境
 * @returns true: 微信环境 false: 非微信环境
 */
export function onInWeChat() {
  try {
    const systemInfo = uni.getSystemInfoSync();
    console.log(systemInfo.platform);
    if (systemInfo.platform === 'tt' || systemInfo.platform === 'devtools') {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('获取系统信息失败', err);
    return false;
  }
}
