# Dashboard TI — Exercicio2_Pedro_Varela_Pinto_VF02

Projecto Final TI · Power BI — Help Desk · Cibersegurança · Gestão de Ativos TI.

## Como abrir e gerar o .pbix (cerca de 2 minutos)
O dashboard é entregue como **projecto Power BI (.pbip)**, o formato de texto oficial da Microsoft. O Power BI Desktop constrói o modelo sozinho e, se encontrar algum problema, indica o ficheiro e a linha.

1. Descompactar `DashTI.zip` numa pasta curta, por exemplo `C:\PBI\`. Fica a pasta `DashTI` com `DashTI.pbip`, `DashTI.Report` e `DashTI.SemanticModel`. O caminho mais longo dentro do zip tem 97 caracteres.
2. Fazer duplo clique em **`DashTI.pbip`**.
3. Os visuais aparecem vazios. Clicar em **Home › Refresh** para carregar os dados do Excel `IT_Dashboard_Dados.xlsx`, que está no mesmo caminho do ficheiro VF original.
   - Se o Excel estiver noutra pasta: **Transform data › Data source settings › Change Source**.
4. **File › Save as** → escolher o tipo **.pbix** → `Exercicio2_Pedro_Varela_Pinto_VF02.pbix`.

Se o mapa aparecer em branco, activar **File › Options and settings › Options › Security › Map and Filled Map visuals**.

## Conteúdo

**Modelo de dados (modelo em estrela)**
- 10 tabelas do Excel, com as mesmas consultas Power Query do VF.
- Tabela **Calendário** em DAX: `CALENDAR ( DATE ( 2024, 1, 1 ), DATE ( 2025, 12, 31 ) )`, com Ano, MêsNum, MesAno (ordenado) e Trimestre. Está marcada como tabela de datas.
- Relações:
  - Tickets → Técnicos (N:1)
  - Incidentes[Investigador] → Técnicos (N:1)
  - Tickets, Hardware, Software e Renovações → Departamentos
  - Calendário → Tickets[Data_Abertura] (activa)
  - Calendário → Vulnerabilidades e Renovações (inactivas)
- 82 medidas DAX em pastas (Help Desk, Cibersegurança, Ativos TI, Visão Geral).
- `País_Origem` tem a categoria **País** (Country), para o mapa.

**Relatório (5 páginas, fundo escuro + faixa bege, botões de navegação em todas as páginas)**

| Página | Conteúdo |
|---|---|
| 1. Visão Geral | 5 KPIs (Total Tickets, Tickets Abertos, Incidentes Críticos, % SLA, Renovações Urgentes) · Top 5 categorias · Scorecard MoM (Tickets, Incidentes, % SLA, Custos TI) com setas e cores · Ataques por tipo e ano · Resumo anual · Hardware por departamento |
| 2. Help Desk | KPIs (Abertos, % SLA, Tempo Médio, Satisfação) · Linha mensal Total vs Fechados · Gauge % SLA (meta 95%) · Top 5 técnicos · Matriz Técnicos × Ano com barras de dados · Treemap por categoria · Filtros: Período, Departamento (sincronizado), Técnico |
| 3. Cibersegurança | KPIs (Total, Críticos, Taxa de Bloqueio, Impacto €, Impacto médio) · Mapa preenchido por país · Ribbon de severidade por mês · Vulnerabilidades abertas por CVSS (cores) · Colunas 100% por tipo de ataque · Donut de bloqueados · Filtros: Período, Severidade, Tipo de Ataque |
| 4. Ativos TI | KPIs (Total HW, Valor HW, % Licenças, Renovações Urgentes, Garantias a 90 dias) · Renovações com cores (Expirado/Urgente/Em Breve/OK) ordenadas por data · Donut por tipo · Matriz de software · Custo por departamento · Licenças adquiridas vs utilizadas · Filtros: Departamento (sincronizado), Tipo, Estado |
| 5. Detalhe Técnico | **Drill-through** em `HELPDESK_Técnicos[Técnico]` · Botão Voltar · Técnico seleccionado + 5 KPIs · Combo de tickets e custo médio por mês · Gauge de satisfação vs média da equipa · Tabela de tickets com SLA a cores |

Drill-through: na página Help Desk, clicar com o botão direito num técnico (Top 5 ou Matriz) › *Drill through* › *Detalhe Técnico*.

## Medidas DAX

### Total Tickets
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `#,0`
```dax
Total Tickets =
COUNTROWS ( HELPDESK_Tickets )
```

