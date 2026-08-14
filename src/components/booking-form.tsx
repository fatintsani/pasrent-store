"use client";

import * as React from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { getBookedIntervals } from "@/app/actions/availability";
import { getGames, getPackages } from "@/app/actions/catalog";
import { getConsoleTypes } from "@/app/actions/admin/console-types";
import { Calendar, Gamepad2, Plus, AlertCircle, CheckCircle } from "lucide-react";
import { useCart, CartItem } from "./cart-provider";

interface Game {
  id: string;
  name: string;
  console_type: string;
}

interface Package {
  id: string;
  name: string;
  duration_hours: number;
  price: number;
  console_type: string;
}

interface ConsoleType {
  id: string;
  code: string;
  name: string;
}

export function BookingForm() {
  const { addToCart, cart } = useCart();
  const [games, setGames] = React.useState<Game[]>([]);
  const [packages, setPackages] = React.useState<Package[]>([]);
  const [consoleTypes, setConsoleTypes] = React.useState<ConsoleType[]>([]);
  
  // Current Item State
  const [selectedConsole, setSelectedConsole] = React.useState<string>("");
  const [selectedPackage, setSelectedPackage] = React.useState<string>("");
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = React.useState<string>("");
  const [selectedGames, setSelectedGames] = React.useState<string[]>([]);
  
  // Availability State
  const [bookedData, setBookedData] = React.useState<{ startTime: number, endTime: number, unitId: string }[]>([]);
  const [availableUnits, setAvailableUnits] = React.useState<string[]>([]);
  const [totalUnits, setTotalUnits] = React.useState<number>(0);

  // Custom Alert Modal State
  const [customAlert, setCustomAlert] = React.useState<{ isOpen: boolean; message: string; isError: boolean }>({ isOpen: false, message: '', isError: false });

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", 
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
  ];

  // Fetch catalog on mount
  React.useEffect(() => {
    getGames().then(res => { if (res.success) setGames(res.data); });
    getPackages().then(res => { if (res.success) setPackages(res.data); });
    getConsoleTypes().then(res => { if (res.success) setConsoleTypes(res.data); });
  }, []);

  // Fetch availability when console changes
  React.useEffect(() => {
    if (!selectedConsole) {
      setBookedData([]);
      setAvailableUnits([]);
      setTotalUnits(0);
      return;
    }
    getBookedIntervals(selectedConsole).then((res) => {
      if (res.success) {
        setBookedData(res.data || []);
        setAvailableUnits(res.units || []);
        setTotalUnits(res.totalUnits || 0);
      }
    });
  }, [selectedConsole]);

  // Reset time when inputs change
  React.useEffect(() => {
    setSelectedTime("");
  }, [selectedDate, selectedPackage, selectedConsole]);

  const normalizeCode = (raw: string) => {
    if (raw === 'CONSOLE-PS4') return 'PS4';
    if (raw === 'CONSOLE-PS3') return 'PS3';
    if (raw === 'CONSOLE-ALL') return 'ALL';
    return raw;
  };

  const normalizedSelectedConsole = normalizeCode(selectedConsole);

  const filteredPackages = packages.filter(p => normalizeCode(p.console_type) === normalizedSelectedConsole);
  const filteredGames = games.filter(g => {
    const c = normalizeCode(g.console_type);
    return c === normalizedSelectedConsole || c === "ALL";
  });
  const selectedPkg = packages.find(p => p.id === selectedPackage);

  const getSlotStatus = (time: string) => {
    if (!selectedDate || !selectedPkg || totalUnits === 0) return { status: 'blocked', freeUnitId: null };
    
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const slotStartTime = new Date(`${dateStr}T${time}`).getTime();
    const durationHours = selectedPkg.duration_hours;
    const slotEndTime = slotStartTime + durationHours * 60 * 60 * 1000;

    let freeUnitId = null;

    for (const unitId of availableUnits) {
      // Check if this unit is booked in DB
      const dbBookings = bookedData.filter(b => b.unitId === unitId);
      const hasDbConflict = dbBookings.some(b => slotStartTime < b.endTime && slotEndTime > b.startTime);
      
      // Check if this unit is booked in CART
      const cartBookings = cart.filter(c => c.unitId === unitId);
      const hasCartConflict = cartBookings.some(c => {
        const cStart = new Date(c.startTime).getTime();
        const cEnd = new Date(c.endTime).getTime();
        return slotStartTime < cEnd && slotEndTime > cStart;
      });

      if (!hasDbConflict && !hasCartConflict) {
        freeUnitId = unitId;
        break; // found a free unit!
      }
    }

    if (freeUnitId) {
      return { status: 'available', freeUnitId };
    }
    return { status: 'blocked', freeUnitId: null };
  };

  const handleAddToCart = () => {
    if (!selectedConsole || !selectedPackage || !selectedDate || !selectedTime || !selectedPkg) return;
    
    const slot = getSlotStatus(selectedTime);
    if (!slot.freeUnitId) {
      setCustomAlert({ isOpen: true, message: "Maaf, jadwal ini sudah penuh.", isError: true });
      return;
    }

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const startTime = new Date(`${dateStr}T${selectedTime}`).toISOString();
    const endTime = new Date(new Date(startTime).getTime() + selectedPkg.duration_hours * 60 * 60 * 1000).toISOString();

    const selectedGameNames = selectedGames.map(id => games.find(g => g.id === id)?.name || "");

    const consoleName = consoleTypes.find(c => c.code === selectedConsole)?.name || selectedConsole;

    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      unitId: slot.freeUnitId,
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      duration_hours: selectedPkg.duration_hours,
      gameIds: selectedGames,
      gameNames: selectedGameNames,
      startTime,
      endTime,
      subtotal: selectedPkg.price,
      consoleType: consoleName,
      dateStr,
      timeStr: selectedTime
    };

    addToCart(newItem);
    setCustomAlert({ isOpen: true, message: `Berhasil ditambahkan ke keranjang! (${newItem.consoleType} - ${newItem.packageName})`, isError: false });
    
    // Reset form
    setSelectedConsole("");
    setSelectedPackage("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedGames([]);
  };

  const toggleGame = (gameId: string) => {
    if (selectedGames.includes(gameId)) {
      setSelectedGames(selectedGames.filter(id => id !== gameId));
    } else {
      setSelectedGames([...selectedGames, gameId]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl md:rounded-[2.5rem] p-5 sm:p-6 md:p-10 shadow-sm max-w-4xl mx-auto">
      <h3 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-white">
        <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#5000ef] dark:text-[#00c3cb]" />
        Konfigurasi Pesanan
      </h3>
      
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        
        <div className="flex-1 flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">Pilih Konsol</label>
              <select 
                value={selectedConsole}
                onChange={(e) => {
                  setSelectedConsole(e.target.value);
                  setSelectedPackage("");
                  setSelectedGames([]);
                }}
                className="px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-sm sm:text-base bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 dark:focus:ring-[#00c3cb]/50 transition appearance-none"
              >
                <option value="" disabled>- Pilih -</option>
                {consoleTypes.map(ct => (
                  <option key={ct.id} value={ct.code}>{ct.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">Paket Sewa</label>
              <select 
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                disabled={!selectedConsole}
                className="px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-sm sm:text-base bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 dark:focus:ring-[#00c3cb]/50 transition appearance-none disabled:opacity-50"
              >
                <option value="" disabled>- Pilih Paket -</option>
                {filteredPackages.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - Rp {p.price.toLocaleString('id-ID')}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={!selectedPackage ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Pilih Jadwal
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex justify-center mb-6 sm:mb-8 border border-gray-200 dark:border-gray-800 overflow-x-auto">
              <style>{`
                .rdp { --rdp-cell-size: 36px; --rdp-accent-color: #5000ef; --rdp-background-color: #5000ef20; margin: 0; }
                @media (min-width: 640px) { .rdp { --rdp-cell-size: 40px; } }
                html.dark .rdp { --rdp-accent-color: #00c3cb; --rdp-background-color: #00c3cb20; }
                .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: var(--rdp-background-color); }
                .rdp-day_selected { background-image: linear-gradient(to right, #5000ef, #00c3cb); border: none; color: white; }
                .rdp-months { justify-content: center; }
              `}</style>
              <DayPicker 
                mode="single" 
                selected={selectedDate} 
                onSelect={setSelectedDate}
                disabled={[{ before: new Date() }]}
                className="text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3">
              {timeSlots.map((time) => {
                const { status } = getSlotStatus(time);
                const isBlocked = status === 'blocked';
                return (
                  <button
                    key={time}
                    type="button"
                    disabled={isBlocked || !selectedDate}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base font-semibold transition-all shadow-sm flex flex-col items-center justify-center ${
                      selectedTime === time 
                        ? "bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white border-transparent" 
                        : isBlocked
                        ? "bg-red-50 dark:bg-red-900/10 text-red-400 border-red-100 dark:border-red-900/30 cursor-not-allowed"
                        : "border-gray-200 dark:border-gray-700 hover:border-green-500 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900"
                    }`}
                  >
                    <span>{time}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`flex-1 flex flex-col gap-6 mt-4 md:mt-0 ${!selectedPackage ? 'opacity-50 pointer-events-none' : ''}`}>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">
              Pilih Game (Opsional)
            </h4>
            <div className="grid grid-cols-1 gap-2 sm:gap-3 max-h-[300px] sm:max-h-[350px] overflow-y-auto pr-2">
              {filteredGames.map(game => (
                <div 
                  key={game.id}
                  onClick={() => toggleGame(game.id)}
                  className={`cursor-pointer p-3 sm:p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    selectedGames.includes(game.id)
                    ? "border-[#5000ef] dark:border-[#00c3cb] bg-[#5000ef]/5 dark:bg-[#00c3cb]/10"
                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                    selectedGames.includes(game.id) ? "bg-[#5000ef] dark:bg-[#00c3cb] border-transparent" : "border-gray-400"
                  }`}>
                    {selectedGames.includes(game.id) && <i className="bi bi-check text-white text-lg"></i>}
                  </div>
                  <span className="font-medium text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-tight">{game.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button 
              type="button"
              onClick={handleAddToCart}
              disabled={!selectedTime || !selectedDate || !selectedPackage}
              className="flex items-center justify-center gap-2 w-full h-12 sm:h-14 bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-xl shadow-[#5000ef]/20"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Masukkan Keranjang
            </button>
          </div>
        </div>
        
      </div>

      {/* Custom Alert Modal */}
      {customAlert.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {customAlert.isError ? (
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {customAlert.isError ? "Peringatan" : "Berhasil"}
              </h3>
              <button 
                onClick={() => setCustomAlert(prev => ({ ...prev, isOpen: false }))}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300">
                {customAlert.message}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setCustomAlert(prev => ({ ...prev, isOpen: false }))}
                className="px-6 py-2.5 font-bold text-white rounded-xl transition bg-[#5000ef] hover:bg-[#4000c0]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
