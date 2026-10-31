import { StitchLanding } from "@/components/stitch/StitchLanding";

/**
 * Publish the same Stitch landing page used by the approved local design.
 * Keep the farmer and admin dashboard routes independent of this entry point.
 */
export default function Home() {
  return <StitchLanding />;
}
