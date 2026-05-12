import { useEffect } from "react";
import { useLocation } from "wouter";

export default function SavedBundles() {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation("/assets?tab=bundles"); }, []);
  return null;
}
