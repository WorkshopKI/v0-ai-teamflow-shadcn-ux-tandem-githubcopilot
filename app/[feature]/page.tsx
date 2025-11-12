import { notFound } from "next/navigation"
import { featureRegistry } from "@/lib/features"

// Import features to register them server-side
import "@/features"

interface FeaturePageProps {
  params: Promise<{ feature: string }>
}

// Make this route dynamic since features are registered at runtime
export const dynamic = "force-dynamic"

export default async function FeaturePage({ params }: FeaturePageProps) {
  const { feature: featureId } = await params
  const feature = featureRegistry.get(featureId)

  if (!feature || !feature.enabled) {
    notFound()
  }

  const Component = feature.component
  return <Component />
}
