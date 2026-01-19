import FilterCards from "@/components/filter-cards"
import CreatePageForm from "@/components/create-page-form"

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-[#EFE9DF]">
      {/* Filter Cards Section */}
      <FilterCards />

      {/* Create Form Section */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-8">
          <h2 className="font-serif text-3xl text-[#1E3A5F] mb-6">
            Configure Access Page
          </h2>
          <CreatePageForm />
        </div>
      </div>
    </div>
  )
}
