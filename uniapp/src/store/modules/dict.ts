import { defineStore } from "pinia";
import DictAPI, { type DictVO, type DictData } from "@/api/system/dict";
import { setDictCache, getDictCache } from "@/utils/cache";
export const useDictStore = defineStore("dict", () => {
  const dictionary = ref<Record<string, DictData[]>>(getDictCache());

  const setDictionary = (dict: DictVO) => {
    dictionary.value[dict.dictCode] = dict.dictDataList;
    setDictCache(dictionary.value);
  };

  const loadDictionaries = async () => {
    const dictList = await DictAPI.getList();
    dictList.forEach(setDictionary);
  };

  const getDictionary = (dictCode: string): DictData[] => {
    return dictionary.value[dictCode] || [];
  };

  const clearDictionaryCache = () => {
    dictionary.value = {};
  };

  const updateDictionaryCache = async () => {
    clearDictionaryCache(); // 先清除旧缓存
    await loadDictionaries(); // 重新加载最新字典数据
  };

  return {
    dictionary,
    setDictionary,
    loadDictionaries,
    getDictionary,
    clearDictionaryCache,
    updateDictionaryCache,
  };
});
