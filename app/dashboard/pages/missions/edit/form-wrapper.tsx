"use client";

import EditMissionForm from "./form";

interface FormWrapperProps {
  mission: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FormWrapper({ mission, onClose, onSuccess }: FormWrapperProps) {
  return <EditMissionForm mission={mission} onClose={onClose} onSuccess={onSuccess} />;
}
