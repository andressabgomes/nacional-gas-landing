/**
 * Função utilitária para fazer scroll suave até uma seção
 * @param elementId - ID do elemento para onde fazer scroll
 * @param offset - Offset adicional em pixels (opcional)
 */
export const scrollToSection = (elementId: string, offset: number = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

