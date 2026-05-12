import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ProductPages() {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation("/storefronts"); }, []);
  return null;
}
