import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Shield } from "lucide-react";

export const AdminLink = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) return null;

  return (
    <Button
      onClick={() => navigate("/admin")}
      variant="outline"
      className="fixed top-4 right-4 z-50"
    >
      <Shield className="w-4 h-4 mr-2" />
      Painel Admin
    </Button>
  );
};
