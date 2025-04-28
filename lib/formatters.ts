/**
 * Formata um valor numérico para o formato de moeda brasileira (R$)
 */
export function formatarPreco(valor: number | undefined | null): string {
  // Garantir que o valor seja um número válido
  const valorNumerico = typeof valor === "number" && !isNaN(valor) ? valor : 0;
  return `R$${valorNumerico.toFixed(2).replace(".", ",")}`;
}

/**
 * Formata uma data ISO para o formato brasileiro (DD/MM/YYYY)
 */
export function formatarData(dataISO: string | undefined | null): string {
  if (!dataISO) {
    return "Data não disponível";
  }

  try {
    const data = new Date(dataISO);
    // Verificar se a data é válida
    if (isNaN(data.getTime())) {
      return "Data inválida";
    }

    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data inválida";
  }
}

/**
 * Formata um CPF/CNPJ adicionando pontuação
 */
export function formatarDocumento(
  documento: string | undefined | null,
): string {
  if (!documento) {
    return "";
  }

  // Remove caracteres não numéricos
  const apenasNumeros = documento.replace(/\D/g, "");

  // Verifica se é CPF ou CNPJ
  if (apenasNumeros.length === 11) {
    // CPF: 000.000.000-00
    return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (apenasNumeros.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return apenasNumeros.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  }

  // Se não for CPF nem CNPJ, retorna o valor original
  return documento;
}
