import getApiDocs from "@/services/api-docs-config";
import ReactSwagger from "@/features/api-docs/components/SwaggerUI";

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}