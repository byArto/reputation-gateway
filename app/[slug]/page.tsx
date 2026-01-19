import TesterView from "@/components/tester-view"

interface TesterPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function TesterPage({ params }: TesterPageProps) {
  const { slug } = await params

  // Convert slug to display name (e.g., "my-project" -> "My Project")
  const projectName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <TesterView
      projectName={projectName}
      slug={slug}
      requirements={[
        "Ethos Score minimum 1400",
        "At least 1 vouch (older than 24h)",
        "Positive review balance",
        "Account age: 7+ days",
      ]}
    />
  )
}
