import { getProjectBySlug } from "@/lib/db"
import { notFound } from "next/navigation"
import AccessPage from "@/components/access/access-page"

interface TesterPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function TesterPage({ params }: TesterPageProps) {
  const { slug } = await params

  // Fetch project data from database
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <AccessPage
      projectName={project.name}
      slug={slug}
      requirements={{
        minScore: project.criteria.minScore,
        minVouches: project.criteria.minVouches,
        positiveReviews: project.criteria.positiveReviews,
        minAccountAge: project.criteria.minAccountAge
      }}
      benefits={project.benefits}
      destinationUrl={project.destination_url}
    />
  )
}
