import { PageHeader } from "@/components/ui/page-header";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { projects } from "@/data/mockData";

export default function ProjectsPage() {
  return (
    <div>
      <PageHeader
        title="Проекты / ЖК"
        description="Все жилые комплексы компании"
        actions={
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" /> Новый проект
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
