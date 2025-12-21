'use client'; 

import React, { useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Vote, Leaf, Activity, Sword } from "lucide-react";
import { JournalSpread } from "./JournalSpread";

import { PLOTS_BY_EVENT, type EventId } from "web/plots_website_timeline/plotRegistry";


type IconType = "vote" | "leaf" | "activity" | "sword";

interface TimelineEvent {
  id: EventId;
  label: string;       // Short name shown next to dot
  title: string;       // Used by JournalSpread if you want later
  date: string;
  timeRange: string;
  year: number;
  position: number;    // kept for compatibility (not used here)
  cluster: string;
  color: string;
  iconType: IconType;
  keywords: string[];
  cartoonTheme: string;
  worldEvents: string[];
}

function renderIcon(iconType: IconType, color: string) {
  const common = { size: 18, strokeWidth: 2, color } as const;
  switch (iconType) {
    case "vote":
      return <Vote {...common} />;
    case "leaf":
      return <Leaf {...common} />;
    case "activity":
      return <Activity {...common} />;
    case "sword":
      return <Sword {...common} />;
    default:
      return null;
  }
}

export default function TimelineBook() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const events: TimelineEvent[] = useMemo(
    () => [
      {
        id: "trump",
        label: "US Elections",
        title: "US Presidential Elections",
        date: "2016 & 2020",
        timeRange: "2016 & 2020",
        year: 2016,
        position: 5,
        cluster: "Political Events (President Trump Elections)",
        color: "#457B9D",
        iconType: "vote",
        keywords: [" election ", " campaign ", " vote ", " results "],
        cartoonTheme: "TRUMP & Politics",
        worldEvents: [
          "2016: Trump vs. Clinton campaign + surprise result",
          "2020: COVID-era election, mail-in voting, delayed results",
          "Intense polarization reflected in caption tone",
        ],
      },
      {
        id: "climate",
        label: "Climate Crisis",
        title: "Climate & Environment",
        date: "2018–2023",
        timeRange: "2018–2023",
        year: 2019,
        position: 35,
        cluster: "Climate & Environment",
        color: "#2A9D8F",
        iconType: "leaf",
        keywords: [" climate ", " heat ", " flood ", " planet "],
        cartoonTheme: "Warming World",
        worldEvents: [
          "Massive climate marches and youth movements",
          "Record-breaking heatwaves and wildfires",
          "Climate anxiety increasingly visible in humor",
        ],
      },
      {
        id: "covid",
        label: "COVID-19",
        title: "COVID-19 Pandemic",
        date: "2020–2021",
        timeRange: "2020–2021",
        year: 2020,
        position: 65,
        cluster: "COVID-19 Pandemic",
        color: "#E63946",
        iconType: "activity",
        keywords: [" mask ", "zoom", " home ", " distance "],
        cartoonTheme: "Lockdown Life",
        worldEvents: [
          "Global lockdowns and social distancing",
          "Zoom meetings, remote work, and cabin fever",
          "Surreal daily life",
        ],
      },
      {
        id: "war",
        label: "Wars & Conflicts",
        title: "Wars & Geopolitics",
        date: "2022–2023",
        timeRange: "2022–2023",
        year: 2022,
        position: 90,
        cluster: "Wars & Conflicts",
        color: "#8D5B4C",
        iconType: "sword",
        keywords: [" war ", " border ", " sanctions ", " energy "],
        cartoonTheme: "Fragile World Order",
        worldEvents: [
          "Russian invasion of Ukraine and ongoing war coverage",
          "Energy crisis and inflation spikes",
          "News fatigue and doomscrolling in captions",
        ],
      },
    ],
    []
  );

  const timelineHidden = selectedEvent !== null;

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "40px",
          background: "#FDFDF8",
          position: "relative",
        }}
      >
        <h1
          className="comic-title"
          style={{
            fontSize: "40px",
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#1A1A1A",
          }}
        >
          HOW MAJOR WORLD EVENTS SHAPED HUMOR (2016–2023)
        </h1>

        <p className="comic-text" style={{ marginBottom: "40px" }}>
          Four major moments that reshaped the news — and the way New Yorker
          captions joked about the world. Is there a relationship between the dominant event keywords and the terms used in the image captions? Click a dot to explore the event.
        </p>

        {!timelineHidden && (
        <div
          style={{
            position: "absolute",
            left: "120px",
            top: "220px",
            transform: "scale(2)",
            transformOrigin: "top left",
          }}
        >
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "6px",
              height: "280px",
              background: "black",
              borderRadius: "4px",
              zIndex: 10,
            }}
          />

          {/* Dots + labels + icons */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "280px",
              paddingLeft: "40px",
              zIndex: 20,
            }}
          >
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: 0,
                  textAlign: "left",
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    background: event.color,
                    borderRadius: "50%",
                    border: "4px solid black",
                  }}
                />

                {/* Icon */}
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    border: "2px solid #1A1A1A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#FDFDF8",
                  }}
                >
                  {renderIcon(event.iconType, event.color)}
                </div>

                {/* Text */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span
                    className="comic-title"
                    style={{
                      fontSize: "15px",
                      color: "#1A1A1A",
                      textTransform: "uppercase",
                    }}
                  >
                    {event.label}
                  </span>
                  <span className="comic-text" style={{ fontSize: "14px", opacity: 0.8 }}>
                    {event.date}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      </div>

      {/* Journal Spread Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <JournalSpread event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