### Tickets Abertos
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `#,0`
```dax
Tickets Abertos =
CALCULATE ( [Total Tickets], HELPDESK_Tickets[Estado] = "Aberto" ) + 0
```

### Tickets Fechados
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `#,0`
```dax
Tickets Fechados =
CALCULATE ( [Total Tickets], HELPDESK_Tickets[Estado] = "Fechado" ) + 0
```

### Tickets Não Fechados
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `#,0`
```dax
Tickets Não Fechados =
CALCULATE ( [Total Tickets], HELPDESK_Tickets[Estado] <> "Fechado" ) + 0
```

### Tickets SLA Cumprido
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `#,0`
```dax
Tickets SLA Cumprido =
CALCULATE ( [Total Tickets], HELPDESK_Tickets[SLA_Cumprido] = "Sim" ) + 0
```

### % SLA Cumprido
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `0.0%;-0.0%;0.0%`
```dax
% SLA Cumprido =
DIVIDE ( [Tickets SLA Cumprido], [Total Tickets] )
```

### Meta SLA
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `0.0%;-0.0%;0.0%`
```dax
Meta SLA =
0.95
```

### SLA Mínimo
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `0.0%;-0.0%;0.0%`
```dax
SLA Mínimo =
0
```

### SLA Máximo
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `0.0%;-0.0%;0.0%`
```dax
SLA Máximo =
1
```

### Tempo Médio Resolução
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `#,0.00`
```dax
Tempo Médio Resolução =
AVERAGE ( HELPDESK_Tickets[Tempo_Resolução_H] )
```

### Satisfação Média
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `#,0.00`
```dax
Satisfação Média =
AVERAGE ( HELPDESK_Tickets[Satisfação] )
```

### Satisfação Equipa
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `#,0.00`
```dax
Satisfação Equipa =
CALCULATE ( [Satisfação Média], REMOVEFILTERS ( 'HELPDESK_Técnicos' ), REMOVEFILTERS ( HELPDESK_Tickets[Técnico] ) )
```

### Satisfação Mínima
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `#,0.00`
```dax
Satisfação Mínima =
1
```

### Satisfação Máxima
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `#,0.00`
```dax
Satisfação Máxima =
5
```

### Custo Total Tickets
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `#,0.00 €;-#,0.00 €;#,0.00 €`
```dax
Custo Total Tickets =
SUM ( HELPDESK_Tickets[Custo_€] )
```

### Custo Médio por Ticket
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `#,0.00 €;-#,0.00 €;#,0.00 €`
```dax
Custo Médio por Ticket =
DIVIDE ( [Custo Total Tickets], [Total Tickets] )
```

### % Total Tickets
Tabela `HELPDESK_Tickets` · pasta *Help Desk* · formato `0.00%;-0.00%;0.00%`
```dax
% Total Tickets =
DIVIDE ( [Total Tickets], CALCULATE ( [Total Tickets], ALLSELECTED () ) )
```

### Técnico Selecionado
Tabela `HELPDESK_Tickets` · pasta *Help Desk*
```dax
Técnico Selecionado =
SELECTEDVALUE ( 'HELPDESK_Técnicos'[Técnico], "Todos os Técnicos" )
```

### Cor SLA
Tabela `HELPDESK_Tickets` · pasta *Help Desk*
```dax
Cor SLA =
SWITCH ( TRUE (), ISBLANK ( [% SLA Cumprido] ), "#9AA5B1", [% SLA Cumprido] >= [Meta SLA], "#2ECC71", [% SLA Cumprido] >= 0.85, "#F39C12", "#E74C3C" )
```

### Cor SLA Ticket
Tabela `HELPDESK_Tickets` · pasta *Help Desk*
```dax
Cor SLA Ticket =
SWITCH ( SELECTEDVALUE ( HELPDESK_Tickets[SLA_Cumprido] ), "Sim", "#82E0AA", "Não", "#F1948A" )
```

