const stats = [
  { value: "+25K", label: "Clientes atendidos" },
  { value: "+9.5mi", label: "m³ de GLP fornecidos" },
  { value: "+16K", label: "Toneladas de CO₂ evitadas" },
  { value: "44", label: "Anos de experiência" },
  { value: "+70", label: "Municípios atendidos" },
];

export const Stats = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
          Transicione sem custos com o apoio dos maiores especialistas em energia
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-primary">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
