import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Resend } from "npm:resend@^4.0.0";

// Configuração do Resend
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const BACKOFFICE_EMAIL = Deno.env.get("BACKOFFICE_EMAIL") || "admin@nacionalgas.com";

// Inicializar cliente Resend
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

interface LeadData {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  message: string | null;
  created_at: string;
}

Deno.serve(async (req: Request) => {
  // CORS headers
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // Verificar se Resend está configurado
    if (!RESEND_API_KEY || !resend) {
      console.error("RESEND_API_KEY não configurada");
      return new Response(
        JSON.stringify({ error: "Serviço de email não configurado" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obter dados do lead do body
    const leadData: LeadData = await req.json();

    if (!leadData.email || !leadData.name) {
      return new Response(
        JSON.stringify({ error: "Dados do lead incompletos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Template de email para o cliente
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nacional Gás</h1>
            </div>
            <div class="content">
              <h2>Olá, ${leadData.name}!</h2>
              <p>Recebemos sua mensagem com sucesso.</p>
              <p>Nossa equipe de consultores entrará em contato em breve para apresentar as melhores soluções em energia para sua empresa.</p>
              <p><strong>Resumo do seu contato:</strong></p>
              <ul>
                <li><strong>Nome:</strong> ${leadData.name}</li>
                <li><strong>Email:</strong> ${leadData.email}</li>
                <li><strong>Telefone:</strong> ${leadData.phone}</li>
                ${leadData.company ? `<li><strong>Empresa:</strong> ${leadData.company}</li>` : ""}
                ${leadData.message ? `<li><strong>Mensagem:</strong> ${leadData.message}</li>` : ""}
              </ul>
              <p>Agradecemos seu interesse em fazer parte da transição energética!</p>
              <p>Atenciosamente,<br>Equipe Nacional Gás</p>
            </div>
            <div class="footer">
              <p>Este é um email automático, por favor não responda.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Template de email para o backoffice
    const backofficeEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .lead-info { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #dc2626; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Novo Lead Recebido</h1>
            </div>
            <div class="content">
              <h2>Um novo lead foi cadastrado no sistema</h2>
              <div class="lead-info">
                <p><strong>ID:</strong> ${leadData.id}</p>
                <p><strong>Nome:</strong> ${leadData.name}</p>
                <p><strong>Email:</strong> ${leadData.email}</p>
                <p><strong>Telefone:</strong> ${leadData.phone}</p>
                ${leadData.company ? `<p><strong>Empresa:</strong> ${leadData.company}</p>` : ""}
                ${leadData.message ? `<p><strong>Mensagem:</strong> ${leadData.message}</p>` : ""}
                <p><strong>Data:</strong> ${new Date(leadData.created_at).toLocaleString("pt-BR")}</p>
              </div>
              <p><a href="https://nacional-gas-landing.vercel.app/admin" style="background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver no sistema</a></p>
            </div>
            <div class="footer">
              <p>Nacional Gás - Sistema de Gerenciamento de Leads</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Usar domínio de teste do Resend se não houver domínio verificado
    // IMPORTANTE: Com domínio de teste, só é possível enviar para o email cadastrado no Resend
    // Para produção, configure um domínio no Resend e use: "Nacional Gás <noreply@seu-dominio.com>"
    const fromEmail = "onboarding@resend.dev";
    
    // Se usando domínio de teste, verificar se o email do cliente é o mesmo do backoffice
    // (limitação do Resend: só permite enviar para o próprio email no domínio de teste)
    const isTestDomain = fromEmail.includes("resend.dev");

    // Enviar email para o cliente
    // NOTA: Com domínio de teste do Resend, só é possível enviar para o email cadastrado
    // Em produção com domínio verificado, isso não será necessário
    let clientEmailSent = false;
    let clientEmailError = null;
    let clientEmailSkipped = false;
    let clientEmailId = null;
    
    try {
      // Se estiver usando domínio de teste, tentar enviar apenas se o email for o mesmo do backoffice
      // ou se não estiver usando domínio de teste (domínio verificado)
      if (isTestDomain && leadData.email.toLowerCase() !== BACKOFFICE_EMAIL.toLowerCase()) {
        clientEmailSkipped = true;
        clientEmailError = "Domínio de teste do Resend: só é possível enviar para o email cadastrado. Configure um domínio verificado para enviar para qualquer email.";
        console.log("Email para cliente pulado (domínio de teste):", leadData.email);
      } else {
        const { data: clientEmailData, error: clientEmailErr } = await resend.emails.send({
          from: fromEmail,
          to: [leadData.email],
          subject: "Recebemos sua mensagem - Nacional Gás",
          html: clientEmailHtml,
        });

        if (clientEmailErr) {
          clientEmailError = JSON.stringify(clientEmailErr);
          console.error("Erro ao enviar email para cliente:", clientEmailErr);
        } else {
          clientEmailSent = true;
          clientEmailId = clientEmailData?.id || null;
          console.log("Email para cliente enviado:", clientEmailData);
        }
      }
    } catch (err) {
      clientEmailError = err.message;
      console.error("Exceção ao enviar email para cliente:", err);
    }

    // Enviar email para o backoffice
    let backofficeEmailSent = false;
    let backofficeEmailError = null;
    let backofficeEmailId = null;
    
    try {
      const { data: backofficeEmailData, error: backofficeEmailErr } = await resend.emails.send({
        from: fromEmail,
        to: [BACKOFFICE_EMAIL],
        subject: `Novo Lead: ${leadData.name} - ${leadData.company || "Sem empresa"}`,
        html: backofficeEmailHtml,
      });

      if (backofficeEmailErr) {
        backofficeEmailError = JSON.stringify(backofficeEmailErr);
        console.error("Erro ao enviar email para backoffice:", backofficeEmailErr);
      } else {
        backofficeEmailSent = true;
        backofficeEmailId = backofficeEmailData?.id || null;
        console.log("Email para backoffice enviado:", backofficeEmailData);
      }
    } catch (err) {
      backofficeEmailError = err.message;
      console.error("Exceção ao enviar email para backoffice:", err);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Processamento concluído",
        clientEmailSent,
        clientEmailSkipped,
        clientEmailId,
        clientEmailError,
        backofficeEmailSent,
        backofficeEmailId,
        backofficeEmailError,
        note: isTestDomain ? "Usando domínio de teste do Resend. Configure um domínio verificado para enviar para qualquer email." : null,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao processar envio de emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});