### Tickets Mês Atual
Tabela `HELPDESK_Tickets` · pasta *Help Desk\MoM* · formato `#,0`
```dax
Tickets Mês Atual =
VAR _ref = MAX ( HELPDESK_Tickets[Data_Abertura] )
VAR _ini = EOMONTH ( _ref, -1 ) + 1
VAR _fim = EOMONTH ( _ref, 0 )
RETURN
    CALCULATE (
        [Total Tickets],
        REMOVEFILTERS ( HELPDESK_Tickets[Ano], HELPDESK_Tickets[Mês], HELPDESK_Tickets[Semana] ),
        HELPDESK_Tickets[Data_Abertura] >= _ini && HELPDESK_Tickets[Data_Abertura] <= _fim
    )
```

### Tickets Mês Anterior
Tabela `HELPDESK_Tickets` · pasta *Help Desk\MoM* · formato `#,0`
```dax
Tickets Mês Anterior =
VAR _ref = MAX ( HELPDESK_Tickets[Data_Abertura] )
VAR _ini = EOMONTH ( _ref, -2 ) + 1
VAR _fim = EOMONTH ( _ref, -1 )
RETURN
    CALCULATE (
        [Total Tickets],
        REMOVEFILTERS ( HELPDESK_Tickets[Ano], HELPDESK_Tickets[Mês], HELPDESK_Tickets[Semana] ),
        HELPDESK_Tickets[Data_Abertura] >= _ini && HELPDESK_Tickets[Data_Abertura] <= _fim
    )
```

### MoM Tickets %
Tabela `HELPDESK_Tickets` · pasta *Help Desk\MoM* · formato `0.00%;-0.00%;0.00%`
```dax
MoM Tickets % =
DIVIDE ( [Tickets Mês Atual] - [Tickets Mês Anterior], [Tickets Mês Anterior] )
```

### % SLA Mês Atual
Tabela `HELPDESK_Tickets` · pasta *Help Desk\MoM* · formato `0.0%;-0.0%;0.0%`
```dax
% SLA Mês Atual =
VAR _ref = MAX ( HELPDESK_Tickets[Data_Abertura] )
VAR _ini = EOMONTH ( _ref, -1 ) + 1
VAR _fim = EOMONTH ( _ref, 0 )
RETURN
    CALCULATE (
        [% SLA Cumprido],
        REMOVEFILTERS ( HELPDESK_Tickets[Ano], HELPDESK_Tickets[Mês], HELPDESK_Tickets[Semana] ),
        HELPDESK_Tickets[Data_Abertura] >= _ini && HELPDESK_Tickets[Data_Abertura] <= _fim
    )
```

### % SLA Mês Anterior
Tabela `HELPDESK_Tickets` · pasta *Help Desk\MoM* · formato `0.0%;-0.0%;0.0%`
```dax
% SLA Mês Anterior =
VAR _ref = MAX ( HELPDESK_Tickets[Data_Abertura] )
VAR _ini = EOMONTH ( _ref, -2 ) + 1
VAR _fim = EOMONTH ( _ref, -1 )
RETURN
    CALCULATE (
        [% SLA Cumprido],
        REMOVEFILTERS ( HELPDESK_Tickets[Ano], HELPDESK_Tickets[Mês], HELPDESK_Tickets[Semana] ),
        HELPDESK_Tickets[Data_Abertura] >= _ini && HELPDESK_Tickets[Data_Abertura] <= _fim
    )
```

### Var SLA p.p.
Tabela `HELPDESK_Tickets` · pasta *Help Desk\MoM* · formato `+0.0;-0.0;0.0`
```dax
Var SLA p.p. =
( [% SLA Mês Atual] - [% SLA Mês Anterior] ) * 100
```

### Tickets YTD
Tabela `HELPDESK_Tickets` · pasta *Help Desk\MoM* · formato `#,0`
```dax
Tickets YTD =
VAR _ref = MAX ( HELPDESK_Tickets[Data_Abertura] )
RETURN
    CALCULATE ( [Total Tickets], REMOVEFILTERS ( HELPDESK_Tickets[Mês], HELPDESK_Tickets[Semana] ), HELPDESK_Tickets[Data_Abertura] >= DATE ( YEAR ( _ref ), 1, 1 ) && HELPDESK_Tickets[Data_Abertura] <= _ref )
```

