"use client";

import { useState } from "react";
import { pick } from "@/lib/copy/pick";

// Choose a copy variant once per mount: stable across re-renders (no flicker) and
// resolved on the client (no SSR/hydration mismatch). Pass one of the arrays from
// the copy constants. Editing copy = editing those arrays, nothing here.
export function useVariant<T>(arr: readonly T[]): T {
  return useState(() => pick(arr))[0];
}
