import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-industrial.jpg";
import { scrollToSection } from "@/lib/scroll";

export const Hero = () => {
  const handleContactClick = () => {
    scrollToSection('contato', 20);
  };

  return (
    <section className="relative bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Transição energética a custo zero para a sua indústria
            </h1>
            <p className="text-lg lg:text-xl opacity-90">
              Economize até 30% na sua conta de energia e contribua para um futuro mais sustentável.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="font-semibold"
              onClick={handleContactClick}
            >
              Fale com um consultor
            </Button>
          </div>
          <div className="relative">
            <img 
              src={heroImage} 
              alt="Profissional em ambiente industrial" 
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
