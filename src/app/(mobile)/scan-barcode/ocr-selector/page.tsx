import { Suspense } from "react";
import DigitalClient from "../../../../components/DigitalOcr";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <DigitalClient />
    </Suspense>
  );
}
