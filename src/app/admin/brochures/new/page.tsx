import BrochureForm from "@/components/admin/brochures/BrochureForm";

export default function NewBrochurePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-gold-light">Add New Brochure</h1>
        <p className="mt-1 text-gray-500">Create a new property brochure listing</p>
      </div>

      <BrochureForm />
    </div>
  );
}
