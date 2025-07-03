import { defineStore } from "pinia";

export const useParameterStore = defineStore("parameterStore", {
    persist: true,
    state: () => ({
        sectionCode: [],
        marketCode: [],
        seriesCode: [],
        structCode: [],
        cfsi: [],
    }),
    actions: {
        setSectionCode(sectionCode) {
            this.sectionCode = sectionCode;
        },
        resetSectionCode() {
            this.sectionCode = [];
        },
        setMarketCode(marketCode) {
            this.marketCode = marketCode;
        },
        resetMarketCode() {
            this.marketCode = [];
        },
        setSeriesCode(seriesCode) {
            this.seriesCode = seriesCode;
        },
        resetSeriesCode() {
            this.seriesCode = [];
        },
        setStructCode(structCode) {
            this.structCode = structCode;
        },
        resetStructCode() {
            this.structCode = [];
        },
        setcfsi(cfsi) {
            this.cfsi = cfsi;
        },
        resetcfsi() {
            this.cfsi = [];
        },
    },
    getters: {
        getSectionCode: (state) => state.sectionCode,
        getMarketCode: (state) => state.marketCode,
        getSeriesCode: (state) => state.seriesCode,
        getStructCode: (state) => state.structCode,
        cfsi: (state) => state.cfsi,
    },
});