import ProblemStatement from '@/components/shared/ProblemStatement'
import ToolComingSoon from '@/components/shared/ToolComingSoon'

export default function CostContainmentPage() {
  return (
    <div>
      <ProblemStatement
        title="Vendor Directory for Cost Containment"
        description="The right vendor partnerships can save your clients thousands. Our searchable directory helps you find specialized vendors for PBM, utilization review, disease management, and more—with integration details and specialty information."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ToolComingSoon
          toolName="Cost Containment Vendor Directory"
          description="Searchable directory with filters for specialty, integration requirements, and group size compatibility."
          expectedDate="Q3 2025"
        />
      </div>
    </div>
  )
}
