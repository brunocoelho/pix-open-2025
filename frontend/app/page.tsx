"use client";

import { Suspense } from "react";
import Main from "./components/main";

function Loading() {
  return <>Carregando...</>;
}

export default function BTChampionship() {
  return (
    <Suspense fallback={<Loading />}>
      <Main />
    </Suspense>
  );
}
