import { defineStore } from "pinia";

export const useMarketcodeStore = defineStore("marketcodeStore", {
    persist: true,
    state: () => ({
        marketCode: null,
    }),
    actions: {
        setMarketCode(marketCode) {
            this.marketCode = marketCode;
        },
        resetMarketCode() {
            this.marketCode = null;
        },
    },
    getters: {
        getMarketCode: (state) => state.marketCode,
    },
});