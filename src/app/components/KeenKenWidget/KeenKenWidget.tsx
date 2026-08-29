"use client";
// Top-level Keen & Ken floating widget. Owns only whether the panel is open;
// the conversation phase itself lives in useKeenKenSession. Mounted once, site-
// wide, from src/app/layout.tsx.
import { useState } from "react";
import TriggerButton from "./TriggerButton";
import WidgetPanel from "./WidgetPanel";
import { useKeenKenSession } from "./useKeenKenSession";

export default function KeenKenWidget() {
  const [open, setOpen] = useState(false);
  const session = useKeenKenSession();

  const handleClose = () => {
    session.close();
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    if (session.phase === "closed") session.reset();
  };

  return (
    <>
      {!open && <TriggerButton onClick={handleOpen} />}
      {open && <WidgetPanel session={session} onClose={handleClose} />}
    </>
  );
}
