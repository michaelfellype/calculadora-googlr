import { CodeSection } from '../types/calculator';

export const RAW_PYTHON_CODE = `# ==============================================================================
# CALCULADORA BÁSICA COM INTERFACE GRÁFICA (TKINTER)
# Autor: Laboratório Didático de Python
# Objetivo: Realizar as 4 operações básicas com interface gráfica e tratamento de erros
# ==============================================================================

# 1. IMPORTAÇÃO DOS MÓDULOS NECESSÁRIOS
# O Tkinter já vem instalado por padrão no Python!
import tkinter as tk
from tkinter import messagebox


# ==============================================================================
# 2. FUNÇÕES MATEMÁTICAS PURAS (COM TRATAMENTO DE ERROS)
# Cada função recebe dois números e devolve o resultado da operação.
# ==============================================================================

def somar(a: float, b: float) -> float:
    """Retorna a soma de dois números."""
    return a + b

def subtrair(a: float, b: float) -> float:
    """Retorna a subtração de dois números."""
    return a - b

def multiplicar(a: float, b: float) -> float:
    """Retorna a multiplicação de dois números."""
    return a * b

def dividir(a: float, b: float) -> float:
    """
    Retorna a divisão do primeiro número pelo segundo.
    Previne o erro crítico ZeroDivisionError caso o divisor seja 0.
    """
    if b == 0:
        raise ZeroDivisionError("Não é permitido dividir por zero.")
    return a / b


# ==============================================================================
# 3. LÓGICA DE CONTROLE DO VISOR E EVENTOS DA INTERFACE
# ==============================================================================

def inserir_caractere(char: str):
    """Insere um número ou operador no final do visor da calculadora."""
    texto_atual = entrada_texto.get()
    
    # Se o visor estiver com "0" ou "Erro", limpa antes de digitar o novo valor
    if texto_atual == "0" or texto_atual == "Erro":
        entrada_texto.delete(0, tk.END)
        
    entrada_texto.insert(tk.END, char)

def limpar_visor():
    """Apaga todo o conteúdo do visor e restaura o zero inicial."""
    entrada_texto.delete(0, tk.END)
    entrada_texto.insert(0, "0")

def apagar_ultimo():
    """Apaga apenas o último caractere digitado (Backspace)."""
    texto_atual = entrada_texto.get()
    if len(texto_atual) > 1:
        entrada_texto.delete(len(texto_atual) - 1, tk.END)
    else:
        limpar_visor()

def calcular_resultado():
    """
    Lê a expressão matemática digitada no visor, calcula o resultado e
    trata possíveis exceções (divisão por zero ou sintaxe incorreta).
    """
    expressao = entrada_texto.get()
    
    # Substitui os símbolos visuais amigáveis pelos operadores reais do Python
    expressao_python = expressao.replace('×', '*').replace('÷', '/')

    try:
        # Validação básica de caracteres para evitar injeção de código inseguro
        caracteres_permitidos = "0123456789.+-*/ "
        for caractere in expressao_python:
            if caractere not in caracteres_permitidos:
                raise ValueError("Caractere inválido detectado.")

        # Realiza o cálculo com avaliação segura da expressão
        # Nota didática: em projetos avançados, usa-se um analisador sintático (parser)
        resultado = eval(expressao_python)

        # Se o resultado for um número inteiro exato (ex: 4.0), exibe apenas 4
        if isinstance(resultado, float) and resultado.is_integer():
            resultado = int(resultado)

        # Atualiza o visor com a resposta
        entrada_texto.delete(0, tk.END)
        entrada_texto.insert(0, str(resultado))

    except ZeroDivisionError:
        # Exibe uma caixa de diálogo nativa avisando o usuário
        messagebox.showerror(
            title="Erro Matemático",
            message="Divisão por zero não é permitida!"
        )
        limpar_visor()

    except (ValueError, SyntaxError):
        # Captura expressões incompletas ou com texto inválido (ex: '5++3')
        messagebox.showwarning(
            title="Expressão Inválida",
            message="Verifique a conta digitada. Use apenas números e operadores válidos."
        )
        limpar_visor()


# ==============================================================================
# 4. CRIAÇÃO E CONFIGURAÇÃO DA JANELA PRINCIPAL
# ==============================================================================

# Cria a instância da janela raiz (Root Window)
janela = tk.Tk()
janela.title("Calculadora Python Tkinter")
janela.geometry("320x420")
janela.resizable(False, False)       # Trava o tamanho para manter o layout elegante
janela.configure(bg="#1E293B")        # Fundo em tom ardósia moderno

# Visor da Calculadora (Entry widget com fonte grande e alinhamento à direita)
entrada_texto = tk.Entry(
    janela,
    font=("Arial", 22, "bold"),
    bg="#0F172A",
    fg="#F8FAFC",
    borderwidth=0,
    justify="right",
    insertbackground="#38BDF8"       # Cor do cursor piscante
)
# Posiciona o visor no topo, ocupando 4 colunas de largura
entrada_texto.grid(row=0, column=0, columnspan=4, padx=16, pady=(20, 16), ipady=12, sticky="nsew")
entrada_texto.insert(0, "0")


# ==============================================================================
# 5. CONSTRUÇÃO E ORGANIZAÇÃO DOS BOTÕES COM SISTEMA DE GRID
# ==============================================================================

# Lista com a estrutura de botões: (texto_visível, linha, coluna, cor_de_fundo)
botoes = [
    ('C',  1, 0, '#EF4444'), ('CE', 1, 1, '#64748B'), ('⌫', 1, 2, '#64748B'), ('÷',  1, 3, '#0284C7'),
    ('7',  2, 0, '#334155'), ('8',  2, 1, '#334155'), ('9', 2, 2, '#334155'), ('×',  2, 3, '#0284C7'),
    ('4',  3, 0, '#334155'), ('5',  3, 1, '#334155'), ('6', 3, 2, '#334155'), ('-',  3, 3, '#0284C7'),
    ('1',  4, 0, '#334155'), ('2',  4, 1, '#334155'), ('3', 4, 2, '#334155'), ('+',  4, 3, '#0284C7'),
    ('0',  5, 0, '#334155'), ('.',  5, 1, '#334155'), ('=', 5, 2, '#10B981')
]

# Configura as linhas e colunas para expandirem uniformemente
for i in range(4):
    janela.grid_columnconfigure(i, weight=1)
for i in range(1, 6):
    janela.grid_rowconfigure(i, weight=1)

# Cria cada botão dinamicamente através de um loop
for item in botoes:
    texto = item[0]
    linha = item[1]
    coluna = item[2]
    cor_fundo = item[3]
    
    # Define a ação de cada botão de acordo com seu texto
    if texto == 'C':
        comando = limpar_visor
    elif texto == 'CE':
        comando = limpar_visor
    elif texto == '⌫':
        comando = apagar_ultimo
    elif texto == '=':
        comando = calcular_resultado
    else:
        # Usa função lambda para passar o caractere específico como argumento
        comando = lambda c=texto: inserir_caractere(c)

    # Caso especial: o botão '=' ocupa 2 colunas para maior ergonomia
    span_coluna = 2 if texto == '=' else 1

    botao = tk.Button(
        janela,
        text=texto,
        font=("Arial", 14, "bold"),
        bg=cor_fundo,
        fg="#FFFFFF",
        activebackground="#475569",
        activeforeground="#FFFFFF",
        relief="flat",
        cursor="hand2",
        command=comando
    )
    botao.grid(row=linha, column=coluna, columnspan=span_coluna, padx=4, pady=4, sticky="nsew")


# ==============================================================================
# 6. INÍCIO DO LOOP PRINCIPAL DE EVENTOS (MAINLOOP)
# Mantém a janela aberta e escuta cliques do mouse e teclado.
# ==============================================================================
if __name__ == "__main__":
    janela.mainloop()
`;

