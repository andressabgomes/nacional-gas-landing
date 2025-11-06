export const Clients = () => {
  const clients = [
    "Ambev",
    "Solar",
    "Dexco",
    "Walmart",
    "Carrefour",
    "JBS",
  ];

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
          Empresas que já se transformaram com Nacional Gás
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {clients.map((client, index) => (
            <div 
              key={index}
              className="text-2xl font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              {client}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
