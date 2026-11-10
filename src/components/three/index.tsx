"use client";

import dynamic from "next/dynamic";

const Fallback = () => <div className="size-full animate-pulse" />;

export const BrainGraph = dynamic(() => import("./brain-graph"), { ssr: false, loading: Fallback });
