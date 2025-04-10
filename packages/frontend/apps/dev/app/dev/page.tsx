"use client";

import { ModeContext } from "@this-project/frontend-util-mode-next";
import { useContext } from "react";
import "./page.tsx.guc.css";

export default function Page() {
  const { setMode, mode } = useContext(ModeContext);
  return (
    <div className="m-[96px]">
      <button
        onClick={() =>
          setMode(
            mode === "dark" ? "system" : mode === "system" ? "light" : "dark"
          )
        }
      >
        toggle dark mode (currently {mode})
      </button>
    </div>
  );
}
