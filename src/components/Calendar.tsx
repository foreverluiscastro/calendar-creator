'use client';
import { useState } from 'react';
import Event from './Event';

const daysOfWeek = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
const monthNames = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];

const generateCalendarMatrix = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const matrix = [];
  let day = 1 - firstDay;

  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      week.push(day > 0 && day <= daysInMonth ? day : null);
      day++;
    }
    matrix.push(week);
  }

  return matrix;
};

export default function Calendar() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(6); // July
  const [events, setEvents] = useState<Record<number, string[]>>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [limpieza, setLimpieza] = useState<Record<number, string>>({
    1: 'HNA LILIAN',
    2: 'HNA LUCY',
    3: '',
    4: '',
    5: '',
  });
  const [editingWeek, setEditingWeek] = useState<number | null>(null);

  const matrix = generateCalendarMatrix(year, month);
  const groupedWeeks = [
    matrix.slice(0, 2).flat(), // Weeks 1 & 2
    matrix.slice(2, 4).flat(), // Weeks 3 & 4
    matrix.slice(4, 6).flat(), // Weeks 5 & maybe 6
  ];

  const handleSaveEvent = (text: string) => {
    if (selectedDay !== null) {
      setEvents((prev) => ({
        ...prev,
        [selectedDay]: [...(prev[selectedDay] || []), text],
      }));
    }
  };

  const handleDeleteEvent = (day: number, index: number) => {
    setEvents((prev) => {
      const updated = [...(prev[day] || [])];
      updated.splice(index, 1);
      return { ...prev, [day]: updated };
    });
  };

  const DayCell = ({
    day,
    onClick,
    events,
    onDelete,
  }: {
    day: number | null;
    onClick: () => void;
    events?: string[];
    onDelete?: (index: number) => void;
  }) => (
    <div
      className={`w-[100px] h-[80px] border p-1 text-sm text-left align-top ${
        day ? 'hover:bg-blue-100 cursor-pointer' : 'bg-gray-50'
      }`}
      onClick={day ? onClick : undefined}
    >
      {day && <div className="font-bold">{day}</div>}
      {day && events && (
        <div className="text-xs mt-1 space-y-1">
          {events.map((event, i) => (
            <div
              key={i}
              className="bg-gray-100 p-1 rounded-sm flex justify-between items-start group"
            >
              <span className="w-[90%] break-words">{event}</span>
              <button
                className="text-red-500 font-bold ml-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(i);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 text-black">
      <button
        onClick={() => window.print()}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 print:hidden"
      >
        Imprimir Calendario
      </button>

      <div className="print-wrapper">
        {/* Header and nav */}
        <div className="flex justify-center items-center gap-4 mb-4 print:mb-2">
          <button
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 print:hidden"
            onClick={() => {
              if (month === 0) {
                setMonth(11);
                setYear((y) => y - 1);
              } else {
                setMonth((m) => m - 1);
              }
            }}
          >
            ◀
          </button>
          <h1 className="text-2xl font-bold">{monthNames[month]} {year}</h1>
          <button
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 print:hidden"
            onClick={() => {
              if (month === 11) {
                setMonth(0);
                setYear((y) => y + 1);
              } else {
                setMonth((m) => m + 1);
              }
            }}
          >
            ▶
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-14 text-center font-semibold text-xs mb-1">
          {daysOfWeek.concat(daysOfWeek).map((day, i) => (
            <div key={i} className="p-2 border bg-gray-100">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Rows */}
        {[0, 1].map((row) => (
          <div key={row} className="grid grid-cols-14 gap-0 mb-1">
            {groupedWeeks[row].map((day, idx) => (
              <DayCell
                key={idx}
                day={day}
                events={day ? events[day] : undefined}
                onClick={() => day && setSelectedDay(day)}
                onDelete={(i) => handleDeleteEvent(day!, i)}
              />
            ))}
          </div>
        ))}

        {/* Last row (week 5) */}
        <div className="grid grid-cols-7 gap-0 mb-4">
          {groupedWeeks[2].map((day, idx) => (
            <DayCell
              key={idx}
              day={day}
              events={day ? events[day] : undefined}
              onClick={() => day && setSelectedDay(day)}
              onDelete={(i) => handleDeleteEvent(day!, i)}
            />
          ))}
        </div>

        {/* Modal for adding event */}
        {selectedDay && (
          <Event
            day={selectedDay}
            onClose={() => setSelectedDay(null)}
            onSave={handleSaveEvent}
          />
        )}

        {/* LIMPIEZA Section */}
        <div className="border-t pt-4 flex flex-col items-center print:mt-2">
          <h2 className="text-xl font-semibold mb-4 text-center">LIMPIEZA</h2>
          <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
            {[1, 2, 3, 4].map((week) => (
              <div key={week} className="flex items-center gap-2">
                <label className="w-24 font-medium">{week} SEMANA:</label>
                {editingWeek === week ? (
                  <input
                    type="text"
                    autoFocus
                    className="flex-1 border rounded p-1 text-sm print:border-none print:p-0 print:text-base"
                    value={limpieza[week]}
                    onChange={(e) =>
                      setLimpieza((prev) => ({ ...prev, [week]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setEditingWeek(null);
                    }}
                    onBlur={() => setEditingWeek(null)}
                  />
                ) : (
                  <span
                    className="flex-1 text-sm p-1 cursor-pointer print:text-base"
                    onClick={() => setEditingWeek(week)}
                  >
                    {limpieza[week] || (
                      <span className="italic text-gray-400">[Hacer clic para editar]</span>
                    )}
                  </span>
                )}
              </div>
            ))}
          </div>
          {/* Week 5 */}
          <div className="flex items-center gap-2 mt-4">
            <label className="w-24 font-medium">5 SEMANA:</label>
            {editingWeek === 5 ? (
              <input
                type="text"
                autoFocus
                className="flex-1 border rounded p-1 text-sm print:border-none print:p-0 print:text-base"
                value={limpieza[5]}
                onChange={(e) =>
                  setLimpieza((prev) => ({ ...prev, 5: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setEditingWeek(null);
                }}
                onBlur={() => setEditingWeek(null)}
              />
            ) : (
              <span
                className="flex-1 text-sm p-1 cursor-pointer print:text-base"
                onClick={() => setEditingWeek(5)}
              >
                {limpieza[5] || (
                  <span className="italic text-gray-400">[Hacer clic para editar]</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
