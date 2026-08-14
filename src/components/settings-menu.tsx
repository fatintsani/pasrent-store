"use client";

import React, { useState } from "react";
import { useSettings } from "./settings-provider";
import { useTheme } from "next-themes";
import { X, Info, Check } from "lucide-react";

export function SettingsMenu() {
  const {
    readingMode,
    highContrast,
    fontSize,
    fontFamily,
    language,
    setReadingMode,
    setHighContrast,
    setFontSize,
    setFontFamily,
    setLanguage,
    isSettingsOpen,
    setIsSettingsOpen,
  } = useSettings();

  const { theme, setTheme } = useTheme();
  const [showInfo, setShowInfo] = useState(false);

  if (!isSettingsOpen) return null;

  const t = language === "id" 
    ? {
        settings: "Pengaturan",
        theme: "Tema",
        dark: "Gelap",
        light: "Terang",
        readingMode: "Reading Mode",
        off: "Mati",
        on: "Aktif",
        highContrast: "Kontras Tinggi",
        appInfo: "Info Aplikasi",
        fontSize: "Ukuran Font",
        fontType: "Jenis Font",
        language: "Bahasa",
        hideMenu: "Hide Menu",
        close: "Tutup",
        infoDesc: "Aplikasi Pasrent Store v1.0. Dibuat dengan Next.js dan Tailwind CSS."
      }
    : {
        settings: "Settings",
        theme: "Theme",
        dark: "Dark",
        light: "Light",
        readingMode: "Reading Mode",
        off: "Off",
        on: "On",
        highContrast: "High Contrast",
        appInfo: "App Info",
        fontSize: "Font Size",
        fontType: "Font Type",
        language: "Language",
        hideMenu: "Hide Menu",
        close: "Close",
        infoDesc: "Pasrent Store App v1.0. Built with Next.js and Tailwind CSS."
      };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
        onClick={() => setIsSettingsOpen(false)}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-[#0d0e11] z-[70] shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t.settings}</h2>
          <button 
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Theme */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.theme}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 py-2 px-4 rounded-lg border ${theme === "dark" ? "bg-[#5000ef] border-[#5000ef] text-white" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              >
                {t.dark}
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 py-2 px-4 rounded-lg border ${theme === "light" ? "bg-[#5000ef] border-[#5000ef] text-white" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              >
                {t.light}
              </button>
            </div>
          </div>

          {/* Reading Mode */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.readingMode}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setReadingMode(false)}
                className={`flex-1 py-2 px-4 rounded-lg border ${!readingMode ? "bg-[#5000ef] border-[#5000ef] text-white" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              >
                {t.off}
              </button>
              <button
                onClick={() => setReadingMode(true)}
                className={`flex-1 py-2 px-4 rounded-lg border ${readingMode ? "bg-[#5000ef] border-[#5000ef] text-white" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              >
                {t.on}
              </button>
            </div>
          </div>

          {/* High Contrast */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.highContrast}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setHighContrast(false)}
                className={`flex-1 py-2 px-4 rounded-lg border ${!highContrast ? "bg-[#5000ef] border-[#5000ef] text-white" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              >
                {t.off}
              </button>
              <button
                onClick={() => setHighContrast(true)}
                className={`flex-1 py-2 px-4 rounded-lg border ${highContrast ? "bg-[#5000ef] border-[#5000ef] text-white" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              >
                {t.on}
              </button>
            </div>
          </div>

          {/* App Info */}
          <div className="space-y-3">
            <button
              onClick={() => setShowInfo(true)}
              className="w-full py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between"
            >
              <span className="font-medium">{t.appInfo}</span>
              <Info className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.fontSize}</h3>
            <div className="flex gap-2">
              {(["sm", "md", "lg"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`flex-1 py-2 px-4 rounded-lg border uppercase ${fontSize === size ? "bg-[#5000ef] border-[#5000ef] text-white" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.fontType}</h3>
            <div className="grid grid-cols-2 gap-2">
              {(["poppins", "inter", "roboto", "outfit"] as const).map((font) => (
                <button
                  key={font}
                  onClick={() => setFontFamily(font)}
                  className={`py-2 px-4 rounded-lg border capitalize flex items-center justify-between ${fontFamily === font ? "bg-[#5000ef] border-[#5000ef] text-white" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                >
                  {font}
                  {fontFamily === font && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.language}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage("id")}
                className={`flex-1 py-2 px-4 rounded-lg border ${language === "id" ? "bg-[#5000ef] border-[#5000ef] text-white" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              >
                Indonesia {language === "id" && "(Aktif)"}
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`flex-1 py-2 px-4 rounded-lg border ${language === "en" ? "bg-[#5000ef] border-[#5000ef] text-white" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              >
                Inggris {language === "en" && "(Aktif)"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer (Hide Menu button) */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold transition-colors"
          >
            {t.hideMenu}
          </button>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowInfo(false)} />
          <div className="relative bg-white dark:bg-[#0d0e11] p-6 rounded-2xl w-full max-w-sm shadow-2xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold mb-2">{t.appInfo}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t.infoDesc}</p>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full py-2 bg-[#5000ef] text-white rounded-lg font-bold hover:bg-[#4000c0] transition-colors"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