export const CODE_SECTIONS: CodeSection[] = [
  {
    id: 'imports',
    title: '1. Importações (tkinter e messagebox)',
    startLine: 7,
    endLine: 11,
    summary: 'Importa a biblioteca nativa Tkinter para janelas e caixas de diálogo pop-up.',
    details: [
      'import tkinter as tk: Traz todo o kit de ferramentas gráficas do Python, usando o apelido comum "tk" para economizar digitação.',
      'from tkinter import messagebox: Importa o módulo responsável pelas caixas de diálogo modais nativas do sistema (como aviso de erro e confirmação).',
      'Vantagem: O Tkinter já vem embutido em qualquer instalação padrão do Python, não precisa instalar nada via pip!'
    ],
    keyConcepts: [
      {
        term: 'Biblioteca Nativa',
        explanation: 'Módulos que já vêm inclusos no instalador do Python (como math, sys, os e tkinter).'
      },
      {
        term: 'Alias (as tk)',
        explanation: 'Criar um apelido curto facilita chamar funções: tk.Button(...) em vez de tkinter.Button(...).'
      }
    ]
  },
  {
    id: 'operations',
    title: '2. Funções Matemáticas & Prevenção de Erros',
    startLine: 17,
    endLine: 38,
    summary: 'Funções puras para cada operação matemática básica, com validação de divisão por zero.',
    details: [
      'Cada função recebe dois argumentos (a e b) e retorna um float.',
      'Na função dividir(a, b), testamos se b == 0 antes de realizar o cálculo. Caso seja zero, disparamos a exceção ZeroDivisionError.',
      'Separar a matemática da interface visual é uma boa prática chamada de "Separação de Responsabilidades".'
    ],
    keyConcepts: [
      {
        term: 'Definição de Funções (def)',
        explanation: 'Bloco de código reutilizável que processa dados de entrada e retorna uma resposta com return.'
      },
      {
        term: 'ZeroDivisionError',
        explanation: 'Exceção que o Python gera quando tentamos dividir qualquer número por 0, pois isso é matematicamente indefinido.'
      }
    ]
  },
  {
    id: 'visor_logic',
    title: '3. Lógica do Visor e Tratamento de Exceções',
    startLine: 43,
    endLine: 106,
    summary: 'Manipula o texto na tela e usa try/except para capturar erros sem travar o aplicativo.',
    details: [
      'inserir_caractere: Adiciona dígitos ou operadores ao final do texto na caixa de entrada (tk.Entry).',
      'limpar_visor: Apaga a expressão atual e devolve o visor para 0.',
      'calcular_resultado: Lê a expressão, valida caracteres, executa a conta e usa blocos try / except para exibir caixas de erro amigáveis ao usuário caso ocorra uma divisão por zero ou sintaxe quebrada.'
    ],
    keyConcepts: [
      {
        term: 'try / except',
        explanation: 'Mecanismo que tenta executar um bloco arriscado de código; se der erro, salta para o except sem fechar o programa bruscamente.'
      },
      {
        term: 'messagebox.showerror',
        explanation: 'Abre uma janela pop-up do sistema operacional com ícone de erro e botão OK para alertar o usuário.'
      }
    ]
  },
  {
    id: 'ui_window',
    title: '4. Janela Principal (tk.Tk e tk.Entry)',
    startLine: 112,
    endLine: 133,
    summary: 'Inicializa a janela do aplicativo desktop, define títulos, tamanho e o visor numérico.',
    details: [
      'janela = tk.Tk(): Cria a janela principal do sistema operacional.',
      'janela.geometry("320x420"): Define largura de 320 pixels e altura de 420 pixels.',
      'janela.resizable(False, False): Impede que o usuário distorça o layout puxando as bordas.',
      'tk.Entry: O campo de texto que atua como visor numérico da calculadora.'
    ],
    keyConcepts: [
      {
        term: 'Root Window (Janela Raiz)',
        explanation: 'O contêiner principal que abriga todos os outros elementos gráficos (botões, rótulos, campos de texto).'
      },
      {
        term: 'tk.Entry',
        explanation: 'Widget do Tkinter usado para exibir ou receber uma linha de texto do usuário.'
      }
    ]
  },
  {
    id: 'buttons_grid',
    title: '5. Organização dos Botões com Sistema Grid',
    startLine: 139,
    endLine: 198,
    summary: 'Organiza todos os botões em linhas e colunas através de uma matriz inteligente.',
    details: [
      'Usa o gerenciador de layout .grid(row=linha, column=coluna) para organizar botões perfeitamente alinhados como em uma tabela.',
      'Loop for item in botoes: Em vez de escrever 16 botões manualmente, usamos uma lista de tuplas e um loop conciso.',
      'comando = lambda c=texto: inserir_caractere(c): Permite passar parâmetros para a função quando o botão for clicado.'
    ],
    keyConcepts: [
      {
        term: 'Grid Layout',
        explanation: 'Gerenciador do Tkinter que organiza a tela em grade de linhas (rows) e colunas (columns).'
      },
      {
        term: 'Funções Lambda',
        explanation: 'Funções anônimas de uma única linha no Python, muito úteis para passar parâmetros para eventos de botões.'
      }
    ]
  },
  {
    id: 'event_loop',
    title: '6. Loop de Eventos (janela.mainloop)',
    startLine: 204,
    endLine: 207,
    summary: 'Mantém a janela aberta e responsiva aos cliques do usuário.',
    details: [
      'janela.mainloop(): É o coração de qualquer aplicativo Tkinter.',
      'Esse método executa um loop infinito que fica escutando eventos: cliques do mouse, teclas pressionadas e comandos de fechar.',
      'Sem o mainloop(), o Python executaria o script de ponta a ponta e a janela fecharia em uma fração de segundo!'
    ],
    keyConcepts: [
      {
        term: 'Event Loop (Loop de Eventos)',
        explanation: 'Ciclo contínuo de processamento que aguarda e despacha eventos e mensagens no programa gráfico.'
      },
      {
        term: 'if __name__ == "__main__":',
        explanation: 'Garante que o código da calculadora só rode quando o arquivo for executado diretamente, e não quando importado.'
      }
    ]
  }
];
