import { Building2, Factory, Store, Warehouse, Truck, ShoppingBag } from "lucide-react";

const solutions = [
  { icon: Building2, title: "Escritórios" },
  { icon: Factory, title: "Indústrias" },
  { icon: Store, title: "Comércio" },
  { icon: Warehouse, title: "Logística" },
  { icon: Truck, title: "Transportes" },
  { icon: ShoppingBag, title: "Varejo" },
];

export const Solutions = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Soluções que resultam em mais rentabilidade
          </h2>
          <p className="text-muted-foreground text-lg">
            Conheça as vantagens do GLP Nacional para o seu tipo de negócio
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center p-6 bg-secondary rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
              >
                <Icon className="w-12 h-12 text-primary mb-3" />
                <p className="text-sm font-medium text-center">{solution.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
