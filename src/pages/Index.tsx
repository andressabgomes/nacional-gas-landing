import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { Solutions } from "@/components/Solutions";
import { AgroSection } from "@/components/AgroSection";
import { Stats } from "@/components/Stats";
import { Clients } from "@/components/Clients";
import { Contact } from "@/components/Contact";
import { AdminLink } from "@/components/AdminLink";

const Index = () => {
  return (
    <div className="min-h-screen">
      <AdminLink />
      <Hero />
      <Benefits />
      <Solutions />
      <AgroSection />
      <Stats />
      <Clients />
      <Contact />
    </div>
  );
};

export default Index;