### Total Incidentes
Tabela `CYBER_Incidentes` · pasta *Cibersegurança* · formato `#,0`
```dax
Total Incidentes =
COUNTROWS ( CYBER_Incidentes )
```

### Incidentes Críticos
Tabela `CYBER_Incidentes` · pasta *Cibersegurança* · formato `#,0`
```dax
Incidentes Críticos =
CALCULATE ( [Total Incidentes], CYBER_Incidentes[Severidade] = "Crítico" ) + 0
```

### Incidentes Bloqueados
Tabela `CYBER_Incidentes` · pasta *Cibersegurança* · formato `#,0`
```dax
Incidentes Bloqueados =
CALCULATE ( [Total Incidentes], CYBER_Incidentes[Bloqueado] = "Sim" ) + 0
```

### Taxa de Bloqueio
Tabela `CYBER_Incidentes` · pasta *Cibersegurança* · formato `0.00%;-0.00%;0.00%`
```dax
Taxa de Bloqueio =
DIVIDE ( [Incidentes Bloqueados], [Total Incidentes] )
```

### Impacto Total
Tabela `CYBER_Incidentes` · pasta *Cibersegurança* · formato `#,0 €;-#,0 €;#,0 €`
```dax
Impacto Total =
SUM ( CYBER_Incidentes[Impacto_€] )
```

### Impacto Não Bloqueado
Tabela `CYBER_Incidentes` · pasta *Cibersegurança* · formato `#,0 €;-#,0 €;#,0 €`
```dax
Impacto Não Bloqueado =
CALCULATE ( [Impacto Total], CYBER_Incidentes[Bloqueado] = "Não" )
```

### Impacto Médio por Incidente
Tabela `CYBER_Incidentes` · pasta *Cibersegurança* · formato `#,0 €;-#,0 €;#,0 €`
```dax
Impacto Médio por Incidente =
DIVIDE ( [Impacto Total], [Total Incidentes] )
```

### Tempo Médio Deteção (min)
Tabela `CYBER_Incidentes` · pasta *Cibersegurança* · formato `#,0.00`
```dax
Tempo Médio Deteção (min) =
AVERAGE ( CYBER_Incidentes[Tempo_Deteção_Min] )
```

### Incidentes Mês Atual
Tabela `CYBER_Incidentes` · pasta *Cibersegurança\MoM* · formato `#,0`
```dax
Incidentes Mês Atual =
VAR _ref = MAX ( CYBER_Incidentes[Data_Hora] )
VAR _ini = EOMONTH ( _ref, -1 ) + 1
VAR _fim = EOMONTH ( _ref, 0 ) + 1
RETURN
    CALCULATE (
        [Total Incidentes],
        REMOVEFILTERS ( CYBER_Incidentes[Ano], CYBER_Incidentes[Mês] ),
        CYBER_Incidentes[Data_Hora] >= _ini && CYBER_Incidentes[Data_Hora] < _fim
    )
```

### Incidentes Mês Anterior
Tabela `CYBER_Incidentes` · pasta *Cibersegurança\MoM* · formato `#,0`
```dax
Incidentes Mês Anterior =
VAR _ref = MAX ( CYBER_Incidentes[Data_Hora] )
VAR _ini = EOMONTH ( _ref, -2 ) + 1
VAR _fim = EOMONTH ( _ref, -1 ) + 1
RETURN
    CALCULATE (
        [Total Incidentes],
        REMOVEFILTERS ( CYBER_Incidentes[Ano], CYBER_Incidentes[Mês] ),
        CYBER_Incidentes[Data_Hora] >= _ini && CYBER_Incidentes[Data_Hora] < _fim
    )
```

### MoM Incidentes %
Tabela `CYBER_Incidentes` · pasta *Cibersegurança\MoM* · formato `0.00%;-0.00%;0.00%`
```dax
MoM Incidentes % =
DIVIDE ( [Incidentes Mês Atual] - [Incidentes Mês Anterior], [Incidentes Mês Anterior] )
```

