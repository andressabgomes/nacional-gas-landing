import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Usar função RPC para inserir lead (bypass RLS via SECURITY DEFINER)
      const { data, error } = await supabase.rpc('insert_lead', {
        p_name: formData.name,
        p_email: formData.email,
        p_phone: formData.phone,
        p_company: formData.company || null,
        p_message: formData.message || null,
      });

      if (error) {
        console.error("Erro ao salvar lead:", error);
        toast({
          variant: "destructive",
          title: "Erro ao enviar mensagem",
          description: error.message || "Por favor, tente novamente.",
        });
      } else {
        console.log("Lead salvo com sucesso. ID:", data);
        
        // Enviar emails (cliente e backoffice) via Edge Function
        if (data) {
          try {
            console.log("📧 Enviando emails... Dados do lead:", data);
            const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-lead-emails', {
              body: data
            });
            
            if (emailError) {
              console.error("❌ Erro ao enviar emails:", emailError);
              console.error("Detalhes do erro:", JSON.stringify(emailError, null, 2));
            } else {
              console.log("✅ Resposta do envio de emails:", JSON.stringify(emailResponse, null, 2));
              
              // Mostrar informações sobre o envio
              if (emailResponse?.backofficeEmailSent) {
                console.log("✅ Email para backoffice enviado com sucesso! ID:", emailResponse.backofficeEmailId);
              } else {
                console.warn("⚠️ Email para backoffice não foi enviado:", emailResponse?.backofficeEmailError);
              }
              
              if (emailResponse?.clientEmailSent) {
                console.log("✅ Email para cliente enviado com sucesso! ID:", emailResponse.clientEmailId);
              } else if (emailResponse?.clientEmailSkipped) {
                console.warn("⚠️ Email para cliente pulado (domínio de teste):", emailResponse.clientEmailError);
              } else {
                console.warn("⚠️ Email para cliente não foi enviado:", emailResponse?.clientEmailError);
              }
            }
          } catch (emailError) {
            // Não bloquear o sucesso do formulário se o email falhar
            console.error("❌ Exceção ao enviar emails:", emailError);
            console.error("Stack trace:", emailError.stack);
          }
        }
        
        toast({
          title: "Mensagem enviada!",
          description: "Entraremos em contato em breve. Verifique seu email para confirmação.",
        });
        setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      toast({
        variant: "destructive",
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contato" className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Entre em contato com um de nossos consultores
            </h2>
            <p className="text-lg opacity-90">
              Preencha o formulário e descubra como podemos ajudar sua empresa
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Seu nome*</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">E-mail*</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Telefone*</label>
                <Input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Empresa</label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  placeholder="Nome da empresa"
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 font-medium">Mensagem</label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 min-h-32"
                placeholder="Como podemos ajudar?"
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              variant="secondary"
              className="w-full md:w-auto font-semibold"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar mensagem"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
