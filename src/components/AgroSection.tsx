import { Button } from "@/components/ui/button";
import { Leaf, Sprout } from "lucide-react";
import agroImage from "@/assets/agro-section.jpg";

export const AgroSection = () => {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src={agroImage} 
              alt="Setor agropecuário" 
              className="rounded-lg shadow-2xl"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-5xl font-bold">
              O Agro tem muito a ganhar com o GLP Nacional
            </h2>
            <p className="text-lg opacity-90">
              Soluções especializadas para o setor agropecuário com a melhor 
              relação custo-benefício do mercado. Impulsione sua produção com 
              energia confiável e econômica.
            </p>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                Conheça as soluções específicas para o Agro:
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-primary-foreground/10 p-4 rounded-lg">
                  <Leaf className="w-8 h-8" />
                  <span className="font-medium">Secagem de grãos</span>
                </div>
                <div className="flex items-center gap-3 bg-primary-foreground/10 p-4 rounded-lg">
                  <Sprout className="w-8 h-8" />
                  <span className="font-medium">Aquecimento de estufas</span>
                </div>
              </div>
            </div>
            <Button size="lg" variant="secondary" className="font-semibold">
              Saiba mais
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