### Impacto Mês Atual
Tabela `CYBER_Incidentes` · pasta *Cibersegurança\MoM* · formato `#,0 €;-#,0 €;#,0 €`
```dax
Impacto Mês Atual =
VAR _ref = MAX ( CYBER_Incidentes[Data_Hora] )
VAR _ini = EOMONTH ( _ref, -1 ) + 1
VAR _fim = EOMONTH ( _ref, 0 ) + 1
RETURN
    CALCULATE (
        [Impacto Total],
        REMOVEFILTERS ( CYBER_Incidentes[Ano], CYBER_Incidentes[Mês] ),
        CYBER_Incidentes[Data_Hora] >= _ini && CYBER_Incidentes[Data_Hora] < _fim
    )
```

### Impacto Mês Anterior
Tabela `CYBER_Incidentes` · pasta *Cibersegurança\MoM* · formato `#,0 €;-#,0 €;#,0 €`
```dax
Impacto Mês Anterior =
VAR _ref = MAX ( CYBER_Incidentes[Data_Hora] )
VAR _ini = EOMONTH ( _ref, -2 ) + 1
VAR _fim = EOMONTH ( _ref, -1 ) + 1
RETURN
    CALCULATE (
        [Impacto Total],
        REMOVEFILTERS ( CYBER_Incidentes[Ano], CYBER_Incidentes[Mês] ),
        CYBER_Incidentes[Data_Hora] >= _ini && CYBER_Incidentes[Data_Hora] < _fim
    )
```

### Incidentes YTD
Tabela `CYBER_Incidentes` · pasta *Cibersegurança\MoM* · formato `#,0`
```dax
Incidentes YTD =
VAR _ref = MAX ( CYBER_Incidentes[Data_Hora] )
RETURN
    CALCULATE ( [Total Incidentes], REMOVEFILTERS ( CYBER_Incidentes[Mês] ), CYBER_Incidentes[Data_Hora] >= DATE ( YEAR ( _ref ), 1, 1 ) && CYBER_Incidentes[Data_Hora] <= _ref )
```

### Total Incidentes (por Ano)
Tabela `CYBER_Incidentes` · pasta *Visão Geral* · formato `#,0`
```dax
Total Incidentes (por Ano) =
CALCULATE ( [Total Incidentes], TREATAS ( VALUES ( HELPDESK_Tickets[Ano] ), CYBER_Incidentes[Ano] ) )
```

### Impacto (por Ano)
Tabela `CYBER_Incidentes` · pasta *Visão Geral* · formato `#,0.00 €;-#,0.00 €;#,0.00 €`
```dax
Impacto (por Ano) =
CALCULATE ( [Impacto Total], TREATAS ( VALUES ( HELPDESK_Tickets[Ano] ), CYBER_Incidentes[Ano] ) )
```

### Total Vulnerabilidades
Tabela `CYBER_Vulnerabilidades` · pasta *Cibersegurança\Vulnerabilidades* · formato `#,0`
```dax
Total Vulnerabilidades =
COUNTROWS ( CYBER_Vulnerabilidades )
```

### Vulnerabilidades Abertas
Tabela `CYBER_Vulnerabilidades` · pasta *Cibersegurança\Vulnerabilidades* · formato `#,0`
```dax
Vulnerabilidades Abertas =
CALCULATE ( [Total Vulnerabilidades], CYBER_Vulnerabilidades[Estado] = "Aberta" ) + 0
```

### Vulnerabilidades Críticas Abertas
Tabela `CYBER_Vulnerabilidades` · pasta *Cibersegurança\Vulnerabilidades* · formato `#,0`
```dax
Vulnerabilidades Críticas Abertas =
CALCULATE ( [Total Vulnerabilidades], CYBER_Vulnerabilidades[Estado] = "Aberta", CYBER_Vulnerabilidades[Criticidade] = "Crítico" ) + 0
```

### CVSS Médio
Tabela `CYBER_Vulnerabilidades` · pasta *Cibersegurança\Vulnerabilidades* · formato `#,0.00`
```dax
CVSS Médio =
AVERAGE ( CYBER_Vulnerabilidades[CVSS_Score] )
```

### Dias em Aberto Médio
Tabela `CYBER_Vulnerabilidades` · pasta *Cibersegurança\Vulnerabilidades* · formato `#,0.00`
```dax
Dias em Aberto Médio =
CALCULATE ( AVERAGE ( CYBER_Vulnerabilidades[Dias_Aberto] ), CYBER_Vulnerabilidades[Estado] = "Aberta" )
```

