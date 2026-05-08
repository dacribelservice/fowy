"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";

export type TimeFilter = "D" | "S" | "M";

export interface ChartPoint {
  label: string;
  value: number;
  fullLabel: string;
}

export interface UseFowySalesDataProps {
  businessId: string;
  filter: TimeFilter;
}

export interface UseFowySalesDataReturn {
  loading: boolean;
  chartData: ChartPoint[];
  points: Array<{
    x: number;
    y: number;
    value: number;
    label: string;
    fullLabel: string;
  }>;
  totalPeriodSales: number;
  maxValue: number;
  pathD: string;
  areaD: string;
}

interface DBOrder {
  total_amount: number | null;
  created_at: string | null;
  status: string | null;
}

export function useFowySalesData({
  businessId,
  filter,
}: UseFowySalesDataProps): UseFowySalesDataReturn {
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchSalesData() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("total_amount, created_at, status")
          .eq("business_id", businessId)
          .eq("status", "completed")
          .order("created_at", { ascending: true });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching sales data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (businessId) {
      fetchSalesData();
    }
  }, [businessId, supabase]);

  // Procesamiento de datos según el filtro seleccionado
  const chartData = useMemo<ChartPoint[]>(() => {
    if (loading) return [];

    const now = new Date();

    if (filter === "D") {
      // Últimos 7 días con rellenado de $0 si no hay ventas
      const days: ChartPoint[] = [];
      const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
      const fullDayNames = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];

      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        
        const year = d.getFullYear();
        const month = d.getMonth();
        const date = d.getDate();

        // Sumar ventas de este día de manera segura comparando año, mes y día en la zona horaria local
        const totalSales = orders
          .filter((o) => {
            if (!o.created_at) return false;
            const orderDate = new Date(o.created_at);
            return (
              orderDate.getFullYear() === year &&
              orderDate.getMonth() === month &&
              orderDate.getDate() === date
            );
          })
          .reduce((sum, o) => sum + (o.total_amount || 0), 0);

        days.push({
          label: dayNames[d.getDay()],
          value: totalSales,
          fullLabel: `${fullDayNames[d.getDay()]} ${d.getDate()}`,
        });
      }
      return days;
    }

    if (filter === "S") {
      // Últimas 6 semanas con rellenado de $0
      const weeks: ChartPoint[] = [];
      for (let i = 5; i >= 0; i--) {
        const start = new Date();
        start.setDate(now.getDate() - (i + 1) * 7);
        const end = new Date();
        end.setDate(now.getDate() - i * 7);

        const totalSales = orders
          .filter((o) => {
            if (!o.created_at) return false;
            const orderDate = new Date(o.created_at);
            return orderDate >= start && orderDate < end;
          })
          .reduce((sum, o) => sum + (o.total_amount || 0), 0);

        const label = i === 0 ? "Act" : `S-${i}`;
        weeks.push({
          label,
          value: totalSales,
          fullLabel: `Semana del ${start.getDate()}/${start.getMonth() + 1} al ${end.getDate()}/${end.getMonth() + 1}`,
        });
      }
      return weeks;
    }

    if (filter === "M") {
      // Últimos 6 meses con rellenado de $0
      const months: ChartPoint[] = [];
      const monthNames = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      const fullMonthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];

      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setDate(1); // Prevenir bug de fin de mes
        d.setMonth(now.getMonth() - i);
        const year = d.getFullYear();
        const monthIndex = d.getMonth();

        const totalSales = orders
          .filter((o) => {
            if (!o.created_at) return false;
            const orderDate = new Date(o.created_at);
            return (
              orderDate.getFullYear() === year &&
              orderDate.getMonth() === monthIndex
            );
          })
          .reduce((sum, o) => sum + (o.total_amount || 0), 0);

        months.push({
          label: monthNames[monthIndex],
          value: totalSales,
          fullLabel: `${fullMonthNames[monthIndex]} ${year}`,
        });
      }
      return months;
    }

    return [];
  }, [orders, filter, loading]);

  const totalPeriodSales = useMemo(() => {
    return chartData.reduce((sum, p) => sum + p.value, 0);
  }, [chartData]);

  // Configuración de dimensiones del SVG (idéntica a la original para consistencia)
  const width = 500;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxValue = useMemo(() => {
    const max = Math.max(...chartData.map((d) => d.value), 0);
    return max === 0 ? 10000 : max * 1.15; // Añadir margen del 15% arriba
  }, [chartData]);

  const points = useMemo(() => {
    if (chartData.length === 0) return [];

    return chartData.map((d, i) => {
      const x = paddingLeft + (i * chartWidth) / (chartData.length - 1);
      const y = height - paddingBottom - (d.value / maxValue) * chartHeight;
      return { x, y, value: d.value, label: d.label, fullLabel: d.fullLabel };
    });
  }, [chartData, maxValue, chartWidth, chartHeight, height]);

  // Generar cadena SVG Path con curvas Bezier cúbicas suaves
  const pathD = useMemo(() => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [points]);

  // Generar el path cerrado para el degradado de fondo
  const areaD = useMemo(() => {
    if (points.length === 0) return "";
    return `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;
  }, [points, pathD, height]);

  return {
    loading,
    chartData,
    points,
    totalPeriodSales,
    maxValue,
    pathD,
    areaD,
  };
}
