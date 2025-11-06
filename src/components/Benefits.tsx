import { Shield, Zap, TrendingDown, Award } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Segurança energética",
    description: "Garantia de fornecimento contínuo",
  },
  {
    icon: Zap,
    title: "Energia limpa",
    description: "Soluções sustentáveis e eficientes",
  },
  {
    icon: TrendingDown,
    title: "Redução de custos",
    description: "Economize até 30% na conta",
  },
  {
    icon: Award,
    title: "Qualidade certificada",
    description: "Padrões internacionais",
  },
];

export const Benefits = () => {
  return (
    <section className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
          Energia que trabalha a favor da sua empresa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 backdrop-blur-sm">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl">{benefit.title}</h3>
                <p className="opacity-90">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
