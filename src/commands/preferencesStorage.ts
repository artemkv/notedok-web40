import { CommandType, SaveSortingOrderCommand } from "../commands";
import { Prefs, SortingOrder } from "../model";

const prefsKey = "notedok.com/prefs";
const prefsVersion = 1;

const emptyPrefs = {
  version: prefsVersion,
  sortingOrder: SortingOrder.Alphabetic,
};

export const loadPrefs = (): Prefs => {
  const json = localStorage.getItem(prefsKey);
  if (!json) {
    return emptyPrefs;
  }
  try {
    const prefs = JSON.parse(json);
    if (prefs.version !== prefsVersion) {
      return emptyPrefs;
    }
    return prefs;
  } catch (err) {
    console.error(`Could not restore prefs (${err})`);
    return emptyPrefs;
  }
};

const savePrefs = (prefs: Prefs) => {
  localStorage.setItem(prefsKey, JSON.stringify(prefs));
};

export const SaveSortingOrder = (
  sortingOrder: SortingOrder
): SaveSortingOrderCommand => ({
  type: CommandType.SaveSortingOrder,
  sortingOrder,
  execute: async () => {
    const prefs = loadPrefs();
    prefs.sortingOrder = sortingOrder;
    savePrefs(prefs);
  },
});