### Cor CVSS
Tabela `CYBER_Vulnerabilidades` · pasta *Cibersegurança\Vulnerabilidades*
```dax
Cor CVSS =
VAR _s = MAX ( CYBER_Vulnerabilidades[CVSS_Score] )
RETURN
    SWITCH ( TRUE (), _s >= 9, "#F1948A", _s >= 7, "#F5B041", _s >= 4, "#F9E79F", "#82E0AA" )
```

### Total Hardware
Tabela `ATIVOS_Hardware` · pasta *Ativos TI* · formato `#,0`
```dax
Total Hardware =
COUNTROWS ( ATIVOS_Hardware )
```

### Hardware Ativo
Tabela `ATIVOS_Hardware` · pasta *Ativos TI* · formato `#,0`
```dax
Hardware Ativo =
CALCULATE ( [Total Hardware], ATIVOS_Hardware[Estado] = "Ativo" ) + 0
```

### Valor Total HW
Tabela `ATIVOS_Hardware` · pasta *Ativos TI* · formato `#,0 €;-#,0 €;#,0 €`
```dax
Valor Total HW =
SUM ( ATIVOS_Hardware[Custo_Aquisição_€] )
```

### Custo Manutenção HW
Tabela `ATIVOS_Hardware` · pasta *Ativos TI* · formato `#,0 €;-#,0 €;#,0 €`
```dax
Custo Manutenção HW =
SUM ( ATIVOS_Hardware[Custo_Manutenção_€] )
```

### Garantias a Expirar 90d
Tabela `ATIVOS_Hardware` · pasta *Ativos TI* · formato `#,0`
```dax
Garantias a Expirar 90d =
VAR _hoje = TODAY ()
RETURN
    CALCULATE ( [Total Hardware], ATIVOS_Hardware[Data_Garantia] >= _hoje && ATIVOS_Hardware[Data_Garantia] <= _hoje + 90 ) + 0
```

### Licenças Adquiridas
Tabela `ATIVOS_Software` · pasta *Ativos TI\Software* · formato `#,0`
```dax
Licenças Adquiridas =
SUM ( ATIVOS_Software[Licenças_Adquiridas] )
```

### Licenças Utilizadas
Tabela `ATIVOS_Software` · pasta *Ativos TI\Software* · formato `#,0`
```dax
Licenças Utilizadas =
SUM ( ATIVOS_Software[Licenças_Utilizadas] )
```

### Licenças Disponíveis
Tabela `ATIVOS_Software` · pasta *Ativos TI\Software* · formato `#,0`
```dax
Licenças Disponíveis =
SUM ( ATIVOS_Software[Licenças_Disponíveis] )
```

### % Licenças Utilizadas
Tabela `ATIVOS_Software` · pasta *Ativos TI\Software* · formato `0.00%;-0.00%;0.00%`
```dax
% Licenças Utilizadas =
DIVIDE ( [Licenças Utilizadas], [Licenças Adquiridas] )
```

### Drift Licenças
Tabela `ATIVOS_Software` · pasta *Ativos TI\Software* · formato `#,0`
```dax
Drift Licenças =
[Licenças Adquiridas] - [Licenças Utilizadas]
```

### Custo Anual Software
Tabela `ATIVOS_Software` · pasta *Ativos TI\Software* · formato `#,0.00 €;-#,0.00 €;#,0.00 €`
```dax
Custo Anual Software =
SUM ( ATIVOS_Software[Custo_Anual_€] )
```

### Custo Licenças Desperdiçadas
Tabela `ATIVOS_Software` · pasta *Ativos TI\Software* · formato `#,0.00 €;-#,0.00 €;#,0.00 €`
```dax
Custo Licenças Desperdiçadas =
SUMX ( ATIVOS_Software, ATIVOS_Software[Licenças_Disponíveis] * ATIVOS_Software[Custo_Por_Licença_€] )
```

### Total Renovações
Tabela `ATIVOS_Renovações` · pasta *Ativos TI\Renovações* · formato `#,0`
```dax
Total Renovações =
COUNTROWS ( 'ATIVOS_Renovações' )
```

