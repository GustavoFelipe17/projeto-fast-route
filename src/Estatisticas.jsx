import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { FaCalendarAlt, FaChartPie, FaChartBar } from 'react-icons/fa';

// Função para obter o primeiro e último dia do mês atual
const getMesAtualRange = () => {
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    return { inicio: primeiroDia.toISOString().split('T')[0], fim: ultimoDia.toISOString().split('T')[0] };
};

// Função para obter o primeiro e último dia do mês passado
const getMesPassadoRange = () => {
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
    return { inicio: primeiroDia.toISOString().split('T')[0], fim: ultimoDia.toISOString().split('T')[0] };
};

// Função para obter o range dos últimos X dias
const getUltimosXDiasRange = (days) => {
    const hoje = new Date();
    const fim = hoje.toISOString().split('T')[0];
    const inicioDate = new Date(hoje);
    inicioDate.setDate(hoje.getDate() - (days - 1));
    const inicio = inicioDate.toISOString().split('T')[0];
    return { inicio, fim };
};

function Estatisticas({ tarefas }) {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('ultimos30dias');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    let range;
    switch (periodoSelecionado) {
      case 'ultimos7dias':
        range = getUltimosXDiasRange(7);
        break;
      case 'ultimos30dias':
        range = getUltimosXDiasRange(30);
        break;
      case 'esteMes':
        range = getMesAtualRange();
        break;
      case 'mesPassado':
        range = getMesPassadoRange();
        break;
      case 'personalizado':
        return;
      default:
        range = getUltimosXDiasRange(30);
    }
    setDataInicio(range.inicio);
    setDataFim(range.fim);
    setShowDatePicker(false);
  }, [periodoSelecionado]);

  // ⭐ FILTRO CORRIGIDO - usar múltiplos campos para data de finalização
  const tarefasFiltradas = useMemo(() => {
    if (!tarefas || tarefas.length === 0) return [];
    
    return tarefas.filter(tarefa => {
      const isStatusValido = tarefa.status === 'Concluída' || tarefa.status === 'Cancelada';
      if (!isStatusValido) return false;

      // ⭐ BUSCAR DATA DE FINALIZAÇÃO EM MÚLTIPLOS CAMPOS
      let dataFinalizacao = tarefa.data_finalizacao || tarefa.dataFinalizacao || tarefa.dataCancelamento || tarefa.dataAtualizacao;
      
      // Se não tem data de finalização, usar data atual para tarefas concluídas/canceladas
      if (!dataFinalizacao && isStatusValido) {
        dataFinalizacao = new Date().toISOString().split('T')[0];
      }
      
      if (!dataFinalizacao) return false;

      // ⭐ NORMALIZAR FORMATO DA DATA
      const dataFormatada = dataFinalizacao.split('T')[0]; // Remove hora se houver

      if (periodoSelecionado === 'personalizado') {
        if (dataInicio && dataFim) {
          return dataFormatada >= dataInicio && dataFormatada <= dataFim;
        }
        return false; 
      }
      
      if (dataInicio && dataFim) {
        return dataFormatada >= dataInicio && dataFormatada <= dataFim;
      }
      
      return false; 
    });
  }, [tarefas, periodoSelecionado, dataInicio, dataFim]);

  // ⭐ DADOS DO GRÁFICO PIZZA - Distribuição por Tipo
  const dadosGraficoPizza = useMemo(() => {
    if (tarefasFiltradas.length === 0) return [];
    
    const entregas = tarefasFiltradas.filter(t => t.tipo === 'Entrega').length;
    const retiradas = tarefasFiltradas.filter(t => t.tipo === 'Retirada').length;
    
    const dados = [];
    if (entregas > 0) dados.push({ name: 'Entregas', value: entregas, fill: '#3B82F6' });
    if (retiradas > 0) dados.push({ name: 'Retiradas', value: retiradas, fill: '#F59E0B' });
    
    return dados;
  }, [tarefasFiltradas]);

  // ⭐ DADOS DO GRÁFICO BARRAS - Operações Diárias
  const dadosGraficoBarras = useMemo(() => {
    if (tarefasFiltradas.length === 0) return [];
    
    // Agrupar por data
    const agrupamentoPorData = tarefasFiltradas.reduce((acc, tarefa) => {
      let dataFinalizacao = tarefa.data_finalizacao || tarefa.dataFinalizacao || tarefa.dataCancelamento || tarefa.dataAtualizacao;
      
      if (!dataFinalizacao) {
        dataFinalizacao = new Date().toISOString().split('T')[0];
      }
      
      const dataFormatada = dataFinalizacao.split('T')[0];
      const dataObj = new Date(dataFormatada);
      const dataLabel = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      
      if (!acc[dataLabel]) {
        acc[dataLabel] = { name: dataLabel, entregas: 0, retiradas: 0 };
      }
      
      if (tarefa.tipo === 'Entrega') {
        acc[dataLabel].entregas++;
      } else if (tarefa.tipo === 'Retirada') {
        acc[dataLabel].retiradas++;
      }
      
      return acc;
    }, {});
    
    // Converter para array e ordenar por data
    return Object.values(agrupamentoPorData).sort((a, b) => {
      const [diaA, mesA] = a.name.split('/').map(Number);
      const [diaB, mesB] = b.name.split('/').map(Number);
      return new Date(2024, mesA - 1, diaA) - new Date(2024, mesB - 1, diaB);
    });
  }, [tarefasFiltradas]);

  const handlePeriodoChange = (e) => {
    const novoPeriodo = e.target.value;
    setPeriodoSelecionado(novoPeriodo);
    
    if (novoPeriodo === 'personalizado') {
      setShowDatePicker(true);
      setDataInicio('');
      setDataFim('');
    }
  };

  const tooltipPizzaFormatter = (value, name) => {
    return [value, name];
  };

  const labelPizzaFormatter = ({ name, percent, value }) => {
    const percentage = typeof percent === 'number' ? (percent * 100).toFixed(0) : 0;
    return `${name}: ${percentage}%`;
  };

  return (
    <div className="p-0 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Estatísticas</h1>
        <p className="text-gray-500 text-sm md:text-base">Visualize os dados de operações e tendências.</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-sky-700" />
            <label htmlFor="periodo" className="text-sm font-medium text-gray-700">Período:</label>
            <select
              id="periodo"
              value={periodoSelecionado}
              onChange={handlePeriodoChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 shadow-sm bg-white text-sm"
            >
              <option value="ultimos7dias">Últimos 7 dias</option>
              <option value="ultimos30dias">Últimos 30 dias</option>
              <option value="esteMes">Este Mês</option>
              <option value="mesPassado">Mês Passado</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </div>
          {showDatePicker && (
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 md:mt-0 md:ml-4">
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 shadow-sm text-sm"
                max={dataFim || undefined}
              />
              <span className="text-gray-500 text-sm">até</span>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 shadow-sm text-sm"
                min={dataInicio || undefined}
              />
            </div>
          )}
        </div>
      </div>

      {/* ⭐ CARD DE RESUMO ADICIONADO */}
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Resumo do Período</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{tarefasFiltradas.filter(t => t.tipo === 'Entrega').length}</div>
            <div className="text-sm text-gray-500">Entregas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{tarefasFiltradas.filter(t => t.tipo === 'Retirada').length}</div>
            <div className="text-sm text-gray-500">Retiradas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{tarefasFiltradas.filter(t => t.status === 'Concluída').length}</div>
            <div className="text-sm text-gray-500">Concluídas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{tarefasFiltradas.filter(t => t.status === 'Cancelada').length}</div>
            <div className="text-sm text-gray-500">Canceladas</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaChartPie className="text-sky-700" /> Distribuição de Operações (Tipos)
          </h3>
          {dadosGraficoPizza.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosGraficoPizza}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={labelPizzaFormatter} 
                >
                  {dadosGraficoPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={tooltipPizzaFormatter}/>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-10">Nenhum dado de operação (Concluída/Cancelada) encontrado para o período selecionado.</p>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaChartBar className="text-sky-700" /> Operações Diárias por Tipo (Concluídas/Canceladas)
          </h3>
           {dadosGraficoBarras.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosGraficoBarras} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }}/>
                <Bar dataKey="entregas" name="Entregas" fill="#3B82F6" radius={[4, 4, 0, 0]}/>
                <Bar dataKey="retiradas" name="Retiradas" fill="#F59E0B" radius={[4, 4, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <p className="text-center text-gray-500 py-10">Nenhum dado de operação (Concluída/Cancelada) encontrado para o período selecionado.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Estatisticas;