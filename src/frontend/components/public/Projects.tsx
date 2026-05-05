import prisma from "@/backend/db/prisma";
import ProjectGallery from "./ProjectGallery";

export const revalidate = 60;

export default async function Projects() {
  let projects: any[] = [];
  try {
    projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Database connection failed, using fallback projects");
  }

  if (projects.length === 0) {
    projects = [
      { 
        id: 1, 
        title: '3D UI Portfolio', 
        description: 'An immersive professional portfolio featuring WebGL particle systems and 3D interactions using React Three Fiber and GSAP.', 
        imageUrl: null, 
        liveUrl: '#', 
        githubUrl: '#', 
        tags: ['Next.js', 'Three.js', 'Tailwind'], 
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id: 2, 
        title: 'E-Commerce Platform', 
        description: 'A full-stack headless e-commerce solution with advanced filtering, cart management, and seamless checkout integrations.', 
        imageUrl: null, 
        liveUrl: '#', 
        githubUrl: '#', 
        tags: ['React', 'Node.js', 'PostgreSQL'], 
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];
  }

  return (
    <section id="projects" className="py-40 relative bg-background scroll-mt-24 transition-colors duration-500">
      <div className="section-divider absolute top-0 left-0" />
      <div className="container mx-auto px-8 md:px-12 max-w-7xl relative z-10">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-2 text-gradient inline-block">Projects</h2>
          <p className="text-muted">A selection of recent work.</p>
        </div>
        
        <ProjectGallery projects={projects} />
      </div>
    </section>
  );
}