### Renovações Urgentes
Tabela `ATIVOS_Renovações` · pasta *Ativos TI\Renovações* · formato `#,0`
```dax
Renovações Urgentes =
CALCULATE ( [Total Renovações], 'ATIVOS_Renovações'[Estado_Alerta] = "Urgente" ) + 0
```

### Renovações Em Breve
Tabela `ATIVOS_Renovações` · pasta *Ativos TI\Renovações* · formato `#,0`
```dax
Renovações Em Breve =
CALCULATE ( [Total Renovações], 'ATIVOS_Renovações'[Estado_Alerta] = "Em Breve" ) + 0
```

### Renovações Expiradas
Tabela `ATIVOS_Renovações` · pasta *Ativos TI\Renovações* · formato `#,0`
```dax
Renovações Expiradas =
CALCULATE ( [Total Renovações], 'ATIVOS_Renovações'[Estado_Alerta] = "Expirado" ) + 0
```

### Custo Renovações
Tabela `ATIVOS_Renovações` · pasta *Ativos TI\Renovações* · formato `#,0.00 €;-#,0.00 €;#,0.00 €`
```dax
Custo Renovações =
SUM ( 'ATIVOS_Renovações'[Custo_€] )
```

### Cor Estado Alerta
Tabela `ATIVOS_Renovações` · pasta *Ativos TI\Renovações*
```dax
Cor Estado Alerta =
SWITCH ( SELECTEDVALUE ( 'ATIVOS_Renovações'[Estado_Alerta] ), "Expirado", "#F1948A", "Urgente", "#F5B041", "Em Breve", "#F9E79F", "OK", "#82E0AA" )
```

### Custos TI Mês Atual
Tabela `HELPDESK_Tickets` · pasta *Visão Geral* · formato `#,0 €;-#,0 €;#,0 €`
```dax
Custos TI Mês Atual =
[Custo Total Tickets Mês Atual] + [Impacto Mês Atual]
```

### Custos TI Mês Anterior
Tabela `HELPDESK_Tickets` · pasta *Visão Geral* · formato `#,0 €;-#,0 €;#,0 €`
```dax
Custos TI Mês Anterior =
[Custo Total Tickets Mês Anterior] + [Impacto Mês Anterior]
```

### Custo Total Tickets Mês Atual
Tabela `HELPDESK_Tickets` · pasta *Visão Geral* · formato `#,0 €;-#,0 €;#,0 €`
```dax
Custo Total Tickets Mês Atual =
VAR _ref = MAX ( HELPDESK_Tickets[Data_Abertura] )
VAR _ini = EOMONTH ( _ref, -1 ) + 1
VAR _fim = EOMONTH ( _ref, 0 )
RETURN
    CALCULATE (
        [Custo Total Tickets],
        REMOVEFILTERS ( HELPDESK_Tickets[Ano], HELPDESK_Tickets[Mês], HELPDESK_Tickets[Semana] ),
        HELPDESK_Tickets[Data_Abertura] >= _ini && HELPDESK_Tickets[Data_Abertura] <= _fim
    )
```

### Custo Total Tickets Mês Anterior
Tabela `HELPDESK_Tickets` · pasta *Visão Geral* · formato `#,0 €;-#,0 €;#,0 €`
```dax
Custo Total Tickets Mês Anterior =
VAR _ref = MAX ( HELPDESK_Tickets[Data_Abertura] )
VAR _ini = EOMONTH ( _ref, -2 ) + 1
VAR _fim = EOMONTH ( _ref, -1 )
RETURN
    CALCULATE (
        [Custo Total Tickets],
        REMOVEFILTERS ( HELPDESK_Tickets[Ano], HELPDESK_Tickets[Mês], HELPDESK_Tickets[Semana] ),
        HELPDESK_Tickets[Data_Abertura] >= _ini && HELPDESK_Tickets[Data_Abertura] <= _fim
    )
```

### MoM Custos TI %
Tabela `HELPDESK_Tickets` · pasta *Visão Geral* · formato `0.00%;-0.00%;0.00%`
```dax
MoM Custos TI % =
DIVIDE ( [Custos TI Mês Atual] - [Custos TI Mês Anterior], [Custos TI Mês Anterior] )
```

### Scorecard Tickets
Tabela `HELPDESK_Tickets` · pasta *Visão Geral*
```dax
Scorecard Tickets =
VAR _v = [MoM Tickets %]
RETURN
    IF (
        ISBLANK ( _v ), "–",
        SWITCH ( TRUE (), _v > 0, "▲ ", _v < 0, "▼ ", "→ " ) & FORMAT ( _v, "+0.0%;-0.0%;0.0%" )
    )
```

### Scorecard Incidentes
Tabela `HELPDESK_Tickets` · pasta *Visão Geral*
```dax
Scorecard Incidentes =
VAR _v = [MoM Incidentes %]
RETURN
    IF (
        ISBLANK ( _v ), "–",
        SWITCH ( TRUE (), _v > 0, "▲ ", _v < 0, "▼ ", "→ " ) & FORMAT ( _v, "+0.0%;-0.0%;0.0%" )
    )
```

### Scorecard SLA
Tabela `HELPDESK_Tickets` · pasta *Visão Geral*
```dax
Scorecard SLA =
VAR _v = [Var SLA p.p.]
RETURN
    IF (
        ISBLANK ( _v ), "–",
        SWITCH ( TRUE (), _v > 0, "▲ ", _v < 0, "▼ ", "→ " ) & FORMAT ( _v, "+0.0;-0.0;0.0" ) & " p.p."
    )
```

### Scorecard Custos
Tabela `HELPDESK_Tickets` · pasta *Visão Geral*
```dax
Scorecard Custos =
VAR _v = [MoM Custos TI %]
RETURN
    IF (
        ISBLANK ( _v ), "–",
        SWITCH ( TRUE (), _v > 0, "▲ ", _v < 0, "▼ ", "→ " ) & FORMAT ( _v, "+0.0%;-0.0%;0.0%" )
    )
```

### Cor Scorecard Tickets
Tabela `HELPDESK_Tickets` · pasta *Visão Geral*
```dax
Cor Scorecard Tickets =
VAR _v = [MoM Tickets %]
RETURN
    SWITCH ( TRUE (), ISBLANK ( _v ), "#9AA5B1", _v < 0, "#2ECC71", _v > 0, "#E74C3C", "#F39C12" )
```

### Cor Scorecard Incidentes
Tabela `HELPDESK_Tickets` · pasta *Visão Geral*
```dax
Cor Scorecard Incidentes =
VAR _v = [MoM Incidentes %]
RETURN
    SWITCH ( TRUE (), ISBLANK ( _v ), "#9AA5B1", _v < 0, "#2ECC71", _v > 0, "#E74C3C", "#F39C12" )
```

### Cor Scorecard SLA
Tabela `HELPDESK_Tickets` · pasta *Visão Geral*
```dax
Cor Scorecard SLA =
VAR _v = [Var SLA p.p.]
RETURN
    SWITCH ( TRUE (), ISBLANK ( _v ), "#9AA5B1", _v > 0, "#2ECC71", _v < 0, "#E74C3C", "#F39C12" )
```

### Cor Scorecard Custos
Tabela `HELPDESK_Tickets` · pasta *Visão Geral*
```dax
Cor Scorecard Custos =
VAR _v = [MoM Custos TI %]
RETURN
    SWITCH ( TRUE (), ISBLANK ( _v ), "#9AA5B1", _v < 0, "#2ECC71", _v > 0, "#E74C3C", "#F39C12" )
```

### Título Dashboard
Tabela `HELPDESK_Tickets` · pasta *Visão Geral*
```dax
Título Dashboard =
"Dashboard TI  ·  " & FORMAT ( MIN ( HELPDESK_Tickets[Data_Abertura] ), "yyyy" ) & "–" & FORMAT ( MAX ( HELPDESK_Tickets[Data_Abertura] ), "yyyy" )
```

### Período Referência MoM
Tabela `HELPDESK_Tickets` · pasta *Visão Geral*
```dax
Período Referência MoM =
VAR _ref = MAX ( HELPDESK_Tickets[Data_Abertura] )
RETURN
    "Mês actual: " & FORMAT ( _ref, "mmm yyyy" ) & "  vs  " & FORMAT ( EOMONTH ( _ref, -1 ), "mmm yyyy" )
```
